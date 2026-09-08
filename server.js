const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Serwer KS Lechia Grodzisk działa!');
});

app.post('/api/kontakt', (req, res) => {
    const { imie, email, temat, wiadomosc } = req.body;

    const nowaWiadomosc = {
        imie,
        email,
        temat,
        wiadomosc,
        data: new Date().toISOString()
    };

    let wiadomosci = [];

    if (fs.existsSync('wiadomosci.json')) {
        const zawartosc = fs.readFileSync('wiadomosci.json', 'utf-8');
        wiadomosci = JSON.parse(zawartosc);
    }

    wiadomosci.push(nowaWiadomosc);

    fs.writeFileSync('wiadomosci.json', JSON.stringify(wiadomosci, null, 2));

    console.log('Zapisano nową wiadomość od:', imie);

    res.json({ sukces: true, komunikat: 'Wiadomość zapisana!' });
});

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});