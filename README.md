# VoyageFinder: Réservation de Vols en Ligne ✈️

## Introduction

**VoyageFinder** vous invite à explorer le monde en toute simplicité, votre allié idéal pour dénicher les meilleures offres de vols en un clin d'œil ! Grâce à notre plateforme intuitive, réservez facilement votre prochain vol tout en profitant de recommandations personnalisées et d'une interface épurée. Notre mission est de simplifier le processus de réservation de billets d'avion, rendant chaque étape accessible et agréable pour tous, que vous soyez un globe-trotteur expérimenté ou un voyageur occasionnel. Découvrez dès maintenant **VoyageFinder** et laissez-nous vous aider à réaliser vos rêves de voyage !

## Fonctionnalités du site

- **Réservation de billets d'avion** : Recherchez des vols selon votre destination, les dates, et différents critères comme le prix ou les préférences de classe.
- **Offres spéciales et promotions** : Profitez des meilleures offres du moment, incluant des réductions spéciales, des vols en promotion et des deals de dernière minute.
- **Gestion de profil utilisateur** : Créez un profil pour sauvegarder vos préférences de voyage, gérer vos réservations et consulter l'historique de vos voyages.

### Fonctionnalités facultatives

- **Recommandations personnalisées** : Recevez des suggestions de destinations et d'offres basées sur vos recherches et réservations précédentes.
- **Comparaison de prix en temps réel** : Comparez facilement les prix de différentes compagnies aériennes, en prenant en compte les taxes, les options de bagages et autres frais supplémentaires.

## Technologies Utilisées

- **Frontend** : HTML, CSS, JavaScript
- **Backend** : Node.js (Express.js)
- **Base de Données** : PostgreSQL
- **API** : Amadeus

## Installation

1. **Prérequis** :
    - Installer [Node.js](https://nodejs.org/) (version 14 ou supérieure)
    - Installer [PostgreSQL](https://www.postgresql.org/) et configurer une base de données
    
2. **Cloner le dépôt** :
    ```sh
    git clone https://github.com/momed-ali01/GestionDeVol_test.git
    ```
3. **Installer les dépendances** :
    ```sh
    cd GestionDeVol_test
    npm install
    ```
4. **Configurer les variables d'environnement** :
    - Renommez le fichier `.env.example` en `.env`.
    - Ouvrez le fichier `.env` et remplissez les valeurs nécessaires pour `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, etc.
    ```sh
    mv .env.example .env
    ```
5. **Lancer l'application** :
    ```sh
    npm start
    ```
    - Accédez à l'application via votre navigateur à l'adresse `http://localhost:3000`.

## Règles d'équipe pour le projet *VoyageFinder*

1. **Réunions deux fois par semaine** :  
   - **Jeudi après-midi** : On se répartit les tâches pour avancer sur le projet.  
   - **Lundi après-midi** : On fait le point sur ce que chacun a fait pendant la semaine.

2. Soyez **attentifs** et **concentrés**. On est là pour **avancer**, donc restons **focus** !

### Membres de l'Équipe

- Mahdi Yacoub Ali
- Manar Adnan Mahamoud
- Mane Salah Moussa
- Marwan Abdi Hassan
- Mohamed Ali Youssouf
- Mohamed Moumin Ali

### Encadré par

Mr. Yahya Galib

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.