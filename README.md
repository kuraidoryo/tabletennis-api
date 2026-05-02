# Table Tennis Players API

REST API do zarzadzania zawodnikami tenisa stolowego (Node.js, Express, MongoDB).

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
- `GET /api/players` - lista zawodnikow (opcjonalne filtry: `gender`, `handedness`, `playingStyle`)
- `GET /api/players/:id` - pojedynczy zawodnik
- `POST /api/players` - dodanie zawodnika (**wymaga** naglowka `x-api-key`)
- `PUT /api/players/:id` - aktualizacja zawodnika (**wymaga** naglowka `x-api-key`)
- `DELETE /api/players/:id` - usuniecie zawodnika (**wymaga** naglowka `x-api-key`)

## Przykladowy payload zawodnika

```json
{
  "firstName": "Timo",
  "lastName": "Boll",
  "gender": "Male",
  "age": 43,
  "handedness": "Left-handed",
  "playingStyle": "Offensive - Close to Table",
  "blade": "Butterfly Timo Boll ALC",
  "forehands": "Dignics 09C",
  "backhand": "Dignics 05"
}
```
