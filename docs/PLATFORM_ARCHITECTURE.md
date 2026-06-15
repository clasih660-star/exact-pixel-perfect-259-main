# Klassruum Platform Architecture

This document defines how Klassruum should run across public pages, authenticated dashboards, user roles, routing, and the Supabase data model. It is intended to keep future UI, SEO, route, and database work aligned.

## Product model

Klassruum is an AI-powered virtual classroom platform for institutions. It is not a generic chatbot or a passive content library. The platform turns institution-approved course materials into structured, accessible, teacher-led classroom experiences.

The core flow is:

1. A platform admin manages the global Klassruum ecosystem.
2. An institution admin creates programmes, courses, teachers, learners, resources, and enrollments.
3. Teachers review materials, refine/generated lessons, start or supervise sessions, and support learners.
4. Learners attend AI teacher-led or hybrid classrooms, ask questions, save notes, complete practice, and track progress.
5. Parents or guardians monitor linked learners through reports, sessions, progress, and messages.

## Actor responsibilities

### Platform admin

Purpose: operate the entire Klassruum platform.

Primary responsibilities:

- manage institutions and institution users
- monitor usage, plans, billing tiers, and limits
- manage KingPin/shared platform course content
- configure AI settings, lesson generation settings, and system defaults
- monitor support, audit logs, realtime activity, and system health

Primary routes:

- `/admin/dashboard`
- `/admin/users`
- `/admin/institutions`
- `/admin/kingpin-courses`
- `/admin/programmes`
- `/admin/courses`
- `/admin/lessons`
- `/admin/materials`
- `/admin/lesson-generation`
- `/admin/ai-settings`
- `/admin/plans`
- `/admin/usage`
- `/admin/support`
- `/admin/audit-logs`
- `/admin/health`
- `/admin/settings`

### Institution admin

Purpose: run one institution’s academic and operational setup.

Primary responsibilities:

- create programmes and courses
- invite teachers and students
- manage enrollments
- upload resources and course materials
- trigger and monitor lesson generation
- schedule classrooms/sessions
- review institution analytics, activity, and billing

Primary routes:

- `/institution/dashboard`
- `/institution/programmes`
- `/institution/courses`
- `/institution/resources`
- `/institution/teachers`
- `/institution/students`
- `/institution/enrollments`
- `/institution/sessions`
- `/institution/lesson-generation`
- `/institution/analytics`
- `/institution/activity`
- `/institution/billing`
- `/institution/settings`

### Teacher

Purpose: prepare, supervise, and improve learning delivery.

Primary responsibilities:

- review assigned courses
- create or refine lessons
- upload resources
- preview lessons before publishing
- start and supervise live, AI, or hybrid sessions
- monitor learner activity and analytics
- message or support learners who need help

Primary routes:

- `/teacher/dashboard`
- `/teacher/courses`
- `/teacher/lessons`
- `/teacher/sessions`
- `/teacher/resources`
- `/teacher/students`
- `/teacher/supervision`
- `/teacher/analytics`
- `/teacher/messages`
- `/teacher/settings`

### Learner / student

Purpose: learn through structured classroom experiences.

Primary responsibilities:

- continue current courses and lessons
- enter classrooms
- ask questions by voice or text
- use captions, transcripts, notes, and accessibility tools
- complete quizzes/practice
- review progress and recommendations

Primary routes:

- `/student/dashboard`
- `/student/classrooms`
- `/student/courses`
- `/student/lessons`
- `/student/calendar`
- `/student/resources`
- `/student/notes`
- `/student/transcripts`
- `/student/progress`
- `/student/assignments`
- `/student/quizzes`
- `/student/messages`
- `/student/access`
- `/student/search`
- `/student/notifications`
- `/student/settings`

### Parent / guardian

Purpose: observe and support linked learners without managing academic delivery.

Primary responsibilities:

- view linked learner profiles
- track progress and reports
- review session summaries
- communicate with teachers or institution staff

Primary routes:

- `/parent/dashboard`
- `/parent/learners`
- `/parent/progress`
- `/parent/sessions`
- `/parent/reports`
- `/parent/messages`
- `/parent/settings`

## Database relationship model

The current Supabase migrations already support the core product architecture.

Primary hierarchy:

