# Blueprint Diagnostic Screener

## Problem Description

This application is a mental health diagnostic screening tool that allows patients to complete a cross-functional symptom questionaire which allows clinicians to recommend specific mental health assessments based the patients answers.

The application consists of two main components:

1. A backend API that scores user answers and recommends follow-up assessments
2. A user-facing user interface for completing the diagnostic screener

## Technical Overview

- **Backend**: Next.js API Routes
- **Frontend**: Next.js with React, Tailwind, and Shadcn components
- **Database**: PostgreSQL with Prisma ORM

## Technical Choices + Considerations

### Framework - NextJS

I used NextJS as I was most comfortable with it and it allows me to build full stack applications all with 1 framework. It works well with a variety of deployment options, however I would say it is definitely built for serverless environments first. The developer community surrounding NextJS and Vercel is very robust which helps for maintainability purposes.

### Database - Postgres + Prisma ORM

Postgres is simple and an industry standard. I like how it supports jsonb attributes which allows me flexibility in prototyping models as well as parsing objects using typescript and zod.

Prisma is simple to use and allows me to build and iterate quickly, however, some voice [concerns about its performance at scale](https://www.reddit.com/r/nextjs/comments/1i9zvyy/warning_think_twice_before_using_prisma_in_large/) although I have not personally experienced it.



## Prerequisites

- Docker Desktop
- Docker Compose
- Git

## Running the Application

### Running Locally

Clone the repository

```bash
git clone https://github.com/yourusername/blueprint-diagnostic-screener.git
cd blueprint-diagnostic-screener
```

### Production Server

If you wish to run a "productionized" NextJS server locally using docker:

1. Start the application and database using Docker Compose
   ```bash
   docker compose up --build
   ```

2. Access the application
   - Web Interface: http://localhost:3000
   - Assess Screener Endpoint: POST http://localhost:3000/api/screener/assess
   - Get Screener Endpoint: GET http://localhost:3000/api/screener/[id]

3. When done, stop the services
   ```
   docker compose down
   ```

### Development Server

If you wish to run a dev server locally, use the following:

1. Start just the database service
   ```bash
   docker compose up db -d
   ```

2. If you have not already created a `.env` file, do so in the project root and copy over values from [`.env.example`](.env.example)

2. Reset the database, apply migrations, then seed it
   ```bash
   npm run db:reset && npm run db:generate && npm run db:seed
   ```

3. Start the local dev server
   ```bash
   npm run dev
   ```

4. Access the application
   - Web Interface: http://localhost:3000
   - Assess Screener Endpoint: POST http://localhost:3000/api/screener/assess
   - Get Screener Endpoint: GET http://localhost:3000/api/screener/[id]

## Production Deployment Considerations

### Reliability
- Implement horizontal scaling
- Use container orchestration (Kubernetes)
- Set up database replication
- Implement circuit breakers and retry mechanisms

### Security
- Use HTTPS with strong TLS configuration
- Implement rate limiting
- Add authentication and authorization
- Use environment-specific configuration management
- Implement comprehensive logging and monitoring
- Secure API endpoints via user auth

## Future Improvements

- Tests
- Add user authentication
- Implement more robust caching with invalidation for domain mappings (Redis)
- Implement more comprehensive logging (OpenTelemetry Standard + Datadog)
- Create admin dashboard for clinicians
- Expand assessment types
- Persist user responses / recommended assessments

## Troubleshooting

If you encounter issues:
- Ensure Docker is running
- Check container logs with `docker compose logs`
- Verify network ports are not in use
- Restart containers with `docker compose down && docker compose up --build`
