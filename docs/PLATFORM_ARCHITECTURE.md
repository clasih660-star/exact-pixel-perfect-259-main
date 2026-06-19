# Klassruum Platform Architecture

This document defines how Klassruum should run across public pages, authenticated dashboards, user roles, personas, routing, and the Supabase data model. It keeps future UI, onboarding, permissions, analytics, and schema work aligned.

## Product model

Klassruum is an AI-powered virtual classroom platform for institutions, private teachers, and directly enrolled learners. It is not a generic chatbot or passive content library. The platform turns approved course materials into structured, accessible, teacher-led classroom experiences.

The operating model has two layers:

1. System role controls top-level platform access.
2. Operational persona controls how a user works inside that role.
3. Ownership and enrollment determine which courses, learners, and analytics a user can access.
4. Learners keep one persistent Klassroom identity across private and institutional journeys.

## Access model

### System roles

Application-level roles remain:

```ts
type UserRole = "platform_admin" | "institution_admin" | "owner" | "teacher" | "student" | "parent";
```

Top-level meaning:

- `platform_admin`: governs the global platform
- `institution_admin`: manages one institution
- `owner`: institution owner-level equivalent of institution admin
- `teacher`: teaching actor with subtype-aware behavior
- `student`: learner actor with subtype-aware behavior
- `parent`: guardian observer/support role

### Operational personas

Operational personas define business behavior inside the shared system roles.

#### Teacher personas

- `private_teacher`
  - applies independently
  - submits documents for review
  - is approved by platform admin
  - owns private courses and lessons
  - enrolls private learners
- `institution_teacher`
  - is added by institution admin
  - teaches institution-owned courses
  - works with institution-assigned learners
  - supervises institution delivery
- `kingpin_teacher`
  - is onboarded directly by platform admin
  - teaches KingPin-owned courses
  - serves directly assigned or partner-institution learners

#### Learner personas

- `institution_learner`
  - enrolled by an institution
  - has institution-specific academic metadata
  - also receives a global Klassroom Student ID
- `private_learner`
  - registers directly or is added outside institution structure
  - uses personal and guardian profile data instead of institution admission data
  - also receives a global Klassroom Student ID
- `teacher_enrolled_learner`
  - is added by a private teacher
  - belongs to the teacher workspace
  - can later join an institution without losing identity

## Actor responsibilities

### Platform admin

Purpose: govern the entire Klassruum platform.

Primary responsibilities:

- approve or reject private teacher applications
- review submitted teacher documents and verification status
- onboard KingPin teachers
- create and manage KingPin-owned courses
- approve institutions
- monitor billing, AI settings, usage, compliance, support, and system health
- define global governance, teaching, and compliance policies

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

Dashboard focus:

- pending teacher applications
- pending institution approvals
- active teachers by type
- KingPin delivery performance
- audit, compliance, and platform health

### Institution admin

Purpose: run one institution’s academic operations.

Primary responsibilities:

- create programmes, departments, classes, and courses
- enroll institution teachers and learners
- assign admission numbers and institutional metadata
- assign teachers to courses and classes
- upload materials and trigger lesson generation
- schedule sessions and monitor delivery
- review institution-wide progress, completion, and academic performance

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

Dashboard focus:

- teacher roster
- learner roster
- course setup progress
- pending assignments and enrollments
- live and scheduled sessions
- institution metrics

### Private teacher

Purpose: operate independently as a teacher/provider.

Primary responsibilities:

- apply to join the platform
- submit identity and qualification documents
- wait for platform admin approval
- create own courses or adopt approved templates
- create and refine lessons
- enroll own learners
- run private live classes
- track learner progress and communicate with learners or guardians

Primary route base:

- `/teacher/*`

Dashboard focus:

- application and verification status
- owned courses
- enrolled learners
- upcoming sessions
- lesson publishing queue
- subscription or payment status where applicable

### Institution teacher

Purpose: deliver learning inside an institution.

Primary responsibilities:

- teach assigned institution courses
- refine institution lessons
- run live or AI-assisted sessions
- monitor attendance and progress
- support institution learners
- report delivery issues to institution admins

Primary route base:

- `/teacher/*`

Dashboard focus:

- assigned courses
- assigned classes or streams
- today's sessions
- learners needing attention
- lesson drafts requiring review
- classroom analytics

### KingPin teacher

Purpose: deliver KingPin-owned courses.

Primary responsibilities:

- teach and administer KingPin-approved courses
- refine official lesson content
- deliver sessions to assigned groups
- meet platform quality and compliance expectations

Primary route base:

- `/teacher/*`

Dashboard focus:

- KingPin course assignments
- active learner groups
- lesson readiness
- upcoming live sessions
- quality reminders

