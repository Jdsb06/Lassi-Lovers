#!/bin/bash

# Build script for FactChecker application

echo "Building FactChecker for production deployment..."

# Build frontend
echo "Building React frontend..."
cd frontend
npm install
npm run build

# The build folder will contain the static files to be deployed
echo "Frontend build complete."

# Prepare backend
echo "Preparing backend..."
cd ../backend
# Ensure all Python dependencies are installed
pip install -r requirements.txt

echo "Build process completed successfully!"
echo "Deploy the frontend/build folder to a static hosting service like Netlify, Vercel, or GitHub Pages"
echo "Deploy the backend folder to a service that supports Python like Heroku, Railway, or Render"
