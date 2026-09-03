const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Serwer KS Lechia Grodzisk działa!');
});

app.post('/api/kontakt', (req, res) => {
    const { imie, email, temat, wiadomosc } = req.body;

    console.log('Nowa wiadomość z formularza:');
    console.log({ imie, email, temat, wiadomosc });

    res.json({ sukces: true, komunikat: 'Wiadomość odebrana przez serwer!' });
});

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});