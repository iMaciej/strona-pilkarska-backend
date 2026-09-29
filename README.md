# ⚽ KS Lechia Grodzisk — backend / API

Backend REST API dla [strony klubu piłkarskiego KS Lechia Grodzisk](https://github.com/iMaciej/strona-pilkarska) — obsługuje formularz kontaktowy, terminarz meczów i chroniony logowaniem panel administracyjny.

**🔗 API live:** [strona-pilkarska-backend.onrender.com](https://strona-pilkarska-backend.onrender.com)
**🔗 Frontend:** [imaciej.github.io/strona-pilkarska](https://imaciej.github.io/strona-pilkarska/)

> Hostowane na darmowym planie Render — serwer usypia po 15 minutach bezczynności, pierwsze żądanie po przerwie może potrwać do minuty.

---

## Stack technologiczny

| Element | Technologia |
|---|---|
| Środowisko | Node.js |
| Framework | Express |
| Baza danych | MongoDB Atlas |
| Uwierzytelnianie | JWT (`jsonwebtoken`) |
| Inne biblioteki | `cors`, `dotenv` |
| Hosting | Render |

## Endpointy API

| Metoda | Ścieżka | Opis | Wymaga tokenu |
|---|---|---|---|
| `GET` | `/` | Health check — potwierdza, że serwer działa | Nie |
| `GET` | `/api/mecze` | Zwraca terminarz meczów | Nie |
| `POST` | `/api/kontakt` | Zapisuje wiadomość z formularza kontaktowego | Nie |
| `POST` | `/api/login` | Loguje admina, zwraca token JWT | Nie |
| `GET` | `/api/wiadomosci` | Zwraca wszystkie wiadomości z formularza | **Tak** (JWT) |

Chronione endpointy wymagają nagłówka:
```
Authorization: Bearer <token>
```

## Struktura projektu

```
├── server.js            serwer Express, endpointy API, middleware JWT
├── wgraj-mecze.js      jednorazowy skrypt do (re)zasilenia bazy danymi meczów
├── .env.example         wzór zmiennych środowiskowych (bez prawdziwych sekretów)
└── .gitignore            node_modules, .env, wiadomosci.json
```

## Uruchomienie lokalnie

```bash
git clone https://github.com/iMaciej/strona-pilkarska-backend.git
cd strona-pilkarska-backend
npm install
cp .env.example .env
```

Uzupełnij plik `.env` własnymi danymi:

```
MONGODB_URI=mongodb+srv://uzytkownik:haslo@klaster.mongodb.net/?appName=Cluster0
ADMIN_PASSWORD=twoje-haslo-do-panelu-admina
JWT_SECRET=dlugi-losowy-ciag-znakow
```

Uruchom serwer:

```bash
node server.js
```

Serwer wystartuje na `http://localhost:3000` (lub porcie z `process.env.PORT`, jeśli ustawiony).

## Wdrożenie

Aplikacja wdrażana jest automatycznie na [Render](https://render.com) przy każdym `git push` do gałęzi `main` (Auto-Deploy). Zmienne środowiskowe (`MONGODB_URI`, `ADMIN_PASSWORD`, `JWT_SECRET`) ustawione są ręcznie w panelu Render → Environment — plik `.env` nigdy nie trafia do repozytorium.

## Bezpieczeństwo

- Hasła i klucze przechowywane wyłącznie w zmiennych środowiskowych, nigdy w kodzie
- Endpoint `/api/wiadomosci` chroniony middleware'em weryfikującym token JWT
- Token wygasa po 2 godzinach (`expiresIn: '2h'`)
- CORS skonfigurowany, żeby zezwolić na żądania z frontendu

## Czego się nauczyłem

- Budowy REST API w Express — routing, middleware, kody statusu HTTP
- Połączenia z bazą danych MongoDB i operacji asynchronicznych (`async`/`await`)
- Implementacji uwierzytelniania opartego o JWT
- Bezpiecznego zarządzania sekretami przez zmienne środowiskowe
- Wdrażania i debugowania aplikacji Node.js w środowisku produkcyjnym (Render)

## Autor

Maciej — [GitHub: @iMaciej](https://github.com/iMaciej)

*Projekt edukacyjny — dane klubu i zawodników są fikcyjne.*
