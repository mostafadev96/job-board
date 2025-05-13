#!/bin/bash

echo "Running Prisma Generate..."
npx prisma generate

echo "Running Prisma migration deploy..."
npx prisma migrate deploy

echo "Running Seed Command..."
npx nx run api:seed

echo "Starting Application..."
npm run api:start
