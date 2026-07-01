-- Tighten CBC starter lesson depth and pacing.
--
-- The first starter seed made the lessons classroom-ready, but the per-section
-- estimates added up to 50 minutes while the lesson duration was 40 minutes.
-- This migration normalizes every CBC starter lesson to a 25-40 minute pacing
-- contract and adds extra detail items without pushing the runtime past 40 min.

UPDATE public.lessons
SET
  minimum_duration_minutes = 25,
  estimated_duration_minutes = 40,
  duration_minutes = 40,
  lesson_data_json =
    lesson_data_json ||
    jsonb_build_object(
      'seedRevision', 'cbc_depth_pacing_v2',
      'pacingPlan', jsonb_build_object(
        'minimumDurationMinutes', 25,
        'targetDurationMinutes', 40,
        'maximumDurationMinutes', 40,
        'extensionStrategies', jsonb_build_array(
          'Use a local learner example only if the class is moving faster than expected.',
          'Ask one peer explanation before independent practice.',
          'Reteach with the visual organizer when learners miss the checkpoint.',
          'Keep the exit reflection short so the lesson stays inside 40 minutes.'
        )
      ),
      'qualityFloor', jsonb_build_object(
        'minimumSections', 11,
        'minimumTeachingItems', 20,
        'durationBandMinutes', jsonb_build_object('min', 25, 'max', 40),
        'teacherReviewNote', 'Starter lesson is detailed enough for a 25-40 minute class and should be extended with licensed materials for full syllabus depth.'
      )
    ),
  updated_at = now()
WHERE lesson_data_json->>'seedVersion' = 'cbc_starter_v1';

WITH section_minutes(section_type, minutes) AS (
  VALUES
    ('welcome', 3),
    ('objective', 3),
    ('why_it_matters', 3),
    ('prerequisite_check', 3),
    ('concept', 7),
    ('worked_example', 6),
    ('question_checkpoint', 3),
    ('guided_practice', 5),
    ('independent_practice', 4),
    ('summary', 2),
    ('exit_reflection', 1)
)
UPDATE public.lesson_sections ls
SET
  estimated_minutes = sm.minutes,
  updated_at = now()
FROM section_minutes sm, public.lessons l
WHERE ls.type = sm.section_type
  AND l.id = ls.lesson_id
  AND l.lesson_data_json->>'seedVersion' = 'cbc_starter_v1';

