# Sezzle Calculator

Full-stack calculator application built with React, TypeScript, and Go. The frontend provides an intuitive interface for mathematical operations, while the backend exposes a REST API for calculation and input validation.

## Features

- Basic operations: addition, subtraction, multiplication, and division.
- Advanced operations: exponentiation, square root, and percentage.
- Input validation and error handling.
- REST API that exchanges data in JSON format.
- Responsive interface for desktop and mobile screens.
- Unit tests for the frontend and backend, with coverage reports.

## Tech Stack

### Frontend
- React 19.3.1
- TypeScript
- Vite
- Vitest
- React Testing Library
- jsdom

### Backend
- Go 1.27.3
- Standard Go HTTP library

## Project Structure

```text
sezzle-calculator/
├── frontend/
│   ├── src/
│   │   └── test/
│   ├── App.tsx
│   ├── App.css
│   ├── App.test.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── calculator.go
│   ├── calculator_test.go
│   ├── main.go
│   ├── main_test.go
│   └── go.mod
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 24.18.0 (or a compatible version).
- npm (included with Node.js).
- [Go](https://go.dev/dl/) 1.27.3 (or a compatible version).

## Getting Started

Run the backend and frontend in separate terminal windows.

### 1. Start the Backend

```powershell
cd backend
go test
go run .
```

The API will be available at `http://localhost:8080`.

### 2. Start the Frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Docker

You can run the entire stack with Docker. No `docker-compose` file is required — build and run each service separately.

### Backend

```bash
cd backend
docker build -t sezzle-calculator-backend .
docker run --rm -p 8080:8080 sezzle-calculator-backend
```

The API will be available at `http://localhost:8080`.

### Frontend

```bash
cd frontend
docker build -t sezzle-calculator-frontend .
docker run --rm -p 5173:80 sezzle-calculator-frontend
```

Open `http://localhost:5173` in your browser. The frontend is served by Nginx on port 80 inside the container, mapped to 5173 on the host.

## API Usage

### Endpoint

`POST http://localhost:8080/api/calculate`

### Request format

Send a JSON object containing the operation and its operands:

```json
{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

### Supported operations

| Operation | Description | Example operands |
|---|---|---|
| `add` | Adds two numbers | `a: 10`, `b: 5` |
| `subtract` | Subtracts `b` from `a` | `a: 10`, `b: 5` |
| `multiply` | Multiplies two numbers | `a: 10`, `b: 5` |
| `divide` | Divides `a` by `b` | `a: 10`, `b: 5` |
| `power` | Raises `a` to the power of `b` | `a: 2`, `b: 3` |
| `sqrt` | Calculates the square root of `a` | `a: 25` |
| `percentage` | Calculates `(a / b) * 100` | `a: 25`, `b: 100` |

### Successful response

The API returns a JSON response containing the calculation result. For example:

```json
{
  "result": 15
}
```

### Error handling

Invalid input, unsupported operations, division by zero, or invalid mathematical arguments return an HTTP error response with a JSON message. For example:

```json
{
  "error": "division by zero"
}
```

## Tests and Coverage

### Backend

Run these commands from the `backend` directory:

```powershell
go test -v
go test -cover
go test -coverprofile=coverage.out .
go tool cover -func=coverage.out
```

To generate an HTML coverage report:

```powershell
go tool cover -html=coverage.out
```

### Frontend

Run these commands from the `frontend` directory:

```powershell
npm install
npx vitest run
npx vitest run --coverage
npm run build
npm run lint
```

The coverage command prints a summary and creates a coverage report in the `coverage/` directory.

## Design Decisions

- **Separation of concerns:** the React frontend handles the user interface, while the Go backend performs calculations and validates requests.
- **REST and JSON:** a simple HTTP API keeps the frontend and backend independent.
- **Validation and error handling:** invalid inputs and mathematical edge cases are handled explicitly.
- **Testability:** unit tests cover the main calculation behavior and API/frontend interactions.
- **Minimal dependencies:** the backend uses Go's standard library for its HTTP server and API.

## Future Improvements

- Expand automated tests for additional edge cases.
- Improve accessibility and keyboard navigation as needed.
