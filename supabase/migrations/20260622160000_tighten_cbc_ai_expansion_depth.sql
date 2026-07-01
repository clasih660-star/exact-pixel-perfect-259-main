-- Bring CBC AI expansion lessons to the same depth floor as the starter set.
--
-- The expansion migration created 11 classroom sections and 12 complete teaching
-- items per lesson. This revision raises every cbc_ai_expansion_v2 lesson to a
-- minimum of 20 complete teaching items while keeping the 25-40 minute pacing.

UPDATE public.lessons
SET
  minimum_duration_minutes = 25,
  estimated_duration_minutes = 40,
  duration_minutes = 40,
  lesson_data_json =
    lesson_data_json ||
    jsonb_build_object(
      'seedRevision', 'cbc_ai_expansion_depth_v3',
      'qualityFloor', jsonb_build_object(
        'minimumSections', 11,
        'minimumTeachingItems', 20,
        'durationBandMinutes', jsonb_build_object('min', 25, 'max', 40),
        'teacherReviewNote', 'AI expansion lesson now matches the CBC starter depth floor: 11 sections, at least 20 complete teaching items, and 25-40 minute pacing.'
      ),
      'pacingPlan', jsonb_build_object(
        'minimumDurationMinutes', 25,
        'targetDurationMinutes', 40,
        'maximumDurationMinutes', 40,
        'extensionStrategies', jsonb_build_array(
          'Use a local learner example only when the class is moving quickly.',
          'Ask one learner to restate the idea before independent practice.',
          'Reteach with the visual organizer when the checkpoint reveals confusion.',
          'Use the exit reflection to decide whether the next class should reteach, extend, or assess.'
        )
      )
    ),
  updated_at = now()
WHERE lesson_data_json->>'seedVersion' = 'cbc_ai_expansion_v2';

WITH seed_lessons AS (
  SELECT
    l.id AS lesson_id,
    l.course_id,
    l.institution_id,
    l.title AS lesson_title,
    COALESCE(l.objective, 'Apply the lesson idea with evidence.') AS objective,
    COALESCE(c.grade, 0) AS grade,
    COALESCE(c.curriculum_subject, c.subject, 'CBC') AS subject,
    COALESCE(l.lesson_data_json #>> '{curriculum,strand}', 'the lesson strand') AS strand,
    COALESCE(l.lesson_data_json #>> '{curriculum,subStrand}', 'the lesson focus') AS sub_strand
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  WHERE l.lesson_data_json->>'seedVersion' = 'cbc_ai_expansion_v2'
),
additional_items(lesson_id, section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake, seconds) AS (
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
        'Local link: school, home, and community evidence',
        'Connect this lesson to one place learners know well: school, home, or community.',
        'The teacher should collect one familiar example from learners, choose the clearest one, and connect it back to the lesson idea. Keep the example short so it supports the concept instead of replacing it.',
        'Local link: give one familiar example and connect it to the lesson idea.',
        'Board prompt asking learners to connect the lesson to a familiar setting.',
        'Local examples help learners transfer knowledge into daily choices.',
        'Do not let the example become a story that loses the lesson point.',
        60
      ),
      (
        'prerequisite_check',
        1,
        'answer',
        'Expected start: one word, one example, or one question',
        'A useful starting answer can be one word, one example, or one honest question.',
        'This gives every learner a valid way to begin. Confident learners may give examples. Unsure learners can name a word or ask a question. The teacher uses the answers to decide how slowly to teach the concept.',
        'Starter response: word, example, or question.',
        'Acceptable starter-response options listed on the board.',
        'A low-pressure entry point increases participation.',
        'Being unsure does not mean staying silent; a question is useful evidence.',
        60
      ),
      (
        'concept',
        2,
        'instruction',
        'Break it down: term, meaning, example, evidence',
        'Break the idea into four parts: term, meaning, example, and evidence.',
        'The teacher should pause at each part. Learners first name the term, then explain its meaning, then connect it to an example, and finally state evidence that proves the answer is reasonable.',
        'Concept breakdown: term, meaning, example, evidence.',
        'Four-part concept breakdown on the board.',
        'Breaking the concept into parts prevents memorised but shallow answers.',
        'Do not define the term without showing how it appears in an example.',
        90
      ),
      (
        'worked_example',
        1,
        'calculation',
        'Reasoning path: notice, choose, explain, check',
        'Use this reasoning path: notice the situation, choose the useful idea, explain the reason, then check the answer.',
        'Even outside mathematics, learners need a visible reasoning path. Model how to move from observation to choice, from choice to explanation, and from explanation to checking the answer.',
        'Worked example path: notice, choose, explain, check.',
        'Four-step reasoning path for the worked example.',
        'A visible reasoning path helps learners copy the thinking process, not only the answer.',
        'Skipping the check step can leave a confident but weak answer.',
        90
      ),
      (
        'question_checkpoint',
        1,
        'instruction',
        'Self-check: explain, apply, and justify',
        'Before practice, ask yourself: can I explain it, apply it, and justify my answer?',
        'This checkpoint separates recognition from understanding. A learner may recognize the words but still need help applying or justifying them. Reteach if many learners cannot answer all three checks.',
        'Self-check: explain, apply, justify.',
        'Self-check criteria shown before practice.',
        'The checkpoint catches confusion before independent work starts.',
        'Saying I know it is not enough; show it through explanation and evidence.',
        60
      ),
      (
        'guided_practice',
        1,
        'instruction',
        'Support plan: first step together, next step learner-led',
        'We will do the first step together. Then you will suggest the next step before I continue.',
        'The teacher should avoid solving the whole task alone. Model the first move, invite learner suggestions, correct gently, and complete the response using lesson vocabulary.',
        'Guided support: teacher models, learner suggests, class corrects.',
        'Guided practice support sequence on the board.',
        'Guided practice should transfer thinking from teacher to learner.',
        'Do not turn guided practice into another full explanation.',
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
        'Notebook finish: idea, example, correction, next step',
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
  ai.order_index,
  ai.item_type,
  ai.board_text,
  ai.exact_spoken_text,
  ai.teacher_explanation,
  ai.learner_notes,
  ai.accessible_description,
  ai.why_this_matters,
  ai.common_mistake,
  'normal',
  ai.seconds,
  now(),
  now()
FROM seed_lessons sl
JOIN public.lesson_sections ls ON ls.lesson_id = sl.lesson_id
JOIN additional_items ai ON ai.lesson_id = sl.lesson_id AND ai.section_type = ls.type
WHERE NOT EXISTS (
  SELECT 1
  FROM public.teaching_items existing
  WHERE existing.lesson_id = sl.lesson_id
    AND existing.section_id = ls.id
    AND existing.order_index = ai.order_index
    AND existing.board_text = ai.board_text
);

UPDATE public.course_materials cm
SET
  extracted_text = cm.extracted_text || E'\n\nDepth revision: each AI expansion lesson now includes at least 20 complete teaching items across 11 sections, with a 25-40 minute classroom pacing contract.',
  curriculum_metadata = COALESCE(cm.curriculum_metadata, '{}'::jsonb) || jsonb_build_object(
    'depthRevision', 'cbc_ai_expansion_depth_v3',
    'lessonDurationBandMinutes', jsonb_build_object('min', 25, 'max', 40),
    'minimumTeachingItemsPerLesson', 20
  ),
  updated_at = now()
WHERE cm.curriculum_metadata->>'seedKey' = 'cbc_ai_expansion_outline_v2'
  AND cm.curriculum_metadata->>'depthRevision' IS DISTINCT FROM 'cbc_ai_expansion_depth_v3';