```text
Platform
└── Institution
    ├── Institution members / roles
    ├── Programmes
    │   └── Courses
    │       ├── Course materials
    │       │   └── Material images / extracted context
    │       ├── Lessons
    │       │   ├── Lesson sections
    │       │   └── Teaching items
    │       ├── Enrollments
    │       └── Classroom sessions
    │           ├── Session participants
    │           ├── Session events
    │           ├── Board snapshots
    │           ├── Chat messages / learner questions
    │           ├── Session notes
    │           ├── Transcripts / summaries
    │           └── Learning results
    ├── Notifications
    ├── Recommendations
    ├── Study goals
    └── Achievements
```

Important migrations:

- `supabase/migrations/20260609120000_phase1_classroom_foundation.sql`
  - session events
  - board snapshots
  - session notes
  - notifications
  - recommendations
- `supabase/migrations/20260609130000_phase8_notifications_analytics.sql`
  - notifications
  - recommendations
  - study goals
  - achievements
- `supabase/migrations/20260609140000_phase9_programmes_materials_lessons.sql`
  - programmes
  - course materials
  - material images
  - lesson sections
  - teaching items
  - learner questions
  - learning results

## Role and permission model

Application-level roles currently include:

```ts
type UserRole =
  | "platform_admin"
  | "institution_admin"
  | "owner"
  | "teacher"
  | "student"
  | "parent";
```

Institution membership roles in Supabase include:

```text
owner, admin, teacher, student
```

Implementation guidance:

- `platform_admin` is global and should access `/admin/*` routes.
- `institution_admin` maps to institution-level `owner` or `admin` permissions.
- `teacher` maps to institution-level `teacher` permissions.
- `student` maps to enrolled learner permissions.
- `parent` should only access linked learner records, reports, messages, and summaries.

Potential future schema gap:

- If not already present in another migration, add a `parent_student_links` table to explicitly model guardianship:

```sql
parent_student_links (
  id uuid primary key,
  institution_id uuid references institutions(id),
  parent_user_id uuid references auth.users(id),
  student_user_id uuid references auth.users(id),
  relationship text,
  status text check (status in ('pending','active','revoked')),
  created_at timestamptz,
  updated_at timestamptz
)
```

## Dashboard information architecture

Each authenticated dashboard page should follow the same UI hierarchy:

1. Page header
   - role-specific title
   - plain-language subtitle
   - primary action
2. Summary cards
   - key metrics relevant to the role
3. Work queue or next actions
   - what the user should do next
4. Main table/list/grid
   - courses, learners, sessions, resources, reports, etc.
5. Secondary insight panel
   - alerts, recommendations, progress, support issues, or recent activity

## Public SEO architecture

Priority public pages:

- `/`
- `/features`
- `/how-it-works`
- `/pricing`
- `/institutions/register`
- `/solutions/schools`
- `/solutions/universities`
- `/solutions/training-providers`
- `/solutions/tutoring-centers`
- `/solutions/ngos`
- `/accessibility`
- `/classroom`
- `/docs`
- `/help`
- `/contact`

SEO implementation guidance:

- Use `src/lib/seo.ts` for common metadata.
- Every public page should include:
  - title
  - meta description
  - canonical URL
  - Open Graph title/description/image
  - Twitter card metadata
  - schema where useful
- Prefer content that explains workflows and outcomes rather than keyword stuffing.

Target SEO themes:

- AI virtual classroom platform
- AI teacher-led lessons
- accessible online learning platform
- LMS alternative for schools and institutions
- course materials to structured lessons
- inclusive EdTech for schools, universities, NGOs, training providers, and tutoring centres

## Premium design direction

Brand foundation:

- primary: teal / deep teal
- text: deep ink / slate
- background: warm white, mist, soft teal neutrals
- accent: restrained gold only for premium highlights
- avoid bright blue/indigo drift unless it has a clear semantic purpose

Component principles:

- cards should feel clean, layered, and calm
- buttons should use consistent radius, weight, hover, focus, and shadow behaviour
- dashboards should feel operational and trustworthy
- classroom should feel focused, accessible, and teacher-led
- marketing pages should feel polished, content-rich, and conversion-oriented

## Implementation priorities

1. Keep UI tokens consistent across `styles.css`, `premium.css`, `dashboard.css`, and classroom styles.
2. Use shared SEO helpers for all public pages.
3. Continue expanding content depth on solution pages and documentation pages.
4. Align dashboard routes with the actor workflows above.
5. Add schema only when workflows require missing relationships, not for speculative complexity.