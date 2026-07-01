# Klassruum Launch Readiness Route Matrix

This matrix narrows launch scope to the **institution admin → teacher → student** path and hides destinations that are still placeholders or demo-shaped.

## Launch-live navigation

### Student / learner
- `/student/dashboard`
- `/student/classrooms`
- `/student/courses`
- `/student/lessons`
- `/student/calendar`
- `/student/resources`
- `/student/notes`
- `/student/progress`
- `/student/assignments`
- `/student/quizzes`
- `/student/messages`
- `/student/access`
- `/student/search`
- `/student/notifications`
- `/student/settings`

### Teacher
- `/teacher/dashboard`
- `/teacher/courses`
- `/teacher/lessons`
- `/teacher/sessions`
- `/teacher/students`
- `/teacher/supervision`
- `/teacher/analytics`
- `/teacher/notifications`
- `/teacher/settings`

### Institution admin
- `/institution/dashboard`
- `/institution/courses`
- `/institution/sessions`
- `/institution/resources`
- `/institution/teachers`
- `/institution/billing`
- `/institution/notifications`
- `/institution/settings`

### Platform admin (operational only)
- `/admin/users`
- `/admin/institutions`
- `/admin/plans`
- `/admin/usage`
- `/admin/support`
- `/admin/health`
- `/admin/notifications`
- `/admin/settings`

## Deferred / hidden from launch navigation

These routes either use `RouteStubPage`, still rely on mock/demo behavior, or are not needed for the first institution pilot.

### Institution
- `/institution/programmes`
- `/institution/lesson-generation`
- `/institution/students`
- `/institution/enrollments`
- `/institution/analytics`
- `/institution/activity`

### Teacher
- `/teacher/resources`
- `/teacher/messages`

### Student
- `/student/transcripts`

### Platform admin
- `/admin/dashboard`
- `/admin/kingpin-courses`
- `/admin/programmes`
- `/admin/courses`
- `/admin/lessons`
- `/admin/materials`
- `/admin/lesson-generation`
- `/admin/realtime`
- `/admin/ai-settings`
- `/admin/activity`
- `/admin/audit-logs`

### Parent persona
- Parent experience is not launch-ready.
- Parent routes should remain out of launch navigation until the dashboard is backed by real data and the linked child routes are implemented.

## Immediate next steps

1. Replace launch-visible mock data before any pilot institution is onboarded.
2. Keep deferred routes behind direct URLs only, feature flags, or internal QA access.
3. Update public/internal status docs whenever a deferred route becomes launch-live.