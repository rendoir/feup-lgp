#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
pg_password="$2"
shift
shift
cmd="$@"

until PGPASSWORD=$pg_password psql -h "$host" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