### Institution learner

Purpose: study under an institution.

Primary responsibilities:

- access assigned institution courses
- attend lessons and live sessions
- complete assignments and quizzes
- review progress

Profile data includes:

- Klassroom Student ID
- institution admission number
- institution student code where applicable
- class, programme, campus, and guardian context

### Private learner

Purpose: study outside institution structure.

Primary responsibilities:

- access personal or private-teacher courses
- join assigned or purchased sessions
- track progress and communicate with the teacher

Profile data includes:

- Klassroom Student ID
- guardian and contact data
- learning goal
- enrollment source

### Parent / guardian

Purpose: observe, support, and communicate.

Primary responsibilities:

- track linked learners
- review reports and summaries
- communicate with teachers or institution staff
- monitor attendance and progress

Primary routes:

- `/parent/dashboard`
- `/parent/learners`
- `/parent/progress`
- `/parent/sessions`
- `/parent/reports`
- `/parent/messages`
- `/parent/settings`

## Identity, ownership, and delivery rules

### Universal learner identity

Every learner receives an auto-generated Klassroom Student ID.

Rules:

- Klassroom Student ID is the universal system identity
- institution admission number is a local institution identifier
- a learner can have multiple enrollments over time
- a learner can move between teacher-enrolled, private, and institution contexts without identity loss

### Content ownership

- private teacher owns private content
- institution owns institution content
- KingPin owns official shared content

### Teaching rights

- private teacher teaches only own or explicitly assigned learners
- institution teacher teaches only institution-assigned courses and learners
- KingPin teacher teaches only KingPin-assigned courses or delegated partner groups

### Enrollment sources

Enrollment records should always keep source context:

- `institution`
- `private_teacher`
- `kingpin`
- `self_registered`

## Database relationship model

The current Supabase migrations support the broad classroom architecture, but persona-aware delivery needs additional schema support.

Primary hierarchy:

```text
Platform
├── Platform governance
│   ├── Teacher applications
│   ├── Teacher documents
│   └── KingPin course ownership
├── Institution
│   ├── Institution members / roles
│   ├── Programmes
│   │   └── Courses
│   │       ├── Course materials
│   │       ├── Lessons
│   │       ├── Enrollments
│   │       └── Course teacher assignments
│   ├── Institution learner records
│   ├── Notifications
│   ├── Recommendations
│   ├── Study goals
│   └── Achievements
└── Teacher workspace
    ├── Teacher learner links
    ├── Private course ownership
    └── Session delivery
```

Recommended extensions:

- `profiles`
  - keep core user identity and top-level role
- `teacher_profiles`
  - `user_id`
  - `teacher_type`
  - `application_status`
  - `verification_status`
  - `hired_by_admin`
  - `institution_id` nullable
  - `bio`
  - `specialization`
  - `document_status`
- `teacher_documents`
  - qualifications
  - ID documents
  - certificates
  - review notes
- `learner_profiles`
  - `user_id`
  - `klassroom_student_id`
  - `learner_type`
  - `primary_enrollment_source`
- `institution_learner_records`
  - `learner_id`
  - `institution_id`
  - `admission_number`
  - `institution_student_code`
  - `class_level`
  - `programme_id`
  - `campus`
  - `status`
- `teacher_learner_links`
  - private-teacher and teacher-enrolled learner relationships
- `course_ownership`
  - `course_id`
  - `owner_type`
  - `owner_id`
- `course_teacher_assignments`
  - delivery rights per course
- `enrollments`
  - extend with `enrollment_source`
  - `institution_id` nullable
  - `teacher_id` nullable
- `student_id_sequences` or DB function
  - generates unique Klassroom Student IDs

Potential future schema gap:

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

## Routing and permission model

Current implementation should stay route-compatible while becoming persona-aware.

Guidance:

- keep coarse top-level route spaces: `/admin/*`, `/institution/*`, `/teacher/*`, `/student/*`, `/parent/*`
- keep `teacher` and `student` as system roles for route gating
- resolve persona and scope at auth/profile load boundaries
- prefer one teacher route tree with subtype-aware modules instead of three separate trees
- prefer one learner route tree with subtype-aware modules instead of multiple fragmented trees
- validate institution, course, and learner scope at server and route boundaries

Guard expectations:

- `platform_admin` can access all global governance routes
- `institution_admin` or `owner` can access institution operations routes
- `teacher` can access `/teacher/*`, but data and widgets must be filtered by `teacher_type`
- `student` can access `/student/*`, but data and widgets must be filtered by `learner_type`
- `parent` can access only linked learner surfaces

## Dashboard information architecture

Each authenticated dashboard page should follow the same hierarchy:

