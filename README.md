# ClinicPRO

ClinicPRO est une application web de gestion médicale pour une clinique. Le projet sépare clairement un back-end REST en Spring Boot et un front-end Angular. Il couvre la prise de rendez-vous en ligne, la gestion du dossier médical électronique, la génération de factures après consultation et un système de notifications simulées pour les rappels de rendez-vous.

## Fonctionnalités principales

- Authentification avec JWT et séparation des espaces par rôle.
- Espace patient : inscription, prise de rendez-vous, consultation des rendez-vous et factures.
- Espace médecin : agenda, saisie de consultation, gestion du dossier médical électronique.
- Espace administrateur : gestion des patients, médecins, rendez-vous et factures.
- Vérification des disponibilités lors de la prise de rendez-vous.
- Génération de factures après consultation.
- Notifications simulées pour les rappels et annulations de rendez-vous.
- Documentation API avec Swagger UI.

## Architecture

Le projet respecte une séparation stricte entre l'API REST et l'interface utilisateur.

```text
ClinicPRO/
├── src/main/java/com/ClinicPRO/      # Back-end Spring Boot
├── src/main/resources/               # Configuration back-end
├── clinicpro-frontend/               # Front-end Angular
├── Dockerfile                        # Image Docker back-end
├── docker-compose.yml                # MySQL + back-end + front-end
├── clinicpro-frontend/Dockerfile     # Image Docker front-end
├── clinicpro-frontend/nginx.conf     # Serveur Nginx Angular
└── README.md
```

## Technologies utilisées

- Java 17
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- MySQL 8
- Angular 19
- Angular Material
- Docker
- Nginx
- Swagger / Springdoc OpenAPI

## Prérequis

Pour un lancement local :

- Java 17
- Maven
- Node.js / npm
- MySQL
- Angular CLI

Pour un lancement Docker :

- Docker
- Docker Compose

## Lancement avec Docker

Depuis la racine du projet :

```bash
docker-compose up --build
```

Services exposés :

```text
Frontend : http://localhost:4200
Backend  : http://localhost:8081
MySQL    : localhost:3306
Swagger  : http://localhost:8081/swagger-ui/index.html
```

Variables d'environnement Docker disponibles :

```env
MYSQL_DATABASE=clinicpro
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=clinicpro
MYSQL_PASSWORD=clinicpro
```

Le fichier `docker-compose.yml` lance trois services :

- `mysql` : base de données MySQL 8.
- `backend` : API Spring Boot exposée sur le port `8081`.
- `frontend` : application Angular servie par Nginx sur le port `4200`.

## Lancement en local

### 1. Base de données

Créer une base MySQL, par exemple :

```sql
CREATE DATABASE ClinicPRO;
```

Vérifier ensuite la configuration dans :

```text
src/main/resources/application.properties
```

### 2. Back-end Spring Boot

Depuis la racine du projet :

```bash
mvn spring-boot:run
```

Le back-end démarre sur :

```text
http://localhost:8081
```

### 3. Front-end Angular

Depuis la racine du projet :

```bash
cd clinicpro-frontend
npm install
ng serve
```

Le front-end démarre sur :

```text
http://localhost:4200
```

## Compte administrateur par défaut

```text
Email        : admin@clinicpro.local
Mot de passe : Admin123!
```

## Documentation API

Swagger UI :

```text
http://localhost:8081/swagger-ui/index.html
```

OpenAPI JSON :

```text
http://localhost:8081/v3/api-docs
```

## Sécurité et rôles

ClinicPRO utilise une authentification JWT. Les accès sont séparés selon trois rôles :

- `PATIENT` : prise de rendez-vous, consultation de ses factures et de ses rendez-vous.
- `MEDECIN` : agenda, consultations et modification du dossier médical.
- `ADMIN` : supervision globale et gestion des utilisateurs métier.

Le dossier médical électronique est une donnée sensible. Sa modification est réservée aux rôles `MEDECIN` et `ADMIN`.

## Déploiement Cloud

Le projet est prêt pour une stratégie de déploiement Docker. Pour Google Cloud Platform, une approche possible est :

- Build des images Docker et publication dans Artifact Registry.
- Déploiement du back-end et du front-end sur Cloud Run.
- Utilisation de Cloud SQL MySQL pour la base de données.
- Configuration des variables d'environnement Spring Boot pour pointer vers Cloud SQL.

## Versioning

Le repository contient des commits organisés par fonctionnalité :

- correctifs back-end et sécurité ;
- intégration front-end Angular ;
- amélioration des interfaces par rôle ;
- dossier médical structuré ;
- fichiers Docker et déploiement.

## Commandes utiles

Build front-end :

```bash
cd clinicpro-frontend
npm run build
```

Tests back-end :

```bash
mvn test
```

Arrêt des services Docker :

```bash
docker-compose down
```

Suppression des volumes Docker :

```bash
docker-compose down -v
```
