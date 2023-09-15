# 2023-workshop-1

Projet BeGood, ce projet est un projet nodeJS tourne sous docker et consiste à importer un CSV afin de récupérer les informations qu'il contient afin de créer une réunion Teams. 
Toutes les infos sont stockées dans une base MongoDB qui tourne dans un autre conteneur docker.
L'utilisateur peut ensuite exporter le CSV avec les liens des réuinions


## Pour lancer le projet, il suffit de faire :

docker-compose up --build

Pour stocker la clé API Microsoft Graph par contre nous n'avons pas faire de quoi la récupérer, il faut donc aller la chercher ici : https://developer.microsoft.com/en-us/graph/graph-explorer
Connectez-vous, faites la première requête pui allez dans "Access token" puis faites ces commandes :

docker exect -ti node_container sh

touch .env & echo GRAPH_API_TOKEN = [votre access token]
