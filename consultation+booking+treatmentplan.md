Act as a Senior Full-Stack Software Architect and Backend Expert.

I am building a Dental Clinic Platform. I have already designed the frontend for the "Compare + Consultation Booking" flow. Now, I need to design a robust, industry-standard backend architecture, database schema, and API flow to make the "Single Dentist Consultation & Treatment Booking" fully functional.

### 🔄 Core Business Flow (State Machine):

1. Consultation Booking (Patient selects dentist and book consultation).
2. Schedule Consultation (after booking consultation then create schedule for consultation with video call link, but there is in build video calling system like zoom, so I want to use zego cloud or easy option. you suggest me what is the best because their is when schedule book meeting link add there, and when the meeting time come then the patient and dentist can join the meeting from their dashboard from that link. or in the video call there is not option to share anything or chat or someting just there is show camera on/off, audio on/off and call end button. so suggest me best option for this, and video call screen show dentist and patient video screen).
3. Treatment Plan Proposal (Dentist create treatment plan after consultation done).
4. Patient Decision (Patient accepts or rejects the plan).
5. Treatment Booking (If accepted, then create dentist booking schedule i have already design it so analzye my front end code and design a best backend architecture, database schema, and API flow for this).

### 🚀 Future-Proofing Constraints (Crucial):

- The architecture MUST be ready for **Socket.io** integration for real-time video meetings and chat in the next phase.
- The architecture MUST support **PostHog** for event tracking and analytics (e.g., tracking drop-offs in the booking flow, plan acceptance rates). not now but in future this feature will be added. and i want to use posthog for analytics.
- Strict **RBAC (Role-Based Access Control)** for Patients, Dentists, and Admins.

### 🛠️ Tech Stack:

- Frontend: [
  {
  "name": "rateddoc-doctor-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
  },
  "dependencies": {
  "@hookform/resolvers": "^5.2.2",
  "@tanstack/react-query": "^5.101.0",
  "axios": "^1.17.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "js-cookie": "^3.0.8",
  "leaflet": "^1.9.4",
  "lucide-react": "^1.14.0",
  "motion": "^12.38.0",
  "next": "16.2.4",
  "radix-ui": "^1.4.3",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "react-hook-form": "^7.75.0",
  "react-hot-toast": "^2.6.0",
  "react-icons": "^5.6.0",
  "react-leaflet": "^5.0.0",
  "shadcn": "^4.7.0",
  "tailwind-merge": "^3.5.0",
  "tw-animate-css": "^1.4.0",
  "zod": "^4.4.3",
  "zustand": "^5.0.14"
  },
  "devDependencies": {
  "@tailwindcss/postcss": "^4",
  "@tanstack/eslint-plugin-query": "^5.101.0",
  "@types/js-cookie": "^3.0.6",
  "@types/leaflet": "^1.9.21",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.2.4",
  "tailwindcss": "^4",
  "typescript": "^5"
  }
  }

]

- Backend: [
  {
  "name": "rateddocs-backend-system",
  "version": "1.0.0",
  "description": "Express + TypeScript + Prisma + PostgreSQL + better-auth + Redis + Cloudinary backend modular system",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "lint": "eslint 'src/**/\*.ts'",
  "format": "prettier --write 'src/**/\*.ts'",
  "generate": "prisma generate",
  "migrate": "prisma migrate dev",
  "push": "prisma db push",
  "studio": "prisma studio",
  "reset": "prisma migrate reset"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
  "@better-auth/prisma-adapter": "^1.6.20",
  "@prisma/adapter-pg": "^7.8.0",
  "@prisma/client": "^7.8.0",
  "bcryptjs": "^3.0.3",
  "better-auth": "^1.6.20",
  "cloudinary": "^2.10.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "ejs": "^6.0.1",
  "express": "^5.2.1",
  "helmet": "^8.2.0",
  "http-status": "^2.1.0",
  "jsonwebtoken": "^9.0.3",
  "morgan": "^1.11.0",
  "multer": "^2.2.0",
  "nodemailer": "^9.0.1",
  "pg": "^8.22.0",
  "redis": "^6.0.0",
  "winston": "^3.19.0",
  "zod": "^4.4.3"
  },
  "devDependencies": {
  "@eslint/js": "^10.0.1",
  "@types/bcryptjs": "^3.0.0",
  "@types/cookie-parser": "^1.4.10",
  "@types/cors": "^2.8.19",
  "@types/ejs": "^3.1.5",
  "@types/express": "^5.0.6",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/morgan": "^1.9.10",
  "@types/multer": "^2.1.0",
  "@types/node": "^26.0.0",
  "@types/nodemailer": "^8.0.1",
  "@types/pg": "^8.20.0",
  "eslint": "^10.5.0",
  "eslint-config-prettier": "^10.1.8",
  "prettier": "^3.8.4",
  "prisma": "^7.8.0",
  "tsx": "^4.22.4",
  "typescript": "^6.0.3",
  "typescript-eslint": "^8.62.0"
  }
  }

]

### 📂 Context:

Read my both side front end and backend and plan according to them. I want to use best practices and industry standards. and most importantly i want to use a socket.io or something for video call and chat. or maybe there is a build in video call system in zego cloud. so suggest me what is the best for this.

### 🎯 Your Task (Execute Step-by-Step):

First of all create work plan and then we will go step by step. Don't create all the code at once

**Phase 1 (Architecture & Schema - Do this NOW):**

1. Analyze my frontend flow and suggest any missing edge cases.
2. Design the **Database Schema** (Prisma) focusing on the State Machine for the booking lifecycle. Ensure tables are normalized and have extra field for future Socket session.
3. Define the **REST API Endpoints** required for this flow, including required RBAC middleware for each.
4. Define the **State Transitions** (e.g., PENDING -> SCHEDULED -> COMPLETED -> PLAN_PROPOSED -> PLAN_ACCEPTED -> TREATMENT_BOOKED).

Wait for my review and approval on Phase 1 before we move to Phase 2 (Writing the actual backend controllers and services). Acknowledge if you understand and provide Phase 1.
