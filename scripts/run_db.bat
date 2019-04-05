cd db
docker image build -t db .
docker container rm --force db_container
docker container run -p 5433:5432 --name db_container --env-file ../secrets/secrets.env db
