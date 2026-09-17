require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let kolekcjaWiadomosci;

async function polaczZBazaDanych() {
    await client.connect();
    const baza = client.db('lechia-grodzisk');
    kolekcjaWiadomosci = baza.collection('wiadomosci');
    console.log('Połączono z MongoDB Atlas');
}

app.get('/', (req, res) => {
    res.send('Serwer KS Lechia Grodzisk działa!');
});

app.post('/api/kontakt', async (req, res) => {
    const { imie, email, temat, wiadomosc } = req.body;

    const nowaWiadomosc = {
        imie,
        email,
        temat,
        wiadomosc,
        data: new Date().toISOString()
    };

    try {
        await kolekcjaWiadomosci.insertOne(nowaWiadomosc);
        console.log('Zapisano nową wiadomość od:', imie);
        res.json({ sukces: true, komunikat: 'Wiadomość zapisana w bazie danych!' });
    } catch (blad) {
        console.error('Błąd zapisu do bazy:', blad);
        res.status(500).json({ sukces: false, komunikat: 'Błąd serwera' });
    }
});
function sprawdzToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ sukces: false, komunikat: 'Brak tokenu' });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (blad) {
        res.status(401).json({ sukces: false, komunikat: 'Nieprawidłowy token' });
    }
}

app.get('/api/wiadomosci', sprawdzToken, async (req, res) => {
    try {
        const wiadomosci = await kolekcjaWiadomosci.find().sort({ data: -1 }).toArray();
        res.json(wiadomosci);
    } catch (blad) {
        console.error('Błąd pobierania wiadomości:', blad);
        res.status(500).json({ sukces: false, komunikat: 'Błąd serwera' });
    }
});

polaczZBazaDanych().then(() => {
    app.listen(PORT, () => {
        console.log(`Serwer nasłuchuje na porcie ${PORT}`);
    });
});

app.post('/api/login', (req, res) => {
    const { haslo } = req.body;

    if (haslo !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ sukces: false, komunikat: 'Nieprawidłowe hasło' });
    }

    const token = jwt.sign({ rola: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ sukces: true, token: token });
});