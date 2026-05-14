# ClinicPRO Frontend

Minimal Angular 16 frontend scaffold for ClinicPRO clinic management system.

## Quick Start

Install dependencies:
```bash
npm install
```

Start the dev server:
```bash
npm start
```

Build for production:
```bash
npm run build
```

## Project Structure

- `src/app/core/models/` — TypeScript interfaces for backend DTOs
- `src/app/core/services/` — HTTP services for backend integration
- `src/app/pages/` — Application pages (Patients, Medecins, RendezVous, etc.)

## Features

- Angular 16 with TypeScript
- Tailwind CSS for styling
- Minimal scaffold — ready for expansion
- Local HTTP services wired to backend endpoints

## Backend API

The frontend communicates with the Spring Boot backend running on `http://localhost:8081`.
API endpoints documented in `../BACKEND_DOCUMENTATION.md`.
