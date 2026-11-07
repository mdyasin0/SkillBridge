# SkillBridge

### Where Skills Are Proven — Not Claimed.

**SkillBridge** is a full-stack skill verification and developer discovery platform designed to connect developers with recruiters through demonstrated technical performance rather than self-reported skills.

Developers complete coding and project-based challenges, submit their work for review, and build a professional profile based on their performance, scores, rankings, badges, and reviewer feedback.

Recruiters can discover developers, evaluate their verified performance, explore professional profiles, and communicate directly with potential candidates.

---

## The Problem

Traditional recruitment often relies heavily on resumes and self-reported technical skills.

However, listing a technology on a resume does not necessarily demonstrate practical proficiency.

This creates several challenges:

- Difficulty evaluating actual technical skills.
- Time-consuming candidate screening.
- Limited evidence of practical experience.
- Potential mismatch between claimed and demonstrated abilities.

## The Solution

SkillBridge provides a platform where developers can demonstrate their abilities through practical challenges and build performance-based professional profiles.

The platform brings together:

- Coding Challenges
- Project-Based Challenges
- Submission and Review Workflows
- Performance Scoring
- Developer Ranking
- Achievement Badges
- Reviewer Feedback
- Developer Discovery
- Recruiter–Developer Messaging

The goal is to make technical performance more visible and help recruiters make more informed hiring decisions.

---

## How SkillBridge Works

```text
Developer
    |
    v
Select a Challenge
    |
    v
Solve Coding / Project Challenge
    |
    v
Submit Solution
    |
    v
Admin Review
    |
    v
Score + Feedback
    |
    v
Performance Tracking
    |
    v
Ranking + Badges
    |
    v
Developer Profile
    |
    v
Recruiter Discovery
    |
    v
Direct Communication
```

---

## User Roles

SkillBridge supports three distinct user roles with separate dashboards and permissions.

### 1. Developer

Developers can:

- Create and manage their professional profiles.
- Complete coding challenges.
- Complete project-based and UI challenges.
- Track available, running, and completed challenges.
- Submit and resubmit work within the allowed attempt limits.
- View challenge timers and submission history.
- Track scores and performance statistics.
- View rankings and earned badges.
- Receive reviewer feedback.
- Discover their recent activities and feedback.
- View recruiter profiles.
- Communicate with recruiters through the messaging system.

### 2. Recruiter

Recruiters can:

- Create and manage professional recruiter profiles.
- Add company information and company logos.
- Browse available developers.
- Search developers by relevant information.
- Filter developers by technology, country, experience, badges, rank, and availability.
- Sort developers by skill score, rank, experience, and completed challenges.
- View detailed developer profiles.
- Evaluate developer performance and achievements.
- Contact developers directly.
- Manage conversations through the inbox.

### 3. Admin

Administrators can:

- Manage registered users.
- Search and filter users by name, email, role, and registration date.
- Ban, suspend, restore, and delete user accounts.
- Create and manage coding challenges.
- Create and manage project-based challenges.
- Review submitted coding solutions.
- Review submitted project work.
- Assign scores and provide feedback.
- Manage challenge approval status.
- Monitor submissions and platform activity.

---

## Core Features

### Authentication & Authorization

- User registration and login.
- Password hashing using bcryptjs.
- NextAuth.js-based authentication integration.
- Role-based access control.
- Three separate dashboards for Developer, Recruiter, and Admin.
- Protected dashboard routes.
- Authentication checks for unauthorized access.
- Role verification before granting dashboard access.
- Account status handling for active, banned, and suspended users.
- Conditional navigation based on authentication state.
- Profile completion checks for Developers and Recruiters.

### Challenge Management

SkillBridge provides two major challenge categories.

**Coding Challenges**

- Create and manage coding challenges.
- Define challenge title, description, difficulty, category, technology, and time limit.
- Dedicated challenge details pages.
- Integrated Monaco code editor.
- Challenge-specific coding environment.
- Babel Standalone integration.
- Submission tracking.
- Countdown timer.
- Persistent challenge start time across page refreshes.
- Automatic submission when the time limit expires.
- Completed challenge resubmission.
- Attempt-based action controls.

