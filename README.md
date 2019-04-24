gNet
====

Description
-----------
gNet is a social network where enthusiasts of the medical area can share and acquire knowledge by participating in discussions and conferences in the platform.

Development Instructions
------------

### Requirements
- Docker
- Node/npm

### Overview

Clone the repository. Then, run the following section's commands in 3 separate terminals for the PostgreSQL database, Node+Express backend and React frontend.
This will run the database inside a Docker container, continuously outputting useful logs, and startup the backend and frontend on their own.

### Commands
DB:
- at project root, run 'scripts/run_db.bat'

Backend:
- cd api
- npm install
- npm start

Frontend:
- cd web
- npm install
- npm start

Contribution Guidelines
------------

### Merge Requests
Each merge request must be approved by at least 2 members before merge. As our Gitlab edition does not have the 'Approve' functionality enabled, one must instead use the 'thumbs up' emoji.

Useful links
------------
[React-Bootstrap](https://react-bootstrap.github.io/components/alerts) \
Bootstrap as React components 

[Create-React-App](https://github.com/wmonk/create-react-app-typescript/blob/master/template/README.md#folder-structure) \
Github repository with a guide used to implement this app 

[React-Router-Dom](https://reacttraining.com/react-router/) \
Routing solution

Authors
-------
Arthur Johas Matta - [up201609953@fe.up.pt]  
João Francisco Veríssimo Dias Esteves - [up201505145@fe.up.pt]  