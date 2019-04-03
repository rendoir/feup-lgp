cd db
sudo docker image build -t db .
sudo docker container rm --force db_container
sudo docker container run -p 5433:5432 --name db_container --env-file ../secrets/secrets.env db