**Project-Based & UI Challenges**

- Create and manage project and UI challenges.
- Configure difficulty, technology, category, time limit, and maximum attempts.
- Dedicated challenge details pages.
- Challenge-specific submission workflows.
- Available, Running, Completed, and Resubmission Pending states.
- Confirmation before starting a challenge.
- Countdown timer with persistent start time.
- Automatic submission when the time limit expires.
- Submission history and attempt tracking.
- Resubmission within the configured attempt limit.
- Separate tracking of initial submissions and resubmissions.

### Submission & Review System

- Dedicated submission management for coding and project challenges.
- Submission status tracking.
- Admin review dashboard.
- Pending and approved submission views.
- Developer name and email-based submission search.
- Related user, challenge, and submission data retrieved through SQL JOIN operations.
- Submission detail views.
- Reviewer score assignment.
- Written feedback.
- Review status and timestamp updates.
- Resubmission attempt validation.
- Protection against exceeding maximum attempts.
- Separate tracking of initial and resubmission timestamps.

### Developer Ranking & Performance Analytics

Developer profiles are supported by a centralized API that combines information from multiple database tables.

The performance system includes:

- Overall Skill Score.
- Developer ranking.
- Total developer count.
- Approved challenge count.
- Average review score.
- Coding and project challenge statistics.
- Easy, Medium, and Hard challenge completion statistics.
- Total completed challenges.
- Running challenge count.
- Recent activity.
- Recent reviewer feedback.

Ranking considers multiple performance criteria, including:

- Approved challenges.
- Average score.
- Hard challenge completions.
- Medium challenge completions.
- Easy challenge completions.

### Achievement & Badge System

- Database-driven badge information.
- Separate project and problem-solving badge categories.
- Earned badge display on developer profiles.
- Total badge count.
- Verified developer status based on earned badges.

### Developer Profile

A dynamic professional profile that presents a developer's technical background and platform performance.

Profile information includes:

- Profile photo.
- Name and professional title.
- Professional bio.
- Country.
- Experience.
- Education.
- Technical skills.
- Technology stack.
- Languages.
- GitHub profile.
- Portfolio website.
- LinkedIn profile.
- Availability status.
- Overall skill score.
- Developer rank.
- Verified status.
- Challenge statistics.
- Achievements and badges.
- Recent activity.
- Recent reviewer feedback.

### Developer Discovery

Recruiters can explore developers through a dedicated discovery page.

Features include:

- API-driven developer listings.
- Search functionality.
- Technology-based filtering.
- Country filtering.
- Experience filtering.
- Badge filtering.
- Ranking filtering.
- Availability filtering.
- Sorting by highest score.
- Sorting by highest rank.
- Sorting by experience.
- Sorting by completed challenges.
- Expandable developer listings.
- Dynamic developer details pages.

### Recruiter Profile

A structured recruiter profile containing professional and company information.

Includes:

- Personal information.
- Professional information.
- Contact information.
- Recruitment specialization.
- Recruitment experience.
- Company name and logo.
- Company description.
- Company website.
- Industry and company size.
- Company location.
- Company social links.
- Professional social links.
- Verification status.

The recruiter profile setup includes a multi-step form with field validation, image preview, and image upload integration.

### Recruiter–Developer Messaging

A database-backed messaging system that connects recruiters and developers.

Features include:

- Start conversations from developer profiles.
- Dynamic conversation pages.
- Separate inboxes for recruiters and developers.
- Conversation history loaded from the database.
- Message sending and editing.
- Edited message indicators.
- Emoji picker integration.
- Read and unread message tracking.
- Unread message counts.
- Automatic read-status updates when conversations are opened.
- Latest message previews in inbox listings.
- Relative message timestamps.
- Automatic scrolling to the latest message.
- Manual conversation refresh.

### Admin User Management

- View registered users.
- Search by name and email.
- Filter by user role.
- Filter by registration date and time.
- Developer, Recruiter, and Admin statistics.
- Ban accounts.
- Suspend accounts.
- Restore accounts.
- Permanently delete accounts.
- Account status checks during protected access.

### User Experience & Interface

