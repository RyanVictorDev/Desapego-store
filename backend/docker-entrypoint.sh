#!/bin/bash
set -e

echo "Waiting for database..."
sleep 5

echo "Preparing database..."
bundle exec rails db:prepare

if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  bundle exec rails db:seed
fi

exec "$@"
