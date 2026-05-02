# AI Interview Preparation Platform

## Overview

This is a modern web application that uses AI to help users prepare for job interviews. Key features include:

- AI-powered question generation for any topic
- Answer evaluation with detailed feedback
- Learning path creation for structured preparation
- Analytics to track performance and progress
- User authentication with social login (GitHub, Google, Discord)
- Two-factor authentication and passkey support
- Profile management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: Better Auth
- **API**: tRPC
- **Background Jobs**: Inngest
- **UI**: shadcn/ui, Tailwind CSS
- **AI**: Google AI SDK (@ai-sdk/google)
- **File Upload**: UploadThing
- **Caching/Rate Limiting**: Upstash Redis
- **Analytics**: Sentry
- **Form Validation**: Zod + React Hook Form
- **State Management**: TanStack React Query
- **Testing**: Jest, RTL, Playwright

## Features

### Topics

- Create and manage interview topics
- Organize questions by topic

### Questions

- Manual question creation
- AI-powered question generation
- Filter by difficulty (Easy/Medium/Hard)

### Answers

- Write answers to questions
- AI evaluation with scoring and feedback
- Track answer history

### Analytics

- Performance tracking
- Weak topic identification
- Attempt trends
- Recent answers overview

### Learning Paths

- AI-generated learning paths
- Structured phases and tasks
- Duration estimation

### Authentication

- Email/password login
- Social login (GitHub, Google, Discord)
- Two-factor authentication (2FA)
- Passkey support
- Email verification
- Password reset
- Account deletion
