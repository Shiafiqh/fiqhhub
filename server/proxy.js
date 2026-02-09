require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Determine static files directory
const parentDir = path.join(__dirname, '..');
const hasParentIndex = fs.existsSync(path.join(parentDir, 'index.html'));
const staticDir = hasParentIndex ? parentDir : __dirname;

console.log('Static files directory:', staticDir);
app.use(express.static(staticDir));

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'messages array required' });
    }
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-key-here') {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL || 'gpt-4o-mini',
                messages,
                max_tokens: 1500,
                temperature: 0.7
            })
        });
        const data = await response.json();
        if (data.error) {
            return res.status(response.status).json({ error: data.error.message });
        }
        const answer = data.choices?.[0]?.message?.content || 'No response received.';
        res.json({ answer });
    } catch (err) {
        console.error('OpenAI API error:', err.message);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        hasKey: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key-here',
        staticDir: staticDir,
        files: fs.readdirSync(staticDir).slice(0, 20)
    });
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
    const indexPath = path.join(staticDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html not found. Static dir: ' + staticDir);
    }
});

app.listen(PORT, () => {
    console.log(`FiqhHub server running on port ${PORT}`);
    console.log(`Static dir: ${staticDir}`);
    console.log(`API key configured: ${!!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key-here'}`);
});
