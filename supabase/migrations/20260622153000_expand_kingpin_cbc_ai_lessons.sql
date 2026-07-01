-- Expand KingPin Kenyan CBC AI starter courses from 4 to 12 lessons.
--
-- This migration adds eight original KingPin-authored AI lessons to every
-- existing Grade 6-9 CBC course shell. It does not copy textbook text; the
-- lessons are generic CBC-aligned teaching scaffolds that can be deepened later
-- with licensed or institution-provided materials.

CREATE TEMP TABLE cbc_ai_expansion_seed (
  subject_slug text NOT NULL,
  discipline_type text NOT NULL,
  visual_kind text NOT NULL,
  lesson_order int NOT NULL,
  strand text NOT NULL,
  sub_strand text NOT NULL,
  title text NOT NULL,
  focus_task text NOT NULL,
  vocabulary text NOT NULL
) ON COMMIT DROP;

WITH subject_expansions(subject_slug, discipline_type, visual_kind, strands, titles, focus_tasks, vocabulary) AS (
  VALUES
    (
      'agriculture',
      'technical',
      'workflow',
      ARRAY['Soil fertility','Crop protection','Water conservation','Organic waste use','Farm tools and safety','Animal feeding','Farm records','Agriculture enterprise'],
      ARRAY['Soil fertility and crop nutrition','Managing crop pests and diseases','Conserving water in farming','Composting and manure use','Farm tools and safe work habits','Feeding small livestock responsibly','Keeping simple farm records','Planning a small agriculture enterprise'],
      ARRAY['Analyze soil needs and choose a practical fertility improvement.','Identify pest or disease signs and choose a safe response.','Compare water-saving practices for a school or home garden.','Plan how organic waste can become useful compost or manure.','Choose the right tool for a farm task and explain safe use.','Create a balanced feeding routine for small livestock.','Use a simple record to track inputs, activities, and outputs.','Plan a small agriculture project with resources, risks, and expected returns.'],
      'soil, fertility, pest, disease, water, compost, tool, record, enterprise'
    ),
    (
      'arabic',
      'languages',
      'text_reference',
      ARRAY['Letter forms','Short vowel sounds','Classroom vocabulary','Home vocabulary','Polite requests','Dialogue reading','Sentence writing','Culture and communication'],
      ARRAY['Arabic letter forms and positions','Short vowel sounds in Arabic words','Classroom objects and useful words','Family and home vocabulary','Making polite requests in Arabic','Reading short Arabic dialogues','Writing simple Arabic sentences','Culture in everyday Arabic communication'],
      ARRAY['Recognize how a letter changes form by position.','Match short vowel sounds to familiar words.','Use classroom words in a simple spoken exchange.','Use family and home words in meaningful sentences.','Build polite request phrases for classroom situations.','Read a short dialogue and identify speakers, meaning, and purpose.','Write short sentences using familiar vocabulary.','Explain how language choices show respect in everyday communication.'],
      'letter, vowel, classroom, family, request, dialogue, sentence, respect'
    ),
    (
      'creative-arts',
      'general',
      'illustration',
      ARRAY['Observation drawing','Colour and pattern','Rhythm and beat','Song structure','Movement phrases','Craft safety','Performance storytelling','Portfolio reflection'],
      ARRAY['Drawing from observation','Using colour and pattern intentionally','Rhythm and beat in creative work','Building a simple song structure','Creating movement and dance phrases','Using craft materials safely','Telling stories through performance','Reflecting on a creative portfolio'],
      ARRAY['Draw an observed object using line, shape, and proportion.','Choose colour and pattern to communicate a clear idea.','Clap, count, or mark a rhythm and explain its pattern.','Plan a simple song with beginning, repeated part, and ending.','Create a short movement phrase with space, level, and direction.','Select materials and explain safe handling before making.','Plan a short performance with characters, action, and message.','Review creative work and identify strengths and next improvements.'],
      'observation, colour, rhythm, structure, movement, craft, performance, reflection'
    ),
    (
      'cre',
      'humanities',
      'text_reference',
      ARRAY['Creation and stewardship','Family values','Forgiveness','Worship practices','Service','Leadership','Peer pressure','Care for others'],
      ARRAY['Creation and responsible stewardship','Family and community values','Forgiveness and reconciliation','Prayer and worship practices','Serving others in practical ways','Leadership and responsibility','Making wise choices under peer pressure','Caring for vulnerable people'],
      ARRAY['Connect stewardship to a responsible daily action.','Identify values that strengthen family and community life.','Use a scenario to explain forgiveness and reconciliation.','Describe how worship practices shape conduct and community.','Plan a simple act of service and explain its impact.','Compare responsible and irresponsible leadership choices.','Use values to respond to peer pressure.','Choose practical ways to care for people who need support.'],
      'stewardship, values, forgiveness, worship, service, leadership, choice, care'
    ),
    (
      'english',
      'languages',
      'text_reference',
      ARRAY['Oral narratives','Vocabulary in context','Inference','Parts of speech','Punctuation','Functional writing','Creative writing','Editing workshop'],
      ARRAY['Listening to and retelling oral narratives','Using vocabulary in context','Making inferences and predictions','Parts of speech in meaningful sentences','Punctuation and paragraph flow','Functional writing for real purposes','Creative writing with clear detail','Reviewing and editing written work'],
      ARRAY['Retell a narrative with sequence, characters, and message.','Use context clues to explain unfamiliar words.','Make an inference or prediction using evidence from a text.','Identify word classes and use them in stronger sentences.','Revise punctuation so a paragraph reads clearly.','Write a useful message, notice, letter, or instruction.','Add sensory detail and structure to a short creative piece.','Use an editing checklist to improve clarity and correctness.'],
      'narrative, context, inference, noun, verb, punctuation, purpose, edit'
    ),
    (
      'french',
      'languages',
      'text_reference',
      ARRAY['Numbers and age','Time words','Classroom instructions','Family vocabulary','Food preferences','Questions','Reading passage','Written profile'],
      ARRAY['French numbers and age','Days, months, and time in French','Following classroom instructions in French','Family vocabulary in French','Food and preferences in French','Asking and answering simple French questions','Reading a short French passage','Writing a short personal profile in French'],
      ARRAY['Use numbers to state age or count familiar objects.','Use time words to talk about routines.','Respond to simple classroom instructions.','Describe family members using familiar vocabulary.','State simple food preferences politely.','Ask and answer short questions with a partner.','Read a short passage and identify main idea and details.','Write a short profile with name, age, and familiar details.'],
      'number, age, day, instruction, family, food, question, profile'
    ),
    (
      'german',
      'languages',
      'text_reference',
      ARRAY['Numbers and age','Time words','Classroom instructions','Family vocabulary','Food preferences','Questions','Reading passage','Written profile'],
      ARRAY['German numbers and age','Days, months, and time in German','Following classroom instructions in German','Family vocabulary in German','Food and preferences in German','Asking and answering simple German questions','Reading a short German passage','Writing a short personal profile in German'],
      ARRAY['Use numbers to state age or count familiar objects.','Use time words to talk about routines.','Respond to simple classroom instructions.','Describe family members using familiar vocabulary.','State simple food preferences politely.','Ask and answer short questions with a partner.','Read a short passage and identify main idea and details.','Write a short profile with name, age, and familiar details.'],
      'number, age, day, instruction, family, food, question, profile'
    ),
    (
      'hre',
      'humanities',
      'text_reference',
      ARRAY['Respect and duty','Sacred texts','Worship and community','Compassion','Moral courage','Conflict resolution','Friendship','Daily values'],
      ARRAY['Respect and duty in daily life','Reading sacred texts for meaning','Worship and community life','Compassion and service','Moral courage in difficult moments','Resolving conflict respectfully','Responsible friendship','Applying values to daily life'],
      ARRAY['Explain how respect and duty guide behaviour.','Identify the message and application of a short sacred text.','Describe how worship connects people to community.','Plan a compassionate action in school or home.','Choose a morally courageous response in a scenario.','Use a peaceful process to resolve conflict.','Describe qualities of a responsible friend.','Apply a value to a real daily decision.'],
      'respect, duty, text, worship, compassion, courage, conflict, friendship'
    ),
    (
      'indigenous-language',
      'languages',
      'text_reference',
      ARRAY['Context greetings','People and places','Community vocabulary','Proverbs','Story structure','Respectful listening','Translation','Language records'],
      ARRAY['Greetings for different contexts','Naming people and places respectfully','Home and community vocabulary','Proverbs and their meanings','Structure of an oral story','Respectful listening in oral language','Translating simple ideas carefully','Preserving local language records'],
      ARRAY['Choose an appropriate greeting for a familiar context.','Use names of people and places with respect.','Group vocabulary by home, school, and community use.','Explain the meaning and lesson of a proverb.','Retell a story with setting, events, and message.','Show listening habits that support oral language learning.','Translate a simple idea while preserving meaning.','Create a respectful record with word, meaning, and context.'],
      'greeting, place, community, proverb, story, listening, translation, record'
    ),
    (
      'integrated-science',
      'science',
      'diagram',
      ARRAY['Measurement','Classification','Human body','Ecosystems','Matter','Force and motion','Energy transfer','Health investigation'],
      ARRAY['Scientific measurement and recording','Classifying living things','Human body systems and health','Ecosystems and interdependence','States and properties of matter','Force and motion in daily life','Energy transfer and responsible use','Health and sanitation investigation'],
      ARRAY['Measure, record, and compare observations accurately.','Classify living things using observable features.','Explain how body systems support health.','Trace relationships in a simple ecosystem.','Classify materials by state and property.','Use examples to explain force and motion.','Identify energy transfers and safe energy choices.','Investigate a sanitation problem and propose a solution.'],
      'measure, classify, body, ecosystem, matter, force, energy, health'
    ),
    (
      'ire',
      'humanities',
      'text_reference',
      ARRAY['Respect and duty','Sacred texts','Worship and community','Compassion','Moral courage','Conflict resolution','Friendship','Daily values'],
      ARRAY['Respect and duty in daily life','Reading sacred texts for meaning','Worship and community life','Compassion and service','Moral courage in difficult moments','Resolving conflict respectfully','Responsible friendship','Applying values to daily life'],
      ARRAY['Explain how respect and duty guide behaviour.','Identify the message and application of a short sacred text.','Describe how worship connects people to community.','Plan a compassionate action in school or home.','Choose a morally courageous response in a scenario.','Use a peaceful process to resolve conflict.','Describe qualities of a responsible friend.','Apply a value to a real daily decision.'],
      'respect, duty, text, worship, compassion, courage, conflict, friendship'
    ),
    (
      'kiswahili',
      'languages',
      'text_reference',
      ARRAY['Ufahamu wa kusikiliza','Msamiati','Methali na semi','Aina za maneno','Uakifishaji','Insha fupi','Mazungumzo','Kusahihisha'],
      ARRAY['Ufahamu wa kusikiliza','Msamiati katika muktadha','Methali na semi katika mawasiliano','Aina za maneno katika sentensi','Alama za uakifishaji','Kuandika insha fupi','Mazungumzo ya heshima','Kusahihisha kazi ya uandishi'],
      ARRAY['Tambua ujumbe mkuu na hoja muhimu baada ya kusikiliza.','Eleza maana ya neno kutokana na muktadha.','Tumia methali au semi kueleza wazo kwa heshima.','Tambua aina za maneno na uyatumie katika sentensi.','Tumia alama za uakifishaji kuboresha usomaji.','Panga na andika insha fupi yenye mtiririko.','Shiriki mazungumzo kwa zamu na lugha ya heshima.','Sahihisha kazi kwa kuangalia maana, sarufi, na alama.'],
      'ufahamu, msamiati, methali, nomino, kitenzi, alama, insha, sahihisha'
    ),
    (
      'mandarin',
      'languages',
      'text_reference',
      ARRAY['Numbers and age','Family members','School objects','Tone practice','Simple questions','Common verbs','Supported reading','Useful characters'],
      ARRAY['Mandarin numbers and age','Family members in Mandarin','School objects in Mandarin','Tone practice for clear meaning','Asking simple Mandarin questions','Common verbs in short sentences','Reading a supported Mandarin text','Recognizing and writing useful characters'],
      ARRAY['Use numbers to state age or count familiar objects.','Name family members using familiar words.','Identify school objects and use them in phrases.','Practise tones and explain why tone changes meaning.','Ask and answer short questions.','Use common verbs in meaningful sentences.','Read a short supported text and identify details.','Recognize useful characters and write or trace them carefully.'],
      'number, family, school, tone, question, verb, reading, character'
    ),
    (
      'mathematics',
      'mathematics',
      'formula',
      ARRAY['Fractions and decimals','Ratio and proportion','Integers','Algebraic expressions','Angles and polygons','Measurement','Data displays','Probability'],
      ARRAY['Fractions and decimals in real situations','Ratio and proportion reasoning','Integers and directed numbers','Building algebraic expressions','Angles and polygons','Perimeter, area, and volume','Reading and drawing data displays','Probability and real-life decisions'],
      ARRAY['Represent and compare fractions or decimals in context.','Use ratio or proportion to solve a practical problem.','Place integers on a number line and compare values.','Write an expression from words and evaluate it.','Classify angles or polygons and justify the choice.','Choose and use the correct measurement formula.','Interpret a chart or table and support a conclusion.','Describe likelihood and use probability language responsibly.'],
      'fraction, decimal, ratio, integer, algebra, angle, area, data, probability'
    ),
    (
      'pre-technical-studies',
      'technical',
      'workflow',
      ARRAY['Design cycle','Workshop safety','Measuring and marking','Joining materials','Mechanisms','Structures','Electrical safety','Prototype documentation'],
      ARRAY['Using the design cycle','Workshop safety and risk control','Measuring and marking accurately','Joining materials for strength','Simple mechanisms and movement','Structures and stability','Basic electrical safety','Documenting prototype tests'],
      ARRAY['Use design steps to move from need to tested solution.','Identify hazards and choose safety controls.','Measure, mark, and check accuracy before making.','Choose a joining method and explain its strength.','Explain how a simple mechanism changes movement.','Test a structure and identify what makes it stable.','Explain safe habits around simple electrical components.','Record prototype test results and improvement decisions.'],
      'design, safety, measure, join, mechanism, structure, electrical, prototype'
    ),
    (
      'science-and-technology',
      'science',
      'diagram',
      ARRAY['Measurement','Classification','Human health','Environment','Matter','Force and motion','Energy and machines','Local technology'],
      ARRAY['Scientific measurement and recording','Classifying living things and objects','Human body and healthy habits','Environment and conservation','Matter and materials','Force and motion in daily life','Energy and simple machines','Using technology to solve local problems'],
      ARRAY['Measure, record, and compare observations accurately.','Classify things using observable features.','Connect body care habits to health outcomes.','Explain a conservation choice for a local environment.','Classify materials by state and property.','Use examples to explain force and motion.','Identify energy transfers in simple machines.','Choose a technology solution for a local problem.'],
      'measure, classify, body, environment, matter, force, energy, technology'
    ),
    (
      'social-studies',
      'humanities',
      'map',
      ARRAY['Physical features','Climate','Culture and heritage','Economic activities','Transport','Governance','Rights','Peace'],
      ARRAY['Physical features and map reading','Climate and environment','Culture and heritage in communities','Economic activities and livelihoods','Transport and communication systems','Leadership and governance','Rights and responsibilities','Peace and conflict resolution'],
      ARRAY['Use map evidence to describe physical features.','Connect climate to environment and daily life.','Explain how culture and heritage shape identity.','Compare economic activities and their community value.','Describe how transport or communication supports society.','Explain leadership roles and fair decision making.','Balance rights with responsibilities in a scenario.','Use peaceful steps to respond to conflict.'],
      'map, climate, culture, economy, transport, governance, rights, peace'
    )
)
INSERT INTO cbc_ai_expansion_seed (
  subject_slug,
  discipline_type,
  visual_kind,
  lesson_order,
  strand,
  sub_strand,
  title,
  focus_task,
  vocabulary
)
SELECT
  se.subject_slug,
  se.discipline_type,
  se.visual_kind,
  x.ordinality::int + 4,
  x.strand,
  x.title,
  x.title,
  x.focus_task,
  se.vocabulary