WITH seed_lessons AS (
  SELECT
    l.id AS lesson_id,
    l.course_id,
    l.institution_id,
    l.title AS lesson_title,
    COALESCE(l.objective, 'Understand and apply the lesson idea.') AS objective,
    COALESCE(c.grade, 0) AS grade,
    COALESCE(c.curriculum_subject, c.subject, 'CBC') AS subject,
    COALESCE(l.lesson_data_json #>> '{curriculum,strand}', 'the lesson strand') AS strand,
    COALESCE(l.lesson_data_json #>> '{curriculum,subStrand}', 'the lesson focus') AS sub_strand
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  WHERE l.lesson_data_json->>'seedVersion' = 'cbc_starter_v1'
),
detail_items(lesson_id, section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake, seconds) AS (
  SELECT
    sl.lesson_id,
    x.section_type,
    x.order_index,
    x.item_type,
    x.board_text,
    x.exact_spoken_text,
    x.teacher_explanation,
    x.learner_notes,
    x.accessible_description,
    x.why_this_matters,
    x.common_mistake,
    x.seconds
  FROM seed_lessons sl
  CROSS JOIN LATERAL (
    VALUES
      (
        'why_it_matters',
        1,
        'bullet',
        'Real-life link: school, home, and community',
        'Connect this lesson to one real place learners know: school, home, or community.',
        'The teacher should ask learners for one familiar example, then choose the clearest example and connect it back to the lesson goal. This makes the idea practical without drifting into a long discussion.',
        'Real-life link: give one familiar example and connect it to the lesson goal.',
        'Board prompt asking learners to connect the topic to a familiar setting.',
        'Local examples make the concept easier to remember and apply.',
        'Do not let the example replace the concept; use it to explain the concept.',
        60
      ),
      (
        'prerequisite_check',
        1,
        'answer',
        'Expected start: one example, one word, or one question',
        'A good starting answer can be one example, one useful word, or one honest question.',
        'This gives every learner an entry point. Strong learners may give an example; unsure learners can name a word or ask a question. The teacher uses those responses to decide how slowly to begin.',
        'Starter response: example, vocabulary word, or question.',
        'Board text showing acceptable ways to begin the lesson.',
        'A low-pressure start helps more learners participate.',
        'Silence is not the only option when unsure.',
        60
      ),
      (
        'concept',
        2,
        'instruction',
        'Break it down: term, meaning, example, evidence',
        'Break the idea into four parts: the term, the meaning, an example, and the evidence.',
        'The teacher should point to each part and pause. Learners first name the term, then explain its meaning, then connect it to the worked example, and finally state the evidence that proves the explanation is reasonable.',
        'Concept breakdown: term, meaning, example, evidence.',
        'Four-part concept breakdown on the board.',
        'Breaking the concept into parts prevents shallow memorisation.',
        'Do not define a term without showing how it appears in an example.',
        90
      ),
      (
        'worked_example',
        1,
        'calculation',
        'Reasoning path: notice -> choose -> explain -> check',
        'Use this reasoning path: notice the situation, choose the useful idea, explain your reason, then check the answer.',
        'Even in non-mathematics subjects, learners need a reasoning path. The teacher models how to move from observation to choice, from choice to explanation, and from explanation to checking for accuracy.',
        'Worked example reasoning path: notice, choose, explain, check.',
        'Four-step reasoning path for the worked example.',
        'A visible reasoning path helps learners copy the thinking process, not only the answer.',
        'Skipping the check step can leave a confident but weak answer.',
        90
      ),
      (
        'question_checkpoint',
        1,
        'instruction',
        'Self-check: can I explain, apply, and justify?',
        'Before we practise, ask yourself: can I explain it, apply it, and justify my answer?',
        'This checkpoint separates recognition from understanding. Learners may recognize the words but still need help applying or justifying them. The teacher should reteach if many learners cannot answer all three checks.',
        'Self-check: explain, apply, justify.',
        'Self-check criteria shown before practice.',
        'The checkpoint catches confusion before independent work starts.',
        'Saying "I know it" is not enough; show it through explanation and application.',
        60
      ),
      (
        'guided_practice',
        1,
        'instruction',
        'Teacher support: first step together, next step learner-led',
        'We will do the first step together. Then you will suggest the next step before I continue.',
        'The teacher should avoid solving the entire practice task alone. Model the first move, invite learner suggestions, correct gently, and then complete the task using the lesson vocabulary.',
        'Guided support: teacher models, learner suggests, class corrects.',
        'Guided practice support sequence on the board.',
        'Guided practice should gradually transfer thinking to the learner.',
        'Do not turn guided practice into another lecture.',
        75
      ),
      (
        'independent_practice',
        1,
        'instruction',
        'Success criteria: complete, clear, evidence-based',
        'Your answer should be complete, clear, and evidence-based.',
        'A complete answer addresses the task. A clear answer uses correct vocabulary. An evidence-based answer gives a reason or example. The teacher should use these criteria while reviewing learner responses.',
        'Success criteria: complete answer, correct vocabulary, reason or example.',
        'Independent practice success criteria on the board.',
        'Success criteria make learner work easier to assess and improve.',
        'A correct-looking answer can still be weak if it has no reason.',
        75
      ),
      (
        'summary',
        1,
        'bullet',
        'Notebook finish: key idea, example, correction, next step',
        'Finish your notes with the key idea, one example, one correction, and your next step.',
        'This gives learners a useful revision record. The correction can be a mistake they fixed or a warning they want to remember. The next step tells the teacher what support may be needed later.',
        'Notebook finish: key idea, example, correction, next step.',
        'Notebook finish checklist on the board.',
        'A structured note helps learners revise after the lesson.',
        'Do not leave with only copied board text; add the correction or next step.',
        60
      )
  ) AS x(section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake, seconds)
)
INSERT INTO public.teaching_items (
  institution_id,
  course_id,
  lesson_id,
  section_id,
  order_index,
  type,
  board_text,
  exact_spoken_text,
  teacher_explanation,
  learner_notes,
  accessible_description,
  why_this_matters,
  common_mistake,
  writing_speed,
  estimated_seconds,
  created_at,
  updated_at
)
SELECT
  sl.institution_id,
  sl.course_id,
  sl.lesson_id,
  ls.id,
  di.order_index,
  di.item_type,
  di.board_text,
  di.exact_spoken_text,
  di.teacher_explanation,
  di.learner_notes,
  di.accessible_description,
  di.why_this_matters,
  di.common_mistake,
  'normal',
  di.seconds,
  now(),
  now()
FROM seed_lessons sl
JOIN public.lesson_sections ls ON ls.lesson_id = sl.lesson_id
JOIN detail_items di ON di.lesson_id = sl.lesson_id AND di.section_type = ls.type
WHERE NOT EXISTS (
  SELECT 1
  FROM public.teaching_items existing
  WHERE existing.lesson_id = sl.lesson_id
    AND existing.section_id = ls.id
    AND existing.order_index = di.order_index
    AND existing.board_text = di.board_text
);

UPDATE public.teaching_items ti
SET
  estimated_seconds = LEAST(COALESCE(ti.estimated_seconds, 90), 120),
  updated_at = now()
FROM public.lessons l
WHERE l.id = ti.lesson_id
  AND l.lesson_data_json->>'seedVersion' = 'cbc_starter_v1'
  AND ti.estimated_seconds > 120;

UPDATE public.course_materials cm
SET
  extracted_text = cm.extracted_text || E'\n\nPacing and depth revision: each starter lesson is designed for 25-40 minutes. Teachers should spend time on concept unpacking, worked reasoning, guided transfer, independent practice, and exit reflection.',
  curriculum_metadata = COALESCE(cm.curriculum_metadata, '{}'::jsonb) || jsonb_build_object(
    'depthRevision', 'cbc_depth_pacing_v2',
    'lessonDurationBandMinutes', jsonb_build_object('min', 25, 'max', 40),
    'minimumTeachingItemsPerLesson', 20
  ),
  updated_at = now()
WHERE cm.curriculum_metadata->>'seedKey' = 'cbc_starter_outline_v1'
  AND cm.curriculum_metadata->>'depthRevision' IS DISTINCT FROM 'cbc_depth_pacing_v2';
