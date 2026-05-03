# Table Tennis Players API

REST API do zarzadzania zawodnikami tenisa stolowego (Node.js, Express, MongoDB).

API online: https://tabletennis-api.onrender.com

## Wymagania

- Node.js 18+
- MongoDB Atlas (lub inny MongoDB URI)

## Instalacja

```bash
npm install
```

## Konfiguracja `.env`

Utworz plik `.env` w katalogu projektu:

```env
MONGODB_URI=twoj_connection_string_do_mongodb
API_SECRET_KEY=twoj_tajny_klucz_api
PORT=2137
```

## Uruchomienie

```bash
node src/app.js
```

## Endpointy

- `GET /` - informacje o API
- `GET /api/players` - lista zawodnikow (opcjonalne filtry: `gender`, `handedness`, `firstName`, `lastName`, `country`, `playingStyle`, `grip`)
- `GET /api/players/:id` - pojedynczy zawodnik
- `POST /api/players` - dodanie zawodnika (**wymaga** naglowka `x-api-key`)
- `PUT /api/players/:id` - aktualizacja zawodnika (**wymaga** naglowka `x-api-key`)
- `DELETE /api/players/:id` - usuniecie zawodnika (**wymaga** naglowka `x-api-key`)

### Filtrowanie (GET /api/players)

- Imie i nazwisko sa wyszukiwane **bez wrazliwosci na wielkosc liter**
- Kraj (`country`) jest wyszukiwany **bez wrazliwosci na wielkosc liter**
- Mozesz filtrowac po samym imieniu, samym nazwisku albo po obu naraz
- `playingStyle` obsluguje 3 poziomy szczegolowosci:
  - ogolnie: `Offensive`, `Defensive`
  - bardziej szczegolowo: `Modern Defender`, `Classical Defender`
  - najbardziej szczegolowo: np. `Offensive - Inverted`

Przyklady:

- `GET /api/players?firstName=timo`
- `GET /api/players?lastName=BOLL`
- `GET /api/players?firstName=timo&lastName=boll`
- `GET /api/players?country=poland`
- `GET /api/players?playingStyle=Offensive`
- `GET /api/players?playingStyle=Defensive`
- `GET /api/players?playingStyle=Modern Defender`
- `GET /api/players?playingStyle=Offensive - Inverted`

## Przykladowy payload zawodnika

```json
{
  "firstName": "Timo",
  "lastName": "Boll",
  "gender": "Male",
  "birthDate": "1981/03/08",
  "handedness": "Left-handed",
  "grip": "Shakehand",
  "playingStyle": "Offensive - Inverted",
  "country": "Germany",
  "blade": "Butterfly Timo Boll ALC",
  "forehand": "Dignics 09C",
  "backhand": "Dignics 05"
}
```

`age` jest wyliczane automatycznie na podstawie `birthDate` i zwracane w odpowiedzi API.

Dozwolone wartosci `playingStyle`:

- `Offensive - Inverted`
- `Offensive - Long Pimples`
- `Offensive - Anti`
- `Modern Defender - Inverted`
- `Modern Defender - Long Pimples`
- `Modern Defender - Anti`
- `Classical Defender - Inverted`
- `Classical Defender - Long Pimples`
- `Classical Defender - Anti`

Dozwolone wartosci `grip`:

- `Shakehand`
- `Chinese Penhold`
- `Japanese Penhold`
- `Tigerwing`