FROM subject_expansions se
CROSS JOIN LATERAL unnest(se.strands, se.titles, se.focus_tasks)
  WITH ORDINALITY AS x(strand, title, focus_task, ordinality);

UPDATE public.courses c
SET
  target_lesson_count = 12,
  lesson_generation_mode = 'mixed',
  curriculum_metadata = COALESCE(c.curriculum_metadata, '{}'::jsonb) || jsonb_build_object(
    'ai_expansion_seed_version', 'cbc_ai_expansion_v2',
    'ai_lessons_per_course_target', 12,
    'ai_expansion_lessons_added_per_course', 8,
    'rights_rule', 'AI expansion lessons are original KingPin-authored teaching content and do not reproduce textbook text.',
    'teacher_review_required_for_full_syllabus', true
  ),
  updated_at = now()
WHERE c.country = 'Kenya'
  AND c.curriculum_family = 'CBC'
  AND c.grade BETWEEN 6 AND 9
  AND c.curriculum_subject_slug IN (SELECT DISTINCT subject_slug FROM cbc_ai_expansion_seed);

INSERT INTO public.course_materials (
  institution_id,
  course_id,
  title,
  type,
  extracted_text,
  syllabus_reference,
  processing_status,
  material_role,
  material_rights_status,
  rights_notes,
  curriculum_metadata,
  created_at,
  updated_at
)
SELECT
  c.institution_id,
  c.id,
  'KingPin CBC AI expansion outline',
  'text',
  'Original AI expansion outline for ' || c.title || E'.\n\n' ||
    string_agg(
      'Lesson ' || s.lesson_order || ': ' || s.title || E'\n' ||
      'Focus task: ' || s.focus_task,
      E'\n\n'
      ORDER BY s.lesson_order
    ),
  'KingPin CBC AI expansion pathway',
  'ready',
  'other',
  'licensed',
  'Original KingPin-authored AI lesson expansion. It does not contain copied textbook passages.',
  jsonb_build_object(
    'seedKey', 'cbc_ai_expansion_outline_v2',
    'country', 'Kenya',
    'curriculumFamily', 'CBC',
    'grade', c.grade,
    'subject', c.curriculum_subject,
    'lessonOrders', jsonb_build_array(5, 6, 7, 8, 9, 10, 11, 12),
    'rightsRule', 'Use as original AI teaching context; upload licensed or institution-provided materials for exact book coverage.'
  ),
  now(),
  now()
