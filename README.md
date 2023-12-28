It is a TODO app. It uses flask as backend and react as frontend

Features Implemented:
It allows to set and delete todos
It has keycloak authentication and it is used to secure every api endpoints
It has stripe payment Integrated
On successfull payment one can view uploaded images
Uses sqllite database

Working:
grapql
photo upload


##Setup

Flask
1) Install requirements
   pip install -r reqirements.txt

2) Start server
   python app.py

React
1) Install dependencies
   npm install

2) start react
   npm start

Keycloak
1) Fetch image vishnu7796/nkeycloak in docker
2) build a container with port mapping `-p 8080:8080`

Once this all is done, hit below url in browser
`http://localhost:3000/`

Note:
If at all getting error `keycloak can have only one instance` check url or refresh the page
