# Banking UI

React frontend for the banking transaction system.

## Backend Integration Flow

`React`

`->`

`Axios`

`->`

`Spring Boot REST API`

`->`

`Spring Security`

`->`

`Service`

`->`

`Repository`

`->`

`MySQL`

## Frontend API Layer

The shared client lives in [`src/services/api.js`](./src/services/api.js) and uses Axios for:

- `POST /auth/login`
- `POST /auth/register`
- `POST /deposit`
- `POST /withdraw`
- `POST /transfer`
- `POST /profile`

## Environment

Set `VITE_API_URL` to your Spring Boot backend base URL.

Example:

```bash
VITE_API_URL=http://localhost:8000/api
```

If `VITE_API_URL` is not set, the UI stays in demo mode so the screens remain usable without a running backend.