FROM public.courses c
JOIN cbc_ai_expansion_seed s ON s.subject_slug = c.curriculum_subject_slug
WHERE c.country = 'Kenya'
  AND c.curriculum_family = 'CBC'
  AND c.grade BETWEEN 6 AND 9
  AND NOT EXISTS (
    SELECT 1
    FROM public.course_materials existing
    WHERE existing.course_id = c.id
      AND existing.curriculum_metadata->>'seedKey' = 'cbc_ai_expansion_outline_v2'
  )
GROUP BY c.id, c.institution_id, c.title, c.grade, c.curriculum_subject;

WITH lesson_seed AS (
  SELECT
    c.id AS course_id,
    c.institution_id,
    c.programme_id,
    c.title AS course_title,
    c.subject,
    c.level,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.*,
    'cbc_ai_expansion_v2_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order AS seed_key
  FROM public.courses c
  JOIN cbc_ai_expansion_seed s ON s.subject_slug = c.curriculum_subject_slug
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
)
INSERT INTO public.lessons (
  institution_id,
  course_id,
  programme_id,
  title,
  description,
  difficulty,
  duration_minutes,
  order_index,
  objective,
  syllabus_reference,
  minimum_duration_minutes,
  estimated_duration_minutes,
  generation_mode,
  status,
  lesson_data_json,
  accessibility_data_json,
  created_at,
  updated_at
)
SELECT
  ls.institution_id,
  ls.course_id,
  ls.programme_id,
  'Lesson ' || ls.lesson_order || ': ' || ls.title,
  'Original KingPin AI expansion lesson for ' || ls.curriculum_subject || '. Teachers should review and extend it with licensed or institution-provided materials for full syllabus depth.',
  'beginner',
  40,
  ls.lesson_order - 1,
  'Apply ' || lower(ls.title) || ' through explanation, guided practice, and independent work.',
  'KingPin CBC AI expansion pathway: ' || ls.strand,
  25,
  40,
  'mixed',
  'published',
  jsonb_build_object(
    'seedKey', ls.seed_key,
    'seedVersion', 'cbc_ai_expansion_v2',
    'seedRevision', 'cbc_ai_expansion_v2',
    'disciplineType', ls.discipline_type,
    'toolingContext', null,
    'generatedFor', 'long_form_adaptive_ai_teacher',
    'curriculum', jsonb_build_object(
      'country', 'Kenya',
      'curriculumFamily', 'CBC',
      'grade', ls.grade,
      'subject', ls.curriculum_subject,
      'subjectSlug', ls.curriculum_subject_slug,
      'strand', ls.strand,
      'subStrand', ls.sub_strand,
      'syllabusReference', 'KingPin CBC AI expansion pathway',
      'rightsRule', 'Original AI expansion lesson; no textbook text reproduced.'
    ),
    'pacingPlan', jsonb_build_object(
      'minimumDurationMinutes', 25,
      'targetDurationMinutes', 40,
      'maximumDurationMinutes', 40,
      'extensionStrategies', jsonb_build_array(
        'Use a local learner example if the class is moving quickly.',
        'Ask one learner to explain the idea before independent practice.',
        'Reteach with the visual organizer when learners miss the checkpoint.',
        'Keep the exit reflection short so the class stays inside 40 minutes.'
      )
    ),
    'qualityFloor', jsonb_build_object(
      'minimumSections', 11,
      'minimumTeachingItems', 12,
      'durationBandMinutes', jsonb_build_object('min', 25, 'max', 40),
      'teacherReviewNote', 'AI expansion lesson is original starter teaching content and should be extended with licensed materials for full syllabus depth.'
    ),
    'visualPlan', jsonb_build_array(
      jsonb_build_object(
        'id', ls.seed_key || '_visual_1',
        'kind', ls.visual_kind,
        'source', 'fallback',
        'title', ls.title || ' organizer',
        'description', 'Teacher-created organizer for ' || ls.title,
        'alt', 'Visual organizer for ' || ls.title,
        'teacherCue', 'Point to the organizer while connecting the focus task, example, and learner practice.',
        'labels', jsonb_build_array(ls.strand, ls.sub_strand, ls.vocabulary)
      )
    ),
    'guidedQuestions', jsonb_build_array(
      jsonb_build_object(
        'question', 'What is the strongest first step for this lesson focus?',
        'options', jsonb_build_array('Name the idea and connect it to evidence.', 'Copy words without explaining them.', 'Skip the example.', 'Guess without checking.'),
        'correct', 'Name the idea and connect it to evidence.',
        'explanation', 'A strong answer starts with the idea, applies it to the task, and supports it with evidence.'
      )
    ),
    'practiceCycles', jsonb_build_array(
      jsonb_build_object(
        'id', ls.seed_key || '_practice_cycle',
        'topic', ls.title,
        'difficulty', 'beginner',
        'problems', jsonb_build_array(
          jsonb_build_object(
            'equation', 'Practice',
            'question', ls.focus_task,
            'correctAnswer', 'A complete answer uses lesson vocabulary, explains the choice, and gives evidence or an example.',
            'hint', 'Start by naming the key idea.',
            'hints', jsonb_build_array('Name the key idea.', 'Connect it to the focus task.', 'Support your answer with evidence.'),
            'misconception', jsonb_build_object('answer', 'A short unsupported answer.', 'note', 'Explain the reason, not only the final word.')
          )
        )
      )
    )
  ),
  jsonb_build_object(
    'readingSupport', true,
    'captionsRecommended', true,
    'localExamplesEncouraged', true
  ),
  now(),
  now()
