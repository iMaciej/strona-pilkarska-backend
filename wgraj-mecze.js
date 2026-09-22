require('dotenv').config();
const { MongoClient } = require('mongodb');

const mecze = [
    { data: "2026-09-15", przeciwnik: "Sokół Podlesie", miejsce: "Dom", wynik: "-" },
    { data: "2026-09-22", przeciwnik: "Victoria Rzeczków", miejsce: "Wyjazd", wynik: "-" },
    { data: "2026-09-29", przeciwnik: "Orzeł Miasteczko", miejsce: "Dom", wynik: "2:1" }
];

async function wgraj() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const baza = client.db('lechia-grodzisk');
    const kolekcja = baza.collection('mecze');

    await kolekcja.deleteMany({});
    await kolekcja.insertMany(mecze);

    console.log(`Wgrano ${mecze.length} meczów do bazy.`);
    await client.close();
}

wgraj();