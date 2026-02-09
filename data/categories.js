// ============================================
// FiqhHub — Categories Database
// ============================================

window.CATEGORIES = [
    { id: 'taharat', name: 'Taharat', arabic: 'الطهارة', icon: '💧', desc: 'Ritual purity — wudu, ghusl, tayammum, types of water, najasaat, mutahhirat', order: 1 },
    { id: 'salat', name: 'Salat', arabic: 'الصلاة', icon: '🕌', desc: 'Prayer — daily, Friday, congregational, traveler, Eid, signs, recommended', order: 2 },
    { id: 'sawm', name: 'Sawm', arabic: 'الصوم', icon: '🌙', desc: 'Fasting — Ramadan, conditions, invalidators, kaffarah, fidyah, recommended fasts', order: 3 },
    { id: 'hajj', name: 'Hajj & Umrah', arabic: 'الحج والعمرة', icon: '🕋', desc: 'Pilgrimage — conditions, rites, ihram, tawaf, sa\'i, Mina, Arafat, proxy hajj', order: 4 },
    { id: 'khums', name: 'Khums', arabic: 'الخمس', icon: '💰', desc: 'One-fifth tax — calculation, exemptions, year-end accounting, sahm al-Imam, sahm al-Sadat', order: 5 },
    { id: 'zakat', name: 'Zakat', arabic: 'الزكاة', icon: '🤲', desc: 'Alms-giving — nisab, eligible wealth, distribution categories, zakat al-fitrah', order: 6 },
    { id: 'nikah', name: 'Marriage (Nikah)', arabic: 'النكاح', icon: '💍', desc: 'Marriage — permanent, temporary (mut\'ah), conditions, mahr, rights, looking, interfaith', order: 7 },
    { id: 'talaq', name: 'Divorce (Talaq)', arabic: 'الطلاق', icon: '📜', desc: 'Divorce — types, iddah, khul, mubarat, li\'an, conditions, revocable vs irrevocable', order: 8 },
    { id: 'trade', name: 'Trade & Commerce', arabic: 'التجارة والبيع', icon: '⚖️', desc: 'Business transactions — conditions of sale, forbidden transactions, options, partnerships', order: 9 },
    { id: 'food', name: 'Food & Drink', arabic: 'الأطعمة والأشربة', icon: '🍽️', desc: 'Dietary laws — halal/haram, seafood, meat conditions, alcohol, gelatin, dining with non-Muslims', order: 10 },
    { id: 'clothing', name: 'Clothing & Hijab', arabic: 'اللباس والحجاب', icon: '👘', desc: 'Dress code — hijab requirements, men\'s clothing, silk, gold, prayer clothing, western attire', order: 11 },
    { id: 'music', name: 'Music & Entertainment', arabic: 'الموسيقى واللهو', icon: '🎵', desc: 'Music, instruments, singing, entertainment, film, games, mourning chants', order: 12 },
    { id: 'medical', name: 'Medical Ethics', arabic: 'الأخلاق الطبية', icon: '🏥', desc: 'Organ donation, IVF, contraception, autopsy, gender reassignment, euthanasia, vaccination', order: 13 },
    { id: 'digital', name: 'Digital & Technology', arabic: 'التكنولوجيا', icon: '💻', desc: 'Cryptocurrency, AI, social media, VPN, online gambling, digital privacy, gaming', order: 14 },
    { id: 'banking', name: 'Banking & Finance', arabic: 'المصرفية والمالية', icon: '🏦', desc: 'Interest (riba), mortgages, insurance, Islamic banking, stocks, loans, credit cards', order: 15 },
    { id: 'death', name: 'Death & Burial', arabic: 'أحكام الأموات', icon: '⚰️', desc: 'Ghusl al-mayyit, shrouding, burial prayer, grave, mourning, visiting graves, will', order: 16 },
    { id: 'jihad', name: 'Jihad & Defense', arabic: 'الجهاد والدفاع', icon: '🛡️', desc: 'Defensive jihad, conditions, peace treaties, prisoners, military service, self-defense', order: 17 },
    { id: 'judiciary', name: 'Judiciary & Testimony', arabic: 'القضاء والشهادة', icon: '⚖️', desc: 'Islamic courts, qualifications of judge, testimony conditions, evidence, dispute resolution', order: 18 },
    { id: 'inheritance', name: 'Inheritance', arabic: 'الإرث', icon: '📋', desc: 'Distribution shares, classes of heirs, conditions, debts, will limits, blocking', order: 19 },
    { id: 'oaths', name: 'Oaths & Vows', arabic: 'النذر والأيمان', icon: '🤝', desc: 'Nazr, qasam, ahd — conditions, binding nature, expiation for breaking', order: 20 },
    { id: 'waqf', name: 'Waqf & Charity', arabic: 'الوقف والصدقة', icon: '🕌', desc: 'Endowments, conditions, management, sadaqah, charitable trusts', order: 21 },
    { id: 'custody', name: 'Custody & Children', arabic: 'الحضانة والأطفال', icon: '👶', desc: 'Child custody, breastfeeding rights, guardianship, orphan care, rights of children', order: 22 },
    { id: 'taqlid', name: 'Taqlid & Ijtihad', arabic: 'التقليد والاجتهاد', icon: '📚', desc: 'Following a Marja, conditions of taqlid, switching Maraja, a\'lam, ijtihad qualifications', order: 23 },
    { id: 'amr', name: 'Enjoining Good', arabic: 'الأمر بالمعروف', icon: '✋', desc: 'Amr bil-ma\'ruf and nahy anil-munkar — conditions, methods, limits, obligation levels', order: 24 },
    { id: 'hunting', name: 'Hunting & Slaughtering', arabic: 'الصيد والذباحة', icon: '🔪', desc: 'Halal slaughter conditions, hunting with dogs/weapons, fishing, stunning, Ahlul Kitab slaughter', order: 25 },
    { id: 'ijarah', name: 'Rental & Employment', arabic: 'الإجارة', icon: '🏢', desc: 'Rental contracts, employment law, wages, conditions, forbidden employment, freelancing', order: 26 },
    { id: 'interaction', name: 'Gender Interaction', arabic: 'التعامل بين الجنسين', icon: '🚻', desc: 'Mahram/non-mahram, looking, handshaking, workplace interaction, mixed gatherings', order: 27 },
    { id: 'misc', name: 'Miscellaneous', arabic: 'متفرقات', icon: '📝', desc: 'Various rulings — photography, pets, tattoos, transplants, environment, sports, travel', order: 28 },
    { id: 'quran', name: 'Quran Rulings', arabic: 'أحكام القرآن', icon: '📖', desc: 'Touching Quran, recitation rules, menstruation, translation, tafsir etiquette', order: 29 }
];