FROM lesson_seed ls
WHERE NOT EXISTS (
  SELECT 1
  FROM public.lessons existing
  WHERE existing.course_id = ls.course_id
    AND existing.lesson_data_json->>'seedKey' = ls.seed_key
);

WITH seeded_lessons AS (
  SELECT
    l.id AS lesson_id,
    l.course_id,
    l.institution_id,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.*
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  JOIN cbc_ai_expansion_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_ai_expansion_v2_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
),
section_seed(order_index, type, title, estimated_minutes) AS (
  VALUES
    (0, 'welcome', 'Welcome and learning focus', 3),
    (1, 'objective', 'What success looks like', 3),
    (2, 'why_it_matters', 'Why this matters', 3),
    (3, 'prerequisite_check', 'Check what we already know', 3),
    (4, 'concept', 'Key concept', 7),
    (5, 'worked_example', 'Worked example', 6),
    (6, 'question_checkpoint', 'Check for understanding', 3),
    (7, 'guided_practice', 'Guided practice', 5),
    (8, 'independent_practice', 'Independent practice', 4),
    (9, 'summary', 'Summary', 2),
    (10, 'exit_reflection', 'Exit reflection and homework', 1)
)
INSERT INTO public.lesson_sections (
  institution_id,
  course_id,
  lesson_id,
  title,
  type,
  order_index,
  estimated_minutes,
  created_at,
  updated_at
)
SELECT
  sl.institution_id,
  sl.course_id,
  sl.lesson_id,
  ss.title,
  ss.type,
  ss.order_index,
  ss.estimated_minutes,
  now(),
  now()