1. page header
   - persona-specific title
   - plain-language subtitle
   - primary action
2. summary cards
   - key persona metrics
3. work queue or next actions
   - what the user should do next
4. main table, list, or grid
   - courses, learners, sessions, applications, reports, or assignments
5. secondary insight panel
   - alerts, recommendations, progress, support issues, or recent activity

Persona-aware dashboard expectations:

- platform admin: approvals, governance, KingPin delivery, system health
- institution admin: rosters, setup progress, sessions, institutional metrics
- private teacher: verification status, own learners, private courses, private sessions
- institution teacher: assigned classes, lesson readiness, learner attention queue
- KingPin teacher: official assignments, delivery queue, compliance reminders
- institution learner: admission-linked context and institution course progress
- private learner: personal course context and teacher communication
- teacher-enrolled learner: teacher workspace context and transition readiness
- parent: linked learner summaries and communication

## Workflow model

### Private teacher flow

1. teacher applies
2. platform admin reviews documents
3. teacher is approved
4. teacher creates or adopts courses
5. teacher creates or refines lessons
6. teacher enrolls private learners
7. teacher schedules live sessions or publishes AI lessons
8. learners attend and complete work
9. teacher reviews analytics and supports learners

### Institution teacher flow

1. institution admin creates courses and programmes
2. institution admin adds teacher
3. teacher is assigned to courses and classes
4. institution uploads materials
5. lessons are generated and refined
6. institution learners are enrolled
7. teacher runs live or hybrid sessions
8. learners participate
9. institution admin monitors performance while teacher handles delivery

### KingPin teacher flow

1. platform admin creates official courses
2. platform admin onboards KingPin teacher
3. teacher is assigned to KingPin courses or learner groups
4. learners are assigned directly or through partner institutions
5. teacher delivers official lessons and sessions
6. platform admin monitors quality and compliance

## Lesson delivery interaction model

The three teaching models should interact through clear ownership, delivery, and supervision boundaries.

### Before lesson delivery

- platform admin approves private teachers and onboards KingPin teachers
- institution admin prepares courses, rosters, admission data, and institution teacher assignments
- teachers prepare the actual delivery experience by reviewing materials, refining lessons, and scheduling sessions
- learners receive access through the correct enrollment source: institution, private teacher, KingPin, or self-registration

### During lesson delivery

- the assigned teacher leads the classroom experience
- learners interact through questions, notes, practice, quizzes, captions, and live support tools
- institution admin monitors institutional operations, schedules, and coverage, but does not replace the assigned teacher unless separately granted teaching responsibility
- platform admin monitors quality, compliance, support, and system health, but does not interfere with ordinary institution delivery

### After lesson delivery

- teachers review learner engagement, misconceptions, attendance, and progress
- institution admin reviews course and cohort performance for institution-owned delivery
- platform admin reviews private-teacher approvals, KingPin quality assurance, and cross-platform governance metrics
- parents or guardians review summaries, progress, attendance, and teacher communication where links exist

### Boundary rules

- private teachers cannot access institution rosters unless explicitly attached to an institution workflow
- institution teachers cannot manage platform-wide approvals or KingPin governance
- KingPin teachers cannot edit institution admission records unless separately assigned institution responsibilities
- learners always keep the same Klassroom Student ID even when they move between teacher-enrolled, private, and institution contexts

## Implementation roadmap

1. document business personas, ownership rules, and delivery rules
2. extend shared types with `teacher_type`, `learner_type`, `enrollment_source`, `course_owner_type`, and application state
3. update auth and route resolution to load both role and persona
4. make dashboard configuration persona-aware while preserving current route spaces
5. add onboarding flows for private teachers, institution teachers, KingPin teachers, and all learner types
6. implement course ownership and delivery enforcement in server functions and queries
7. add reporting and supervision views per actor type

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

- use `src/lib/seo.ts` for common metadata
- every public page should include title, description, canonical URL, Open Graph metadata, and Twitter metadata
- prefer content that explains workflows and outcomes rather than keyword stuffing

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
- avoid bright blue or indigo drift unless it serves a clear semantic purpose

Component principles:

- cards should feel clean, layered, and calm
- buttons should use consistent radius, weight, hover, focus, and shadow behavior
- dashboards should feel operational and trustworthy
- classroom should feel focused, accessible, and teacher-led
- marketing pages should feel polished, content-rich, and conversion-oriented

## Implementation priorities

1. keep UI tokens consistent across shared dashboard and classroom styles
2. keep routes coarse-grained and make widgets/data persona-aware
3. add schema only when a workflow needs a missing relationship
4. validate persona and organizational scope at system boundaries
5. expand onboarding, approvals, and analytics in phased delivery
