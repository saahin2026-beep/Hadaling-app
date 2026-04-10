/**
 * HADALING CURRICULUM v2.0
 *
 * 10 Lessons | 50 Chunks | 100 Exercises
 * Somali → English | Confidence-first | Offline-ready
 *
 * Structure per lesson:
 * - 5 chunks (A, B, C, D, E)
 * - 10 exercises (each chunk appears 2x)
 */

const lessonData = {

  // ============================================================
  // LESSON 1: Is-barasho fudud (Simple introductions)
  // ============================================================
  1: {
    id: 1,
    titleSo: "Is-barasho fudud",
    titleEn: "Simple introductions",
    ability: "inaad naftaada ku barato qof cusub",
    explanation: [
      "Marka aad qof cusub kulanto, waxaad u baahan tahay inaad is barato.",
      "Ereyadan waa kuwa aad isticmaali doonto maalin walba."
    ],
    chunks: [
      { id: "1-A", en: "Hi, I'm ___.", so: "Salaan, waxaan ahay ___." },
      { id: "1-B", en: "Nice to meet you.", so: "Waan ku faraxsanahay inaan ku barto." },
      { id: "1-C", en: "What's your name?", so: "Magacaa?" },
      { id: "1-D", en: "My name is ___.", so: "Magacaygu waa ___." },
      { id: "1-E", en: "And you?", so: "Adiga?" }
    ],
    exercises: [
      { type: "choose", chunkId: "1-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Hi, I'm Ahmed.", options: ["Salaan, waxaan ahay Ahmed.", "Magacaa?", "Nabad gelyo."], correctIndex: 0 },
      { type: "choose", chunkId: "1-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Nice to meet you.", options: ["Waan ku faraxsanahay inaan ku barto.", "Sidee tahay?", "Mahadsanid."], correctIndex: 0 },
      { type: "fillgap", chunkId: "1-C", instruction: "Buuxi meesha banaan:", sentence: ["What's", "___", "name?"], blankIndex: 1, options: ["your", "my", "his"], correctIndex: 0 },
      { type: "order", chunkId: "1-A", instruction: "Isku habee erayada:", hint: "Salaan, waxaan ahay Fatima.", correctSentence: "Hi, I'm Fatima.", words: ["Fatima.", "I'm", "Hi,"] },
      { type: "listen", chunkId: "1-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "My name is Hassan.", prompt: "My name is Hassan.", options: ["Magacaygu waa Hassan.", "Waan ku faraxsanahay.", "Xaggee ka timid?"], correctIndex: 0 },
      { type: "scenario", chunkId: "1-E", instruction: "Xaalad nolosha:", scenario: "Qof cusub ayaa isku barashay oo ku yiri magaciisa. Waxaad rabta inaad weydiiso magaciisa.", options: ["And you?", "Goodbye.", "Thank you."], correctIndex: 0 },
      { type: "fillgap", chunkId: "1-B", instruction: "Buuxi meesha banaan:", sentence: ["Nice", "to", "___", "you."], blankIndex: 2, options: ["meet", "see", "help"], correctIndex: 0 },
      { type: "choose", chunkId: "1-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Magacaa?", options: ["What's your name?", "How are you?", "Where are you from?"], correctIndex: 0 },
      { type: "order", chunkId: "1-E", instruction: "Isku habee erayada:", hint: "Adiga?", correctSentence: "And you?", words: ["you?", "And"] },
      { type: "scenario", chunkId: "1-A,1-D", instruction: "Xaalad nolosha:", scenario: "Shaqada ayaad ku kulantay qof cusub. Waxaad rabta inaad is barato oo aad magacaaga sheegto.", options: ["Hi, I'm ___. Nice to meet you.", "Goodbye. See you later.", "I don't understand."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 2: Sidee tahay? (How are you?)
  // ============================================================
  2: {
    id: 2,
    titleSo: "Sidee tahay?",
    titleEn: "How are you?",
    ability: "inaad weydiiso qof siduu yahay oo aad si edeb ah ugu jawaabto",
    explanation: [
      "Dadka Ingiriisiga ku hadla waxay is weydiiyaan 'How are you?' maalin walba.",
      "Waa habka ugu fudud ee aad xiriir ku bilowdo."
    ],
    chunks: [
      { id: "2-A", en: "How are you?", so: "Sidee tahay?" },
      { id: "2-B", en: "I'm fine, thanks.", so: "Waan fiicnahay, mahadsanid." },
      { id: "2-C", en: "I'm good.", so: "Waan wanaagsanahay." },
      { id: "2-D", en: "Not bad.", so: "Xaal ma xumayn." },
      { id: "2-E", en: "And you?", so: "Adiga sidee?" }
    ],
    exercises: [
      { type: "choose", chunkId: "2-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "How are you?", options: ["Sidee tahay?", "Magacaa?", "Xaggee ka timid?"], correctIndex: 0 },
      { type: "choose", chunkId: "2-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I'm fine, thanks.", options: ["Waan fiicnahay, mahadsanid.", "Waan ku faraxsanahay.", "Nabad gelyo."], correctIndex: 0 },
      { type: "fillgap", chunkId: "2-C", instruction: "Buuxi meesha banaan:", sentence: ["I'm", "___."], blankIndex: 1, options: ["good", "name", "from"], correctIndex: 0 },
      { type: "order", chunkId: "2-A", instruction: "Isku habee erayada:", hint: "Sidee tahay?", correctSentence: "How are you?", words: ["you?", "are", "How"] },
      { type: "listen", chunkId: "2-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "Not bad.", prompt: "Not bad.", options: ["Xaal ma xumayn.", "Waan fiicnahay.", "Mahadsanid."], correctIndex: 0 },
      { type: "scenario", chunkId: "2-E", instruction: "Xaalad nolosha:", scenario: "Qof baa ku weydiiyay sidaad tahay. Waxaad u jawaabtay, hadda waxaad rabta inaad isaga weydiiso.", options: ["And you?", "Goodbye.", "My name is ___."], correctIndex: 0 },
      { type: "fillgap", chunkId: "2-B", instruction: "Buuxi meesha banaan:", sentence: ["I'm", "___,", "thanks."], blankIndex: 1, options: ["fine", "name", "from"], correctIndex: 0 },
      { type: "choose", chunkId: "2-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Waan wanaagsanahay.", options: ["I'm good.", "How are you?", "Nice to meet you."], correctIndex: 0 },
      { type: "order", chunkId: "2-E", instruction: "Isku habee erayada:", hint: "Adiga sidee?", correctSentence: "And you?", words: ["you?", "And"] },
      { type: "scenario", chunkId: "2-A,2-D", instruction: "Xaalad nolosha:", scenario: "Saaxiibkaag ayaa kugu yiri 'How are you?' Xaaladaadu waa hagaag. Maxaad tiraahdaa?", options: ["Not bad. And you?", "My name is ___.", "Goodbye."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 3: Salaan iyo sagootin
  // ============================================================
  3: {
    id: 3,
    titleSo: "Salaan iyo sagootin",
    titleEn: "Greetings and goodbyes",
    ability: "inaad wada hadal si edeb ah u bilowdo oo u dhamaystirto",
    explanation: [
      "Salaanta iyo sagootintu waa muhiim. Dadka Ingiriisiga ku hadla waxay isticmaalaan erayo kala duwan.",
      "Casharkan waxa uu kuu bari doonaa sida aad wada hadal u furto oo u xirto."
    ],
    chunks: [
      { id: "3-A", en: "Good morning.", so: "Subax wanaagsan." },
      { id: "3-B", en: "Good evening.", so: "Fiid wanaagsan." },
      { id: "3-C", en: "Goodbye.", so: "Nabad gelyo." },
      { id: "3-D", en: "See you later.", so: "Is aragnaa." },
      { id: "3-E", en: "Have a good day.", so: "Maalin wanaagsan." }
    ],
    exercises: [
      { type: "choose", chunkId: "3-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Good morning.", options: ["Subax wanaagsan.", "Fiid wanaagsan.", "Nabad gelyo."], correctIndex: 0 },
      { type: "choose", chunkId: "3-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Good evening.", options: ["Fiid wanaagsan.", "Subax wanaagsan.", "Mahadsanid."], correctIndex: 0 },
      { type: "fillgap", chunkId: "3-C", instruction: "Buuxi meesha banaan:", sentence: ["Good", "___."], blankIndex: 1, options: ["bye", "name", "you"], correctIndex: 0 },
      { type: "order", chunkId: "3-A", instruction: "Isku habee erayada:", hint: "Subax wanaagsan.", correctSentence: "Good morning.", words: ["morning.", "Good"] },
      { type: "listen", chunkId: "3-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "See you later.", prompt: "See you later.", options: ["Is aragnaa.", "Nabad gelyo.", "Subax wanaagsan."], correctIndex: 0 },
      { type: "scenario", chunkId: "3-E", instruction: "Xaalad nolosha:", scenario: "Waxaad saaxiibkaag ka tegaysaa subaxdii. Waxaad rabta inaad u rajaynayso maalin fiican.", options: ["Have a good day.", "How are you?", "What's your name?"], correctIndex: 0 },
      { type: "fillgap", chunkId: "3-B", instruction: "Buuxi meesha banaan:", sentence: ["Good", "___."], blankIndex: 1, options: ["evening", "morning", "name"], correctIndex: 0 },
      { type: "choose", chunkId: "3-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Nabad gelyo.", options: ["Goodbye.", "Good morning.", "See you later."], correctIndex: 0 },
      { type: "order", chunkId: "3-E", instruction: "Isku habee erayada:", hint: "Maalin wanaagsan.", correctSentence: "Have a good day.", words: ["day.", "good", "a", "Have"] },
      { type: "scenario", chunkId: "3-A,3-D", instruction: "Xaalad nolosha:", scenario: "Waa subax. Waxaad deriskaa aragtay oo doonaysaa inaad salaan oo tagtid.", options: ["Good morning. See you later!", "I want water.", "How much is this?"], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 4: Haa, Maya, Mahadsanid
  // ============================================================
  4: {
    id: 4,
    titleSo: "Haa, Maya, Mahadsanid",
    titleEn: "Yes, No, Thank you",
    ability: "inaad si cad oo edeb ah ugu jawaabto",
    explanation: [
      "Jawaabaha ugu muhiimsan ee Ingiriisiga waa 'Yes', 'No', iyo 'Thank you'.",
      "Ereyadan waxaad isticmaali doontaa wada hadal kasta."
    ],
    chunks: [
      { id: "4-A", en: "Yes.", so: "Haa." },
      { id: "4-B", en: "No.", so: "Maya." },
      { id: "4-C", en: "Thank you.", so: "Mahadsanid." },
      { id: "4-D", en: "You're welcome.", so: "Adigaa mudan." },
      { id: "4-E", en: "No problem.", so: "Wax dhib ah ma jiro." }
    ],
    exercises: [
      { type: "choose", chunkId: "4-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Yes.", options: ["Haa.", "Maya.", "Mahadsanid."], correctIndex: 0 },
      { type: "choose", chunkId: "4-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "No.", options: ["Maya.", "Haa.", "Fadlan."], correctIndex: 0 },
      { type: "fillgap", chunkId: "4-C", instruction: "Buuxi meesha banaan:", sentence: ["Thank", "___."], blankIndex: 1, options: ["you", "me", "him"], correctIndex: 0 },
      { type: "order", chunkId: "4-A", instruction: "Isku habee erayada:", hint: "Haa, fadlan.", correctSentence: "Yes, please.", words: ["please.", "Yes,"] },
      { type: "listen", chunkId: "4-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "You're welcome.", prompt: "You're welcome.", options: ["Adigaa mudan.", "Mahadsanid.", "Haa."], correctIndex: 0 },
      { type: "scenario", chunkId: "4-E", instruction: "Xaalad nolosha:", scenario: "Qof baa ku yiri 'Thank you' kaddib markaad caawisay. Maxaad ugu jawaabtaa?", options: ["No problem.", "How are you?", "Goodbye."], correctIndex: 0 },
      { type: "fillgap", chunkId: "4-B", instruction: "Buuxi meesha banaan:", sentence: ["No,", "___."], blankIndex: 1, options: ["thanks", "name", "you"], correctIndex: 0 },
      { type: "choose", chunkId: "4-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Mahadsanid.", options: ["Thank you.", "Yes.", "Goodbye."], correctIndex: 0 },
      { type: "order", chunkId: "4-E", instruction: "Isku habee erayada:", hint: "Wax dhib ah ma jiro.", correctSentence: "No problem.", words: ["problem.", "No"] },
      { type: "scenario", chunkId: "4-A,4-D", instruction: "Xaalad nolosha:", scenario: "Baayicaha wuxuu ku weydiiyay 'Do you want a bag?' Waxaad rabtaa. Markaas wuxuu yiri 'Here you go.' Maxaad tiraahdaa?", options: ["Yes, please. Thank you!", "Goodbye.", "I don't understand."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 5: Waxaan rabaa...
  // ============================================================
  5: {
    id: 5,
    titleSo: "Waxaan rabaa...",
    titleEn: "I want...",
    ability: "inaad sheegto waxaad rabto",
    explanation: [
      "'I want' iyo 'I need' waa erayo aad u muhiim ah.",
      "Waxaad isticmaali doontaa suuqa, makhaayadda, iyo meel kasta."
    ],
    chunks: [
      { id: "5-A", en: "I want ___.", so: "Waxaan rabaa ___." },
      { id: "5-B", en: "I need ___.", so: "Waxaan u baahanahay ___." },
      { id: "5-C", en: "I don't want ___.", so: "Ma rabo ___." },
      { id: "5-D", en: "Can I have ___?", so: "Ma heli karaa ___?" },
      { id: "5-E", en: "Please.", so: "Fadlan." }
    ],
    exercises: [
      { type: "choose", chunkId: "5-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I want water.", options: ["Waxaan rabaa biyo.", "Waxaan u baahanahay biyo.", "Ma rabo biyo."], correctIndex: 0 },
      { type: "choose", chunkId: "5-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I need help.", options: ["Waxaan u baahanahay caawimaad.", "Waxaan rabaa caawimaad.", "Ma rabo caawimaad."], correctIndex: 0 },
      { type: "fillgap", chunkId: "5-C", instruction: "Buuxi meesha banaan:", sentence: ["I", "___", "want this."], blankIndex: 1, options: ["don't", "do", "can"], correctIndex: 0 },
      { type: "order", chunkId: "5-A", instruction: "Isku habee erayada:", hint: "Waxaan rabaa koob shaah.", correctSentence: "I want tea.", words: ["tea.", "want", "I"] },
      { type: "listen", chunkId: "5-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "Can I have the menu?", prompt: "Can I have the menu?", options: ["Ma heli karaa liiska cuntada?", "Waxaan rabaa liiska cuntada.", "Ma rabo liiska cuntada."], correctIndex: 0 },
      { type: "scenario", chunkId: "5-E", instruction: "Xaalad nolosha:", scenario: "Makhaayad ayaad joogtaa. Waxaad rabta biyo. Sidee ayaad si edeb ah u weydiisanaysaa?", options: ["Can I have water, please?", "Goodbye.", "How are you?"], correctIndex: 0 },
      { type: "fillgap", chunkId: "5-B", instruction: "Buuxi meesha banaan:", sentence: ["I", "___", "a doctor."], blankIndex: 1, options: ["need", "want", "have"], correctIndex: 0 },
      { type: "choose", chunkId: "5-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Ma rabo sonkor.", options: ["I don't want sugar.", "I want sugar.", "I need sugar."], correctIndex: 0 },
      { type: "order", chunkId: "5-E", instruction: "Isku habee erayada:", hint: "Biyo, fadlan.", correctSentence: "Water, please.", words: ["please.", "Water,"] },
      { type: "scenario", chunkId: "5-A,5-D", instruction: "Xaalad nolosha:", scenario: "Dukaan ayaad joogtaa. Waxaad aragtay qamiis aad jeceshahay. Sidee ayaad weydiisanaysaa?", options: ["I want this. Can I have it, please?", "Goodbye. See you later.", "My name is ___."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 6: Imisa?
  // ============================================================
  6: {
    id: 6,
    titleSo: "Imisa?",
    titleEn: "How much?",
    ability: "inaad weydiiso qiimaha oo aad ka jawaabto",
    explanation: [
      "Suuqa iyo dukaammada, waa inaad ogaato sida aad qiimaha u weydiiso.",
      "Ereyadan waxay kaa caawin doonaan inaad wax iibsato."
    ],
    chunks: [
      { id: "6-A", en: "How much?", so: "Imisa?" },
      { id: "6-B", en: "How much is this?", so: "Kani imisa yahay?" },
      { id: "6-C", en: "That's expensive.", so: "Waa qaali." },
      { id: "6-D", en: "That's okay.", so: "Waa hagaag." },
      { id: "6-E", en: "I'll take it.", so: "Waan qaadanayaa." }
    ],
    exercises: [
      { type: "choose", chunkId: "6-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "How much?", options: ["Imisa?", "Maxaad qabtaa?", "Xaggee?"], correctIndex: 0 },
      { type: "choose", chunkId: "6-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "How much is this?", options: ["Kani imisa yahay?", "Kani waa maxay?", "Kani xaggee buu jiraa?"], correctIndex: 0 },
      { type: "fillgap", chunkId: "6-C", instruction: "Buuxi meesha banaan:", sentence: ["That's", "___."], blankIndex: 1, options: ["expensive", "cheap", "good"], correctIndex: 0 },
      { type: "order", chunkId: "6-A", instruction: "Isku habee erayada:", hint: "Kani imisa yahay?", correctSentence: "How much is this?", words: ["this?", "is", "much", "How"] },
      { type: "listen", chunkId: "6-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "That's okay.", prompt: "That's okay.", options: ["Waa hagaag.", "Waa qaali.", "Waan qaadanayaa."], correctIndex: 0 },
      { type: "scenario", chunkId: "6-E", instruction: "Xaalad nolosha:", scenario: "Suuqa ayaad joogtaa. Qiimuhu waa $10. Waa qiimo fiican. Waxaad doonaysaa inaad iibsato.", options: ["I'll take it.", "That's expensive.", "Goodbye."], correctIndex: 0 },
      { type: "fillgap", chunkId: "6-B", instruction: "Buuxi meesha banaan:", sentence: ["How", "___", "is this?"], blankIndex: 1, options: ["much", "many", "are"], correctIndex: 0 },
      { type: "choose", chunkId: "6-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Waa qaali.", options: ["That's expensive.", "That's cheap.", "That's okay."], correctIndex: 0 },
      { type: "order", chunkId: "6-E", instruction: "Isku habee erayada:", hint: "Waan qaadanayaa.", correctSentence: "I'll take it.", words: ["it.", "take", "I'll"] },
      { type: "scenario", chunkId: "6-A,6-D", instruction: "Xaalad nolosha:", scenario: "Dukaan ayaad joogtaa. Waxaad aragtay buug. Waxaad rabta inaad ogaato qiimaha. Baayicuhu wuxuu ku yiri '$5.'", options: ["How much is this? — That's okay, I'll take it.", "My name is ___.", "I don't understand."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 7: Shaqo iyo nolol
  // ============================================================
  7: {
    id: 7,
    titleSo: "Shaqo iyo nolol",
    titleEn: "Talking about work",
    ability: "inaad weydiiso qof shaqadiisa oo aad u sheegto shaqadaada",
    explanation: [
      "Dadka waxay badanaa is weydiiyaan shaqada.",
      "Casharkan wuxuu kuu bari doonaa sida aad uga hadashid shaqada."
    ],
    chunks: [
      { id: "7-A", en: "What do you do?", so: "Maxaad qabtaa?" },
      { id: "7-B", en: "I work as ___.", so: "Waxaan u shaqeeyaa ___." },
      { id: "7-C", en: "I'm a student.", so: "Waxaan ahay arday." },
      { id: "7-D", en: "I have a business.", so: "Ganacsi baan leeyahay." },
      { id: "7-E", en: "Where do you work?", so: "Xaggee baad ka shaqeysaa?" }
    ],
    exercises: [
      { type: "choose", chunkId: "7-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "What do you do?", options: ["Maxaad qabtaa?", "Xaggee ka timid?", "Sidee tahay?"], correctIndex: 0 },
      { type: "choose", chunkId: "7-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I work as a teacher.", options: ["Waxaan u shaqeeyaa macalin.", "Waxaan ahay arday.", "Ganacsi baan leeyahay."], correctIndex: 0 },
      { type: "fillgap", chunkId: "7-C", instruction: "Buuxi meesha banaan:", sentence: ["I'm", "a", "___."], blankIndex: 2, options: ["student", "water", "thank"], correctIndex: 0 },
      { type: "order", chunkId: "7-A", instruction: "Isku habee erayada:", hint: "Maxaad qabtaa?", correctSentence: "What do you do?", words: ["do?", "you", "do", "What"] },
      { type: "listen", chunkId: "7-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "I have a business.", prompt: "I have a business.", options: ["Ganacsi baan leeyahay.", "Waxaan u shaqeeyaa macalin.", "Waxaan ahay arday."], correctIndex: 0 },
      { type: "scenario", chunkId: "7-E", instruction: "Xaalad nolosha:", scenario: "Qof cusub ayaad la kulantay. Wuxuu ku yiri wuxuu yahay dhakhtar. Waxaad rabta inaad ogaato xagguu ka shaqeeyo.", options: ["Where do you work?", "How are you?", "Goodbye."], correctIndex: 0 },
      { type: "fillgap", chunkId: "7-B", instruction: "Buuxi meesha banaan:", sentence: ["I", "___", "as a driver."], blankIndex: 1, options: ["work", "want", "need"], correctIndex: 0 },
      { type: "choose", chunkId: "7-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Waxaan ahay arday.", options: ["I'm a student.", "I work as a teacher.", "I have a business."], correctIndex: 0 },
      { type: "order", chunkId: "7-E", instruction: "Isku habee erayada:", hint: "Xaggee baad ka shaqeysaa?", correctSentence: "Where do you work?", words: ["work?", "you", "do", "Where"] },
      { type: "scenario", chunkId: "7-A,7-D", instruction: "Xaalad nolosha:", scenario: "Qof baa ku weydiiyay 'What do you do?' Waxaad leedahay dukaan yar. Maxaad tiraahdaa?", options: ["I have a business.", "Good morning.", "How much is this?"], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 8: Xaggee?
  // ============================================================
  8: {
    id: 8,
    titleSo: "Xaggee?",
    titleEn: "Where is it?",
    ability: "inaad weydiiso meel oo aad tilmaamo fudud bixiso",
    explanation: [
      "Marka aad meel cusub tagto, waa inaad ogaato sida aad tilmaamo u weydiisato.",
      "Casharkan wuxuu kuu bari doonaa ereyada tilmaamaha."
    ],
    chunks: [
      { id: "8-A", en: "Where is ___?", so: "Xaggee buu jiraa ___?" },
      { id: "8-B", en: "It's here.", so: "Waa halkan." },
      { id: "8-C", en: "It's there.", so: "Waa halkaas." },
      { id: "8-D", en: "Go straight.", so: "Si toos ah u soco." },
      { id: "8-E", en: "Turn left.", so: "Bidix u leexo." }
    ],
    exercises: [
      { type: "choose", chunkId: "8-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Where is the hospital?", options: ["Xaggee buu jiraa isbitaalka?", "Imisa yahay isbitaalka?", "Waa maxay isbitaalka?"], correctIndex: 0 },
      { type: "choose", chunkId: "8-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "It's here.", options: ["Waa halkan.", "Waa halkaas.", "Si toos ah u soco."], correctIndex: 0 },
      { type: "fillgap", chunkId: "8-C", instruction: "Buuxi meesha banaan:", sentence: ["It's", "___."], blankIndex: 1, options: ["there", "here", "where"], correctIndex: 0 },
      { type: "order", chunkId: "8-A", instruction: "Isku habee erayada:", hint: "Xaggee buu jiraa suuqa?", correctSentence: "Where is the market?", words: ["market?", "the", "is", "Where"] },
      { type: "listen", chunkId: "8-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "Go straight.", prompt: "Go straight.", options: ["Si toos ah u soco.", "Bidix u leexo.", "Waa halkan."], correctIndex: 0 },
      { type: "scenario", chunkId: "8-E", instruction: "Xaalad nolosha:", scenario: "Qof baa ku weydiiyay xaggee buu jiraa dukaanka. Wuxuu ku yaal bidix. Maxaad tiraahdaa?", options: ["Turn left.", "Go straight.", "It's here."], correctIndex: 0 },
      { type: "fillgap", chunkId: "8-B", instruction: "Buuxi meesha banaan:", sentence: ["It's", "___."], blankIndex: 1, options: ["here", "there", "where"], correctIndex: 0 },
      { type: "choose", chunkId: "8-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Waa halkaas.", options: ["It's there.", "It's here.", "Where is it?"], correctIndex: 0 },
      { type: "order", chunkId: "8-E", instruction: "Isku habee erayada:", hint: "Bidix u leexo.", correctSentence: "Turn left.", words: ["left.", "Turn"] },
      { type: "scenario", chunkId: "8-A,8-D", instruction: "Xaalad nolosha:", scenario: "Waxaad dooneysaa isbitaalka. Qof ayaad weydiisatay. Wuxuu ku yiri si toos ah u soco. Maxaad horay u weydiisatay?", options: ["Where is the hospital?", "How much is this?", "What do you do?"], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 9: Ma fahmay?
  // ============================================================
  9: {
    id: 9,
    titleSo: "Ma fahmay?",
    titleEn: "Do you understand?",
    ability: "inaad sheegto haddaad fahanaysid iyo in kale",
    explanation: [
      "Marka aad luuqad cusub baranayso, waa muhiim inaad sheegi karto haddaad fahanaysid.",
      "Ereyadan waxay kuu fududayn doonaan inaad wax weydiiso."
    ],
    chunks: [
      { id: "9-A", en: "I understand.", so: "Waan fahmay." },
      { id: "9-B", en: "I don't understand.", so: "Ma fahmin." },
      { id: "9-C", en: "Can you repeat that?", so: "Ma ku celin kartaa?" },
      { id: "9-D", en: "Slowly, please.", so: "Si tartiib ah, fadlan." },
      { id: "9-E", en: "What does ___ mean?", so: "___ macneheedu waa maxay?" }
    ],
    exercises: [
      { type: "choose", chunkId: "9-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I understand.", options: ["Waan fahmay.", "Ma fahmin.", "Ma ku celin kartaa?"], correctIndex: 0 },
      { type: "choose", chunkId: "9-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I don't understand.", options: ["Ma fahmin.", "Waan fahmay.", "Mahadsanid."], correctIndex: 0 },
      { type: "fillgap", chunkId: "9-C", instruction: "Buuxi meesha banaan:", sentence: ["Can", "you", "___", "that?"], blankIndex: 2, options: ["repeat", "want", "have"], correctIndex: 0 },
      { type: "order", chunkId: "9-A", instruction: "Isku habee erayada:", hint: "Waan fahmay.", correctSentence: "I understand.", words: ["understand.", "I"] },
      { type: "listen", chunkId: "9-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "Slowly, please.", prompt: "Slowly, please.", options: ["Si tartiib ah, fadlan.", "Ma ku celin kartaa?", "Waan fahmay."], correctIndex: 0 },
      { type: "scenario", chunkId: "9-E", instruction: "Xaalad nolosha:", scenario: "Qof baa eray cusub isticmaalay. Ma fahanaysid macnaha. Maxaad tiraahdaa?", options: ["What does that mean?", "Goodbye.", "How much?"], correctIndex: 0 },
      { type: "fillgap", chunkId: "9-B", instruction: "Buuxi meesha banaan:", sentence: ["I", "___", "understand."], blankIndex: 1, options: ["don't", "do", "can"], correctIndex: 0 },
      { type: "choose", chunkId: "9-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Ma ku celin kartaa?", options: ["Can you repeat that?", "I understand.", "Slowly, please."], correctIndex: 0 },
      { type: "order", chunkId: "9-E", instruction: "Isku habee erayada:", hint: "... macneheedu waa maxay?", correctSentence: "What does that mean?", words: ["mean?", "that", "does", "What"] },
      { type: "scenario", chunkId: "9-A,9-D", instruction: "Xaalad nolosha:", scenario: "Qof baa si dhakhso ah kuula hadlay. Ma fahanaysid. Waxaad rabta inuu si tartiib ah u hadlo.", options: ["I don't understand. Slowly, please.", "I'll take it.", "Nice to meet you."], correctIndex: 0 }
    ]
  },

  // ============================================================
  // LESSON 10: Caawimaad
  // ============================================================
  10: {
    id: 10,
    titleSo: "Caawimaad",
    titleEn: "Getting help",
    ability: "inaad caawimaad weydiisato oo aad si edeb ah ula xiriirto",
    explanation: [
      "Marka aad meel cusub joogto, waxaad u baahan doontaa inaad caawimaad weydiisato.",
      "Ereyadan waxay kaa caawin doonaan xaaladaha adag."
    ],
    chunks: [
      { id: "10-A", en: "Can you help me?", so: "Ma i caawin kartaa?" },
      { id: "10-B", en: "I need help.", so: "Caawimaad baan u baahanahay." },
      { id: "10-C", en: "Excuse me.", so: "Iga raalli noqo." },
      { id: "10-D", en: "Sorry.", so: "Waan ka xumahay." },
      { id: "10-E", en: "No worries.", so: "Waxba ha welwelin." }
    ],
    exercises: [
      { type: "choose", chunkId: "10-A", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "Can you help me?", options: ["Ma i caawin kartaa?", "Caawimaad baan u baahanahay.", "Iga raalli noqo."], correctIndex: 0 },
      { type: "choose", chunkId: "10-B", direction: "en-so", instruction: "Dooro micnaha saxda ah:", prompt: "I need help.", options: ["Caawimaad baan u baahanahay.", "Ma i caawin kartaa?", "Waan ka xumahay."], correctIndex: 0 },
      { type: "fillgap", chunkId: "10-C", instruction: "Buuxi meesha banaan:", sentence: ["___", "me."], blankIndex: 0, options: ["Excuse", "Help", "Thank"], correctIndex: 0 },
      { type: "order", chunkId: "10-A", instruction: "Isku habee erayada:", hint: "Ma i caawin kartaa?", correctSentence: "Can you help me?", words: ["me?", "help", "you", "Can"] },
      { type: "listen", chunkId: "10-D", instruction: "Dhageyso oo dooro micnaha saxda ah:", audioText: "Sorry.", prompt: "Sorry.", options: ["Waan ka xumahay.", "Mahadsanid.", "Waxba ha welwelin."], correctIndex: 0 },
      { type: "scenario", chunkId: "10-E", instruction: "Xaalad nolosha:", scenario: "Qof baa ku dhacay oo ku yiri 'Sorry!' Waxaad rabta inaad edeb ku jawaabto.", options: ["No worries.", "I don't understand.", "How much is this?"], correctIndex: 0 },
      { type: "fillgap", chunkId: "10-B", instruction: "Buuxi meesha banaan:", sentence: ["I", "___", "help."], blankIndex: 1, options: ["need", "want", "have"], correctIndex: 0 },
      { type: "choose", chunkId: "10-C", direction: "so-en", instruction: "Dooro turjumaada Ingiriisiga:", prompt: "Iga raalli noqo.", options: ["Excuse me.", "Sorry.", "No worries."], correctIndex: 0 },
      { type: "order", chunkId: "10-E", instruction: "Isku habee erayada:", hint: "Waxba ha welwelin.", correctSentence: "No worries.", words: ["worries.", "No"] },
      { type: "scenario", chunkId: "10-A,10-D", instruction: "Xaalad nolosha:", scenario: "Waxaad lumisay oo waxaad u baahan tahay caawimaad. Qof ayaad aragtay. Sidee ayaad ula hadli lahayd?", options: ["Excuse me. Can you help me?", "Goodbye. See you later.", "I'll take it."], correctIndex: 0 }
    ]
  }
};

export default lessonData;

export const allChunks = Object.values(lessonData).flatMap(lesson =>
  lesson.chunks.map(chunk => ({
    ...chunk,
    lessonId: lesson.id,
    lessonTitleSo: lesson.titleSo,
    lessonTitleEn: lesson.titleEn
  }))
);

export const audioManifest = allChunks.map(chunk => ({
  id: chunk.id,
  text: chunk.en,
  path: `/audio/lesson-${chunk.lessonId}/${chunk.en.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')}.mp3`
}));
