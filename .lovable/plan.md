## Goal

Make Klassruum's architecture clearly hierarchical in both database and UI:

```text
Institution → Courses → Enrollments → Lessons → Classroom Sessions
                                              → Progress / Chat / Quiz / Summary
```

The existing institution scaffold (registration, dashboard, classrooms, resources, settings) stays. Classrooms are kept as virtual spaces but we add the **Course → Lesson → Session** spine that everything else hangs off.

## Scope (this turn — MVP-deep, structure-complete)

### Backend (one migration)
New tables, all with RLS + GRANTs:
- `courses` (institution_id, title, slug, subject, level, status, created_by)
- `course_teachers` (course_id, teacher_id)
- `course_enrollments` (course_id, student_id, status)
- `lessons` (course_id, title, order_index, lesson_data_json, status, source_resource_id)
- `quizzes` (lesson_id, questions_json)
- `classroom_sessions` (lesson_id, course_id, host_user_id, mode, status, started_at, ended_at)
- `lesson_progress` (lesson_id, student_id, progress_percentage, status)
- `chat_messages` (session_id, sender, message)
- `quiz_results` (quiz_id, student_id, score, percentage, answers_json)
- `lesson_summaries` (lesson_id, student_id, summary_text, key_points_json)
- `learner_access_profiles` (user_id, institution_id, settings…)

Plus helper `SECURITY DEFINER` functions for access checks:
- `is_enrolled(_course_id, _user_id)`
- `is_course_teacher(_course_id, _user_id)`

Statuses use plain TEXT with CHECK constraints (simpler than enums for fast iteration).

RLS rules (summary):
- Institution admins/owners manage everything in their institution.
- Teachers manage assigned courses + their lessons/sessions.
- Students read only courses/lessons they are enrolled in (status=active) and their own progress/results/summaries.

### Server functions (`createServerFn`)
- `courses.functions.ts` — list/create/update + dashboard counts
- `enrollments.functions.ts` — list/enroll/remove
- `lessons.functions.ts` — list/create/update
- `sessions.functions.ts` — start session, end session, get classroom context
- `student.functions.ts` — my courses, my progress

### Frontend routes (TanStack file-based)

**Institution admin** (under `_authenticated/`):
- `institution.courses.tsx` — list + create dialog
- `institution.courses.$courseId.tsx` — tabs: Overview | Lessons | Enrollments | Resources | Settings
- (existing dashboard updated to show course/student/session counts)

**Student** (under `_authenticated/`):
- `student.dashboard.tsx` — enrolled courses + continue learning
- `student.courses.tsx` — list of my courses
- `student.courses.$courseId.tsx` — lessons in this course
- `student.lessons.$lessonId.tsx` — lesson overview + Start Session

**Classroom** (existing demo `/classroom/$lessonId` stays for the public demo). Add `/classroom/session/$sessionId` for real sessions loading full `ClassroomContext`.

**Public**:
- Landing already updated. No change.
- Existing `/auth` handles login/signup.

### Components
- `CreateCourseDialog`
- `CreateLessonDialog`
- `EnrollStudentDialog`
- `CourseTabs` (Overview/Lessons/Enrollments/Resources/Settings)
- `StudentShell` sidebar (Dashboard, My Courses, Progress)
- Update `InstitutionShell` sidebar to add **Courses** above Classrooms

### Demo seed (via insert tool after migration approved)
- Demo institution stays as-is. Add a public "Demo" course + lesson row marker so the existing demo lesson can be browsed structurally too (but the public `/classroom/$lessonId` static demo continues to work without auth).

## Out of scope (deferred, explicitly)
- Teacher portal (`/teacher/*`) — institution admins double as teachers for MVP
- Platform admin (`/admin/*`)
- Real RAG / resource → lesson AI generation (button shows toast)
- Live multi-student sessions / realtime presence
- Payments, billing, plans
- Email invitations (enroll by user_id only; email invite shows toast)
- Notes export, certificates, attendance

## Files touched

**New**
- `supabase/migrations/<ts>_courses_lessons_sessions.sql`
- `src/lib/courses.functions.ts`
- `src/lib/enrollments.functions.ts`
- `src/lib/lessons.functions.ts`
- `src/lib/sessions.functions.ts`
- `src/lib/student.functions.ts`
- `src/components/institution/CreateCourseDialog.tsx`
- `src/components/institution/CreateLessonDialog.tsx`
- `src/components/institution/EnrollStudentDialog.tsx`
- `src/components/institution/CourseTabs.tsx`
- `src/components/student/StudentShell.tsx`
- `src/routes/_authenticated/institution.courses.tsx`
- `src/routes/_authenticated/institution.courses.$courseId.tsx`
- `src/routes/_authenticated/student.dashboard.tsx`
- `src/routes/_authenticated/student.courses.tsx`
- `src/routes/_authenticated/student.courses.$courseId.tsx`
- `src/routes/_authenticated/student.lessons.$lessonId.tsx`
- `src/routes/classroom.session.$sessionId.tsx`

**Edited**
- `src/components/institution/InstitutionShell.tsx` (add Courses link)
- `src/routes/_authenticated/institution.dashboard.tsx` (real counts)
- `src/routes/index.tsx` (add Student/Institution quick links if signed in)

## Order of execution

1. Migration (waits for approval)
2. After approval: server fns + UI + components in parallel
3. Seed demo course/lesson via insert tool
4. Verify build green

## Risks / notes

- Lots of tables — keeping RLS tight via `is_institution_member` / `has_institution_role` / new `is_enrolled` helpers to avoid policy duplication.
- Existing `/classroom/$lessonId` demo route stays untouched; new `/classroom/session/$sessionId` is the real path.
- Keeping statuses as TEXT+CHECK (not enums) so future statuses don't need migrations.
