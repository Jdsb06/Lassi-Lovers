# FactChecker Deployment Guide

This document outlines how to deploy the FactChecker application to various hosting platforms.

## Project Structure

The FactChecker application consists of two main components:

1. **Frontend**: React application in the `frontend` directory
2. **Backend**: FastAPI application in the `backend` directory

## Deployment Options

### Option 1: Separate Deployment (Recommended)

#### Frontend Deployment

The React frontend can be deployed to static hosting services like:

- **Netlify**: [https://www.netlify.com/](https://www.netlify.com/)
- **Vercel**: [https://vercel.com/](https://vercel.com/)
- **GitHub Pages**: [https://pages.github.com/](https://pages.github.com/)

Steps for Netlify deployment:

1. Build the frontend:
   ```
   cd frontend
   npm install
   npm run build
   ```

2. Deploy the `build` folder to Netlify:
   - Sign up/login to Netlify
   - Drag and drop the `frontend/build` folder to Netlify's deploy area, or
   - Connect your GitHub repository and configure Netlify to build and deploy the frontend

3. Set up environment variables in Netlify's dashboard:
   - `REACT_APP_API_URL`: Your deployed backend URL (e.g., https://factchecker-backend.herokuapp.com)

#### Backend Deployment

The FastAPI backend can be deployed to services like:

- **Heroku**: [https://www.heroku.com/](https://www.heroku.com/)
- **Render**: [https://render.com/](https://render.com/)
- **Railway**: [https://railway.app/](https://railway.app/)

Steps for Heroku deployment:

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:
   ```
   heroku login
   heroku create factchecker-backend
   ```

3. Deploy the backend:
   ```
   cd backend
   git init
   git add .
   git commit -m "Initial backend deployment"
   heroku git:remote -a factchecker-backend
   git push heroku main
   ```

4. Set up environment variables in Heroku's dashboard or CLI:
   ```
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set JWT_SECRET_KEY=your_secret_key
   # Add any other required environment variables
   ```

### Option 2: One-Click Deployment

#### Deploy to Railway

Railway provides an easy way to deploy both frontend and backend:

1. Create a Railway account: [https://railway.app/](https://railway.app/)
2. Connect your GitHub repository
3. Configure two services:
   - Frontend service: Use the `frontend` directory and set the build command to `npm install && npm run build`
   - Backend service: Use the `backend` directory and set the build command to `pip install -r requirements.txt`
4. Configure environment variables for both services
5. Set up domain and deploy

## After Deployment

1. Update CORS settings in the backend to allow your frontend domain
2. Test the connection between frontend and backend
3. Monitor application logs for any issues

## Troubleshooting

- If you encounter CORS issues, check that your frontend's domain is included in the `allow_origins` list in `app.py`
- If the backend fails to start, check the logs for missing dependencies or environment variables
- For database connection issues, ensure your database URL is correctly configured

## Further Resources

- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