- Responsive layouts.
- Role-specific dashboard navigation.
- Consistent global design system.
- Loading states for data-driven pages.
- React Toastify notifications.
- SweetAlert2 confirmation dialogs.
- Conditional buttons and actions.
- Empty-state handling.
- Form validation and error handling.
- Consistent component alignment and visual styling.

---

## Engineering Highlights

Beyond implementing application features, SkillBridge involved solving several practical software engineering challenges.

**1. Authentication & Role-Based Security**

Implemented separate authentication and authorization checks to protect role-specific dashboard routes and prevent users from accessing unauthorized sections.

**2. Relational Database Design**

Used MySQL relational tables to organize users, developer profiles, recruiter profiles, challenges, submissions, reviews, badges, conversations, and messages.

Related information is retrieved through SQL JOIN operations while maintaining a single source of truth for shared user information.

**3. Complex Challenge Lifecycle Management**

Implemented challenge states, submission tracking, countdown timers, automatic submission, attempt limits, and resubmission workflows.

**4. Submission State & Conflict Handling**

Added validation for pending submissions, resubmission limits, and conflicting challenge operations to maintain consistent submission states.

**5. Persistent Timer Management**

Challenge start timestamps are stored in the database and used to calculate remaining time, allowing the timer to remain consistent after page refreshes.

**6. Centralized Developer Profile API**

Combined data from users, developer profiles, submissions, and coding solution submissions into a structured API response containing profile information, ranking, and badge data.

**7. Data-Driven Developer Discovery**

Implemented dynamic search, filtering, sorting, and developer detail pages using API-provided information instead of relying on static demonstration data.

**8. Database-Backed Messaging**

Developed conversation management, message editing, read/unread tracking, unread counts, and separate recruiter and developer inbox workflows.

**9. API Validation & Error Handling**

Implemented request validation, meaningful HTTP response codes, duplicate record checks, and user-facing error notifications.

**10. Database Consistency & Data Organization**

Removed duplicated user information from profile tables and retrieved shared user data through database relationships and JOIN operations.

---

## Technology Stack

### Frontend

- **Next.js** – React framework and application development.
- **React** – Component-based user interface development.
- **TypeScript** – Type-safe development.
- **Tailwind CSS** – Utility-first styling.
- **DaisyUI** – UI components.
- **Framer Motion** – Animations and transitions.
- **Lucide React** – Icons.

### Backend

- **Next.js Server Features** – Server-side application logic and API development.
- **NextAuth.js** – Authentication integration.
- **bcryptjs** – Password hashing.

### Database

- **MySQL** – Relational database management.
- **mysql2** – MySQL database connectivity.

### Additional Libraries

- **Monaco Editor** – Code editor integration.
- **Babel Standalone** – JavaScript transpilation integration.
- **React Icons** – Icon library.
- **React Toastify** – Toast notifications.
- **SweetAlert2** – Alerts and confirmation dialogs.



## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm, yarn, pnpm, or bun
- MySQL Server

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd SkillBridge
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables for your database connection, authentication, and other integrations.

NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_IMGBB_KEY=

database cloude aiven.io
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
### 5. Configure MySQL

Make sure your MySQL server is running and the database is configured according to the application's database setup.

### 6. Start the Development Server

```bash
npm run dev
```

### 7. Open the Application

Visit: 

```text
http://localhost:3000
```

---

## What This Project Demonstrates

SkillBridge represents hands-on experience with:

- Full-stack application development.
- Next.js application architecture.
- Authentication and authorization.
- Role-based access control.
- Relational database design.
- SQL queries and JOIN operations.
- REST-style API development.
- Complex business logic.
- State and workflow management.
- Timer-based operations.
- Submission and review systems.
- Data aggregation and ranking.
- Database-backed messaging.
- Dynamic search and filtering.
- Form validation and error handling.
- Responsive user interface development.

---

## Project Philosophy

A developer's technical ability should be demonstrated through practical work, not just described in a resume.

SkillBridge was built around that idea: creating a platform where developers can demonstrate their skills, recruiters can evaluate actual performance, and technical opportunities can be based on more meaningful evidence.

**SkillBridge — Where Skills Are Proven, Not Claimed.**
