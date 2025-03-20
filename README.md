# Blueprint Diagnostic Screener

## Problem Description

This application is a mental health diagnostic screening tool that allows patients to complete a cross-cutting symptom assessment. The application consists of two main components:

1. A backend API that scores user answers and recommends follow-up assessments
2. A user-facing user interface for completing the diagnostic screener

## Technical Overview

- **Backend**: Next.js API Routes
- **Frontend**: Next.js with React, Tailwind, and Shadcn components
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker

## Prerequisites

- Docker Desktop
- Docker Compose
- Git

## Running the Application

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/blueprint-diagnostic-screener.git
   cd blueprint-diagnostic-screener
   ```

2. Start the application using Docker Compose
   ```bash
   docker compose up --build
   ```

3. Access the application
   - Web Interface: http://localhost:3000
   - Assess Screener Endpoint: POST http://localhost:3000/api/screener/assess
   - Get Screener Endpoint: GET http://localhost:3000/api/screener/[id]

### Development Features

- Hot reloading for frontend and backend
- Prisma database migrations
- Comprehensive error handling

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

## Future Improvements

- Add user authentication
- Implement more comprehensive error tracking
- Create admin dashboard for clinicians
- Expand assessment types
- Save user responses / recommended assessments

## Troubleshooting

If you encounter issues:
- Ensure Docker is running
- Check container logs with `docker compose logs`
- Verify network ports are not in use
- Restart containers with `docker compose down && docker compose up --build`