FROM seeded_lessons sl
CROSS JOIN section_seed ss
WHERE NOT EXISTS (
  SELECT 1
  FROM public.lesson_sections existing
  WHERE existing.lesson_id = sl.lesson_id
    AND existing.order_index = ss.order_index
    AND existing.type = ss.type
);

WITH seeded_lessons AS (
  SELECT
    l.id AS lesson_id,
    l.course_id,
    l.institution_id,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.*
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  JOIN cbc_ai_expansion_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_ai_expansion_v2_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
),
item_seed(lesson_id, section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake, seconds) AS (
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
  FROM seeded_lessons sl
  CROSS JOIN LATERAL (
    VALUES
      ('welcome', 0, 'heading', 'Today: ' || sl.title, 'Welcome to ' || sl.title || ' in Grade ' || sl.grade || ' ' || sl.curriculum_subject || '.', 'We will connect the idea to a familiar situation, study one worked example, practise together, then try a short independent task.', 'Lesson focus: ' || sl.title || '.', 'Board heading showing the lesson title.', 'A clear opening helps learners understand the purpose of the class.', null, 60),
      ('objective', 0, 'concept', 'Goal: apply ' || lower(sl.title), 'By the end, you should apply ' || lower(sl.title) || ' with a clear reason.', 'Success means the learner can explain the idea, use it in the focus task, and support the answer with evidence or an example.', 'Goal: explain, apply, and justify ' || lower(sl.title) || '.', 'Lesson objective displayed on the board.', 'The objective makes success visible.', 'Do not copy the goal without knowing what action it requires.', 60),
      ('why_it_matters', 0, 'bullet', 'Why it matters: useful in school, home, or community', 'This matters because it helps us make better decisions in familiar situations.', 'The teacher should choose one local example and connect it directly to the lesson idea without turning the example into a long discussion.', 'Why it matters: connect the idea to a real situation.', 'Short relevance statement on the board.', 'CBC learning should connect knowledge, skills, values, and real life.', null, 60),
      ('prerequisite_check', 0, 'question', 'Before we begin: what do you already know?', 'Name one word, example, or question you already have about this topic.', 'This low-pressure entry point helps learners activate prior knowledge and lets the teacher decide where to slow down.', 'Starter response: word, example, or question.', 'Prerequisite question for learners.', 'Prior knowledge makes new learning easier to remember.', 'Being unsure is allowed; a question is useful evidence.', 60),
      ('concept', 0, 'concept', 'Key idea: ' || sl.title, 'The key idea is ' || sl.title || '.', 'Unpack the title into the main term, meaning, example, and evidence. Keep the explanation short, then ask learners to restate it.', 'Key idea: term, meaning, example, evidence.', 'Main concept written on the board.', 'The concept is the anchor for the example and practice.', 'Do not rush to the task before naming the idea.', 90),
      ('concept', 1, 'bullet', 'Vocabulary: ' || sl.vocabulary, 'The useful vocabulary today is: ' || sl.vocabulary || '.', 'These words help learners give precise answers. The teacher should model at least two words in complete sentences.', 'Vocabulary: ' || sl.vocabulary, 'Vocabulary list for the lesson.', 'Vocabulary turns vague thinking into clear communication.', 'Using a word without explaining it can hide weak understanding.', 60),
      ('worked_example', 0, 'instruction', 'Worked example: ' || sl.focus_task, 'Watch how we handle this focus task: ' || sl.focus_task, 'Model the reasoning path: notice the situation, choose the useful idea, explain the reason, then check whether the answer is complete.', 'Worked example path: notice, choose, explain, check.', 'Worked example prompt on the board.', 'A worked example shows the thinking process before independent work.', 'Do not only copy the final answer; copy the reasoning path.', 90),
      ('question_checkpoint', 0, 'question', 'Checkpoint: can you explain and justify?', 'Pause and explain the idea in your own words, then give one reason or example.', 'This checkpoint catches confusion before practice. If many learners cannot justify, reteach with the visual organizer.', 'Checkpoint: explain, apply, justify.', 'Checkpoint question for understanding.', 'Short checks prevent confusion from building up.', 'Saying I know it is not enough; show it with a reason.', 60),
      ('guided_practice', 0, 'instruction', 'Guided task: first step together, next step learner-led', 'We will do the first step together. Then you will suggest the next step.', 'The teacher models the first move, invites learner suggestions, corrects gently, and completes the response using lesson vocabulary.', 'Guided practice: teacher models, learner suggests, class corrects.', 'Guided practice support sequence on the board.', 'Guided practice transfers thinking from teacher to learner.', 'Do not turn guided practice into another lecture.', 75),
      ('independent_practice', 0, 'question', 'Your turn: ' || sl.focus_task, sl.focus_task, 'A complete answer should name the idea, apply it to the task, and give evidence or an example. The teacher should listen for vocabulary and reasoning.', 'Independent task: complete, clear, evidence-based.', 'Independent practice task on the board.', 'Independent practice shows whether the learner can transfer the idea.', 'A short answer without evidence is not yet complete.', 75),
      ('summary', 0, 'bullet', 'Summary: key idea, example, practice, correction', 'Summarize the key idea, one example, one practice step, and one correction to remember.', 'This gives learners a revision record that is more useful than copied board text alone.', 'Notebook finish: idea, example, correction, next step.', 'Summary checklist on the board.', 'A structured summary turns activity into remembered learning.', 'Do not leave without writing one correction or next step.', 60),
      ('exit_reflection', 0, 'question', 'Exit: what should we review next?', 'Choose what we should review next: vocabulary, example, guided task, or independent task.', 'The exit reflection helps the teacher decide whether to reteach, extend, or move forward in the next lesson.', 'Exit reflection: choose the part that needs review.', 'Exit reflection question on the board.', 'Reflection helps the next lesson start at the right place.', null, 45)
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
  sec.id,
  item.order_index,
  item.item_type,
  item.board_text,
  item.exact_spoken_text,
  item.teacher_explanation,
  item.learner_notes,
  item.accessible_description,
  item.why_this_matters,
  item.common_mistake,
  'normal',
  item.seconds,
  now(),
  now()
FROM seeded_lessons sl
JOIN public.lesson_sections sec ON sec.lesson_id = sl.lesson_id
JOIN item_seed item ON item.lesson_id = sl.lesson_id AND item.section_type = sec.type
WHERE NOT EXISTS (
  SELECT 1
  FROM public.teaching_items existing
  WHERE existing.lesson_id = sl.lesson_id
    AND existing.section_id = sec.id
    AND existing.order_index = item.order_index
    AND existing.board_text = item.board_text
);

WITH seeded_lessons AS (
  SELECT
    l.id AS lesson_id,
    l.course_id,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.lesson_order,
    s.strand,
    s.sub_strand,
    s.title
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  JOIN cbc_ai_expansion_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_ai_expansion_v2_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
)
INSERT INTO public.curriculum_scope_mappings (
  country,
  curriculum_family,
  grade,
  subject,
  subject_slug,
  curriculum_code,
  strand,
  sub_strand,
  syllabus_reference,
  expected_material_role,
  course_id,
  lesson_id,
  coverage_status,
  source_notes,
  created_at,
  updated_at
)
SELECT
  'Kenya',
  'CBC',
  sl.grade,
  sl.curriculum_subject,
  sl.curriculum_subject_slug,
  'KP-CBC-AI-G' || sl.grade || '-' || sl.curriculum_subject_slug || '-L' || sl.lesson_order,
  sl.strand,
  sl.sub_strand,
  'KingPin CBC AI expansion lesson ' || sl.lesson_order,
  'other',
  sl.course_id,
  sl.lesson_id,
  'published',
  'Original AI expansion mapping. Replace or extend with exact licensed syllabus scope when materials are uploaded.',
  now(),
  now()
FROM seeded_lessons sl
ON CONFLICT (
  country,
  curriculum_family,
  grade,
  subject_slug,
  COALESCE(curriculum_code, ''),
  COALESCE(strand, ''),
  COALESCE(sub_strand, ''),
  COALESCE(syllabus_reference, '')
)
DO UPDATE SET
  course_id = EXCLUDED.course_id,
  lesson_id = EXCLUDED.lesson_id,
  coverage_status = EXCLUDED.coverage_status,
  source_notes = EXCLUDED.source_notes,
  updated_at = now();
