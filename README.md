# SuperPizza

SuperPizza est une web app Javascript de pizzaria fictive. Elle permet de commander des pizzas à emporter pour de potentiels clients. Elle comporte également une interface d'administration, permettant aux pizzaïolos de visualiser l'ensemble des commandes à réaliser, en temps réel, et d'en modifier l'état.

## Table des matières
1. [Informations générales](#informations-générales)
2. [Technologies](#technologies)
3. [Installation](#installation)
  3.1. [Pré-requis](#pré-requis)
  3.2. [Base de données](#base-de-données)
  3.3. [Application](#application)
  3.4. [Lancement](#lancement)
4. [Utilisation](#utilisation)
  4.1. [App cliente](#app-cliente)
  4.2. [App pizzaïlo](#app-pizzaïolo)


## Informations générales

SuperPizza a été temporairement déployée sur Azure. Elle est donc disponible à l'adresse suivante, pour une durée limitée : [http://superpizza.azurewebsites.net/](http://superpizza.azurewebsites.net/). 
*Attention*: le plan choisi sur Azure n'autorise que 5 connexions simultanées par WebSocket.


## Technologies

- [VueJS - v2.6.12](https://vuejs.org/)
- [NodeJS - v14.15.4](https://nodejs.org/en/)
- [MariaDB - v2.5.2](https://mariadb.org/)
- [Parcel - v1.12.4](https://parceljs.org/)


## Installation

### Pré-requis 
- Node v14
- MariaDb server

### Base de données
La base de données contient un évènement programmé, il est donc nécessaire d'activer l'event_scheduler.
De plus, le script d'initialisation de la base se trouve dans le répertoire git du projet. Il est donc nécessaire de **cloner le repos** avant d'effectuer la suite.
Démarrer au préalable mariaDB

    sudo /etc/init.d/mysql start

Se connecter à mariaDB avec : 

    sudo mysql

Puis activer l'event_scheduler : 

    SET GLOBAL event_scheduler = ON;

Pour modifier durablement ce paramètre, il est nécessaire de modifier le fichier mysqld.cnf : 

    vi /etc/mysql/mysql.conf.d/mysqld.cnf

Ajouter la ligne suivante après la balise "[mysql]":

    [mysql]
    event_scheduler = on

Enregistrer et quitter. Se placer à la racine du projet et lancer la commande suivante pour initialiser la base de données : 

    sudo mysql < database/init.sql

Enfin, saisir les commandes suivantes, pour créer l'utilisateur : 

    CREATE USER IF NOT EXISTS admin@localhost IDENTIFIED BY 'admin';
    GRANT ALL ON superpizza.* TO admin@localhost;
    FLUSH privileges;

### Application
Lancer : 

    npm install

Modifier le fichier server/assets/config.json selon votre configuration

```json
{
  "database": {
    "host": <Hostname de la base de données>,
    "user": <Utilisateur de la base de données>,
    "password": <Mot de passe de l'utilisateur>,
    "database": <Nom de la base de données>
  },
  "server": {
    "port": <Port d'écoute du serveur>,
    "distPath": <Chemin d'accès au répertoire du code buildé>
  }
}
```

Enfin lancer la commande :

    npm run build

### Lancement
Saisir la commande suivante : 

    npm run start

Accéder à l'url http://<ip du serveur>:<port de la configuration>

## Utilisation

### App cliente

### App pizzaïlo
