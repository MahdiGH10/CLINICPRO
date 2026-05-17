# ClinicPRO

ClinicPRO est une application de gestion médicale pour une clinique. Elle permet la prise de rendez-vous en ligne, la gestion des dossiers médicaux électroniques par les médecins, la génération de factures après consultation et la simulation de rappels de rendez-vous.

## Technologies

- Spring Boot 3
- Angular 19
- MySQL 8
- Docker

## Lancer avec Docker

Depuis la racine du projet :

```bash
docker-compose up --build
```

Services exposés :

- Frontend : http://localhost:4200
- Backend API : http://localhost:8081
- MySQL : localhost:3306

Variables d'environnement disponibles :

```env
MYSQL_DATABASE=clinicpro
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=clinicpro
MYSQL_PASSWORD=clinicpro
```

## Lancer en local

### Backend

```bash
mvn spring-boot:run
```

Le backend démarre sur :

```text
http://localhost:8081
```

### Frontend

```bash
cd clinicpro-frontend
npm install
ng serve
```

Le frontend démarre sur :

```text
http://localhost:4200
```

## Compte administrateur par défaut

```text
Email : admin@clinicpro.local
Mot de passe : Admin123!
```

## Documentation API

La documentation Swagger est disponible ici :

```text
http://localhost:8081/swagger-ui/index.html
```
