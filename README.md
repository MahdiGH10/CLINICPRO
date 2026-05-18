# ClinicPRO

ClinicPRO est une application web de gestion médicale pour une clinique. Le projet sépare clairement le back-end REST Spring Boot et le front-end Angular. Il couvre la prise de rendez-vous en ligne, la gestion du dossier médical électronique, la génération de factures après consultation et un système de notifications simulées pour les rappels de rendez-vous.

## Déploiement en ligne

Application Cloud Run :

- Front-end : https://clinicpro-etfppa7d2q-ew.a.run.app
- Back-end Swagger : https://clinicpro-backend-etfppa7d2q-ew.a.run.app/swagger-ui/index.html
- Projet GCP : `clinicpro-496701`
- Région : `europe-west1`

Compte administrateur par défaut :

```text
Email        : admin@clinicpro.local
Mot de passe : Admin123!
```

## Fonctionnalités

- Authentification JWT avec séparation des espaces par rôle.
- Espace patient : inscription, prise de rendez-vous, consultation des rendez-vous et factures.
- Espace médecin : agenda, saisie de consultation et gestion du dossier médical électronique.
- Espace administrateur : gestion des patients, médecins, rendez-vous et factures.
- Vérification des disponibilités lors de la prise de rendez-vous.
- Génération automatique de factures après consultation.
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
├── clinicpro-frontend/nginx.conf     # Nginx pour Angular routing
└── README.md
```

## Technologies

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
- Google Cloud Run
- Cloud SQL MySQL
- Swagger / Springdoc OpenAPI

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

Variables Docker principales :

```env
MYSQL_DATABASE=clinicpro
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=clinicpro
MYSQL_PASSWORD=clinicpro
```

## Lancement local

Créer une base MySQL :

```sql
CREATE DATABASE ClinicPRO;
```

Vérifier la configuration dans :

```text
src/main/resources/application.properties
```

Démarrer le back-end :

```bash
mvn spring-boot:run
```

Démarrer le front-end :

```bash
cd clinicpro-frontend
npm install
ng serve
```

URLs locales :

```text
Frontend : http://localhost:4200
Backend  : http://localhost:8081
Swagger  : http://localhost:8081/swagger-ui/index.html
```

## Déploiement Cloud Run

Configurer GCP :

```bash
gcloud auth login
gcloud config set project clinicpro-496701
gcloud config set run/region europe-west1
```

Activer les APIs :

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

Créer Cloud SQL MySQL :

```bash
gcloud sql instances create clinicpro-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=europe-west1

gcloud sql databases create clinicpro \
  --instance=clinicpro-mysql
```

Créer Artifact Registry :

```bash
gcloud artifacts repositories create clinicpro-repo \
  --repository-format=docker \
  --location=europe-west1

gcloud auth configure-docker europe-west1-docker.pkg.dev
```

Donner à Cloud Run l'accès Cloud SQL :

```bash
gcloud projects add-iam-policy-binding clinicpro-496701 \
  --member="serviceAccount:874947548345-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

Build et push du back-end :

```bash
docker build -t europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-backend:latest .
docker push europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-backend:latest
```

Déployer le back-end :

```bash
gcloud run deploy clinicpro-backend \
  --image=europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-backend:latest \
  --platform=managed \
  --region=europe-west1 \
  --allow-unauthenticated \
  --add-cloudsql-instances=clinicpro-496701:europe-west1:clinicpro-mysql \
  --set-env-vars="SPRING_PROFILES_ACTIVE=cloud,SPRING_DATASOURCE_URL=jdbc:mysql:///clinicpro?cloudSqlInstance=clinicpro-496701:europe-west1:clinicpro-mysql&socketFactory=com.google.cloud.sql.mysql.SocketFactory&useSSL=false,SPRING_DATASOURCE_USERNAME=root,SPRING_DATASOURCE_PASSWORD=<MOT_DE_PASSE_MYSQL>,SPRING_JPA_HIBERNATE_DDL_AUTO=update"
```

Build et push du front-end avec l'URL du back-end :

```bash
cd clinicpro-frontend
docker build \
  --build-arg API_BASE_URL=https://clinicpro-backend-etfppa7d2q-ew.a.run.app \
  -t europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-frontend:latest .
docker push europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-frontend:latest
```

Déployer le front-end :

```bash
gcloud run deploy clinicpro \
  --image=europe-west1-docker.pkg.dev/clinicpro-496701/clinicpro-repo/clinicpro-frontend:latest \
  --platform=managed \
  --region=europe-west1 \
  --allow-unauthenticated \
  --port=80
```

## Sécurité

ClinicPRO utilise JWT et trois rôles :

- `PATIENT` : rendez-vous, factures et informations personnelles.
- `MEDECIN` : agenda, consultations et dossier médical.
- `ADMIN` : supervision et gestion des utilisateurs métier.

Le dossier médical électronique contient des données sensibles. Sa modification est réservée aux rôles `MEDECIN` et `ADMIN`.

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

Arrêt Docker :

```bash
docker-compose down
```

Suppression des volumes Docker :

```bash
docker-compose down -v
```
