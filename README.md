# Blueprint Diagnostic Screener

https://github.com/user-attachments/assets/1902b38e-b710-4c51-9464-87e91e422d38
[Link to Demo Video](https://vimeo.com/1067832756?share=copy)

## Problem Description

This application is a mental health diagnostic screening tool that allows patients to complete a cross-functional symptom questionaire which allows clinicians to recommend specific mental health assessments based the patients answers.

The application consists of two main components:

1. A backend API that scores user answers and recommends follow-up assessments
2. A user-facing user interface for completing the diagnostic screener

## Technical Overview

- **Backend**: Next.js API Routes
- **Frontend**: Next.js with React, Tailwind, and Shadcn components
- **Database**: PostgreSQL with Prisma ORM

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

## Production Deployment Considerations

### Reliability, Availability + Performance

The type of application, expected users/workloads, types of workloads, etc all play into how I would go about deploying an application. For this example, the simplicity of the scoring logic and user interaction lend itself to being deployed in multiple ways: serverless, via VPS, or containerized services.

To have the most control, I would opt for VPS or containerized deployments which would allow:

- Horizontal scaling
- Use container orchestration (Kubernetes)
- Database replication, indexing, sharding, etc (Separate from application deployment)
- Circuit breakers and retry mechanisms

This way, if our application scales to millions of users a day, we would be able to scale up and down according to traffic.

### Security

In this example, I did not implement any security mechanisms. In a production application we would want to implement the following to make sure our API and applications are secured from those without authorization and bad actors.

- Use HTTPS with strong TLS configuration
- Implement rate limiting
- Add user authentication and authorization via OAuth or similar
- Use environment-specific configuration management
- Implement comprehensive logging and monitoring
- Secure API endpoints via user auth (tokens or cookies)

### Observability

Observability is a major necessity as it is our insight into how the system is working and performing. I would look to implement logging, metrics, and tracing tools:

- Logging: Effective logging helps you track errors, warnings, and application flow
- Metrics: Metrics provide insights into app performance such as response time and throughput
- Tracing: Tracing helps identify performance bottlenecks by tracking requests across services

OpenTelemetry and Datadog would be a comprehensive start.

## Future Improvements

Some other (required) improvements could be:

- Tests
- Add CICD for automatic testing, deployments, database migrations, and environment promotion
- Implement more robust caching with invalidation for domain mappings (Redis)
- Implement more comprehensive logging (OpenTelemetry Standard + Datadog)
- Create admin dashboard for clinicians
- Expand assessment types
- Persist user responses / recommended assessments

## More About Me

Some code I'm particularly proud of:

- [NomosLearning](https://www.nomoslearning.com/) - An AI powered learning platform for law students
  - Currently at ~50 MAU
  - NextJS, Typescript, tRPC, Prisma, TailwindCSS, Postgres
  - Fullstack typesafety
- [My Github](https://github.com/hgrias)
