-- Make the KingPin Kenyan CBC course shells teachable.
--
-- This migration seeds original, KingPin-authored starter lessons for every
-- Grade 6-9 CBC subject shell. It does not copy textbook text. Licensed or
-- institution-provided materials can still be uploaded later to deepen and
-- replace these starter pathways.

CREATE TEMP TABLE cbc_starter_lesson_seed (
  subject_slug text NOT NULL,
  discipline_type text NOT NULL,
  lesson_order int NOT NULL,
  strand text NOT NULL,
  sub_strand text NOT NULL,
  title text NOT NULL,
  objective text NOT NULL,
  key_concept text NOT NULL,
  worked_example text NOT NULL,
  guided_task text NOT NULL,
  independent_task text NOT NULL,
  vocabulary text NOT NULL,
  visual_kind text NOT NULL
) ON COMMIT DROP;

INSERT INTO cbc_starter_lesson_seed (
  subject_slug, discipline_type, lesson_order, strand, sub_strand, title,
  objective, key_concept, worked_example, guided_task, independent_task,
  vocabulary, visual_kind
)
VALUES
  ('agriculture','technical',1,'Food production and environment','Observing farm systems','Agriculture in everyday life','Explain how agriculture supports homes, schools, communities, and local markets.','Agriculture connects soil, water, plants, animals, tools, labour, and decisions into one production system.','Compare a small kitchen garden, a school garden, and a poultry unit, then identify the resources each one needs.','Draw a simple farm system map showing inputs, activities, outputs, and care points.','Plan one improvement that would make a school garden healthier or more productive.','soil, crop, livestock, input, output, conservation','workflow'),
  ('agriculture','technical',2,'Plant production','Healthy crop growth','What plants need to grow well','Identify the conditions plants need and explain how a farmer supports healthy growth.','Crops grow best when soil, water, light, spacing, nutrients, and protection are managed together.','Study two crop beds: one crowded and dry, one well-spaced and watered, then predict which performs better.','Use a checklist to inspect a sample crop bed and recommend two improvements.','Create a seven-day crop care routine for watering, checking pests, and observing growth.','germination, spacing, nutrients, mulch, pests','diagram'),
  ('agriculture','technical',3,'Animal production','Care and welfare','Responsible care for domestic animals','Describe basic care practices that keep domestic animals healthy, safe, and productive.','Good animal care combines clean shelter, feed, water, health observation, and gentle handling.','Compare daily care needs for poultry, rabbits, goats, or dairy animals and identify what changes with each animal.','Build a daily animal-care checklist for feeding, water, cleaning, and health signs.','Explain what a learner should do if an animal refuses food or appears weak.','feed, shelter, hygiene, welfare, disease signs','diagram'),
  ('agriculture','technical',4,'Conservation and enterprise','Sustainable decisions','Making agriculture sustainable','Use evidence to choose agricultural practices that protect resources and improve productivity.','Sustainable agriculture balances production with soil care, water care, waste reduction, and income planning.','Evaluate two practices: burning crop waste and composting crop waste, then compare their long-term effects.','Classify farm practices as helpful, risky, or needs improvement, giving a reason for each choice.','Design a simple school agriculture project with a purpose, resources, risks, and expected benefits.','compost, erosion, sustainability, enterprise, risk','workflow'),

  ('arabic','languages',1,'Language foundations','Sounds and greetings','Arabic sounds and respectful greetings','Recognize common Arabic sounds and use simple greetings respectfully.','Language learning begins with listening carefully, matching sounds to symbols, and using greetings in the right context.','Listen to a greeting exchange, identify the greeting and response, then explain when it is appropriate.','Practise a greeting-response chain using teacher modelling and peer repetition.','Write a short greeting dialogue for meeting a teacher, friend, or visitor.','sound, greeting, response, context, pronunciation','text_reference'),
  ('arabic','languages',2,'Reading readiness','Letters and word patterns','Connecting letters to words','Use letter recognition and sound patterns to read simple Arabic words.','Letters change meaning when they combine with sounds, position, and repeated patterns.','Break a simple word into letters and sounds, then rebuild it aloud.','Sort sample words by first sound and identify the repeated pattern.','Create a word card with the word, pronunciation support, and meaning.','letter, sound, word, pattern, meaning','table'),
  ('arabic','languages',3,'Communication','Simple classroom sentences','Building useful Arabic sentences','Build short classroom sentences using familiar vocabulary and polite forms.','A sentence becomes useful when the speaker chooses the right word order, tone, and context.','Transform a word list into a simple sentence such as asking for help or naming an object.','Use a sentence frame to ask and answer three classroom questions.','Record three useful Arabic sentences for classroom routines.','sentence, question, answer, polite form, classroom','text_reference'),
  ('arabic','languages',4,'Reading and culture','Short text comprehension','Understanding a short Arabic text','Read a short original passage and identify its main idea, details, and cultural context.','Comprehension means locating the main idea, supporting details, and the situation around the text.','Read a short greeting card message and identify who wrote it, who receives it, and why.','Mark the main idea and two details in a teacher-provided passage.','Write two comprehension questions for a new short Arabic passage.','main idea, detail, culture, message, purpose','text_reference'),

  ('creative-arts','general',1,'Creating and responding','Elements of art','Using line, shape, colour, sound, and movement','Identify creative elements and explain how artists use them to communicate ideas.','Creative work uses elements such as line, shape, colour, rhythm, space, movement, and pattern to create meaning.','Compare two artworks or performances and name the element that stands out most in each.','Create a small study using two elements and explain the choice.','Reflect on how changing one element changes the message of the piece.','line, shape, colour, rhythm, movement, pattern','illustration'),
  ('creative-arts','general',2,'Skills and technique','Practice with control','Developing technique through practice','Use repeated practice to improve control, accuracy, expression, and confidence.','Technique improves when the learner isolates a skill, repeats it carefully, observes the result, and adjusts.','Watch a teacher demonstrate a simple pattern, then identify the starting point, repeated action, and finish.','Practise the pattern slowly, then improve it using peer or teacher feedback.','Create a practice log naming one skill, one strength, and one target for improvement.','technique, control, pattern, expression, feedback','workflow'),
  ('creative-arts','general',3,'Composition','Planning a creative piece','Planning before making','Plan a creative piece by choosing purpose, audience, materials, and structure.','Planning helps creative choices become intentional rather than random.','Analyse a sample plan: theme, materials, steps, and expected audience response.','Complete a planning grid for a drawing, song, poem, dance, or craft item.','Produce a rough draft or rehearsal based on the plan.','composition, audience, material, draft, structure','table'),
  ('creative-arts','general',4,'Presentation and critique','Sharing creative work','Presenting and improving creative work','Present creative work respectfully and use feedback to improve it.','Critique is useful when it is specific, respectful, evidence-based, and connected to the goal of the work.','Compare vague feedback with specific feedback and decide which one helps the artist more.','Use two stars and one wish to respond to a peer performance or artwork.','Revise one part of a creative piece using feedback.','critique, revise, evidence, audience, presentation','workflow'),

  ('cre','humanities',1,'Beliefs and values','Respect and responsibility','Learning values through stories and choices','Identify values in a faith or moral story and connect them to daily decisions.','Values are shown through choices, relationships, service, honesty, respect, and responsibility.','Read an original moral scenario and identify the value shown by each character.','Discuss what a respectful response would look like in a school conflict.','Write one action plan for showing responsibility at home or school.','values, respect, responsibility, service, choice','text_reference'),
  ('cre','humanities',2,'Scripture and meaning','Reading for message','Finding the message in a religious text','Identify the main message, context, and application of a short religious text.','A text is understood better when learners ask who is speaking, what is happening, and what lesson is being taught.','Use a short teacher-provided passage and identify the message, audience, and action expected.','Complete a message-detail-application chart.','Explain how the message could guide a real decision this week.','message, context, application, scripture, audience','text_reference'),
  ('cre','humanities',3,'Community and worship','Practices and service','Faith in community life','Explain how worship, service, and community practices shape responsible living.','Community practices help people remember beliefs, support each other, and serve those in need.','Compare two community actions: prayer gathering and charity visit, then identify their purpose.','Plan a respectful service activity with roles and expected impact.','Reflect on one way young people can contribute positively to the community.','worship, community, service, charity, responsibility','workflow'),
  ('cre','humanities',4,'Moral decision making','Choosing wisely','Solving moral dilemmas','Use a step-by-step process to make a responsible moral decision.','A moral decision considers facts, values, possible effects, advice, and personal responsibility.','Work through a dilemma about honesty in a group project and evaluate possible choices.','Use the decision ladder: facts, values, options, effects, choice.','Write a short response explaining the best choice and why.','dilemma, consequence, honesty, advice, responsibility','workflow'),

  ('english','languages',1,'Listening and speaking','Clear communication','Speaking and listening with purpose','Use listening and speaking strategies to communicate clearly in class.','Good communication depends on purpose, audience, turn-taking, tone, and evidence from what was heard.','Listen to a short explanation and identify the speaker purpose and two key points.','Practise asking a clarifying question after a peer explanation.','Prepare a one-minute explanation using a clear beginning, middle, and end.','purpose, audience, tone, turn-taking, clarify','workflow'),
  ('english','languages',2,'Reading comprehension','Main idea and evidence','Reading for meaning','Identify the main idea, supporting details, and evidence in an original text.','Strong readers separate the central message from examples, opinions, and extra details.','Read a short paragraph and mark the main idea, two details, and one unfamiliar word.','Use a main idea chart to explain how details support the message.','Write a new title for the paragraph and justify it with evidence.','main idea, detail, evidence, inference, vocabulary','text_reference'),
  ('english','languages',3,'Grammar in use','Sentence building','Making stronger sentences','Build clear sentences using nouns, verbs, adjectives, punctuation, and sentence order.','Grammar helps ideas become clear, precise, and readable for the audience.','Improve a weak sentence by adding a precise verb, useful adjective, and correct punctuation.','Sort words into parts of speech, then build three meaningful sentences.','Revise a short paragraph to make the sentences clearer.','noun, verb, adjective, punctuation, sentence','table'),
  ('english','languages',4,'Writing process','Planning and revising','Writing a focused paragraph','Plan, draft, revise, and edit a paragraph for a specific purpose.','Good writing is a process: plan the idea, draft it, revise the meaning, then edit the surface.','Compare a first draft and a revised paragraph to identify what improved.','Use a paragraph frame: topic sentence, support, example, closing sentence.','Write and revise one paragraph on a familiar school or community topic.','draft, revise, edit, paragraph, topic sentence','workflow'),

  ('french','languages',1,'Language foundations','Greetings and introductions','French greetings and introductions','Use simple French greetings and introductions in familiar situations.','Useful communication begins with polite greetings, names, simple responses, and pronunciation practice.','Model a greeting dialogue and identify the greeting, name phrase, and response.','Practise greeting three classmates using a sentence frame.','Write a short self-introduction with name and one simple detail.','bonjour, salut, name, response, polite form','text_reference'),
  ('french','languages',2,'Vocabulary building','Classroom and home words','Using familiar French vocabulary','Recognize and use simple French words for classroom or home objects.','Vocabulary grows when learners connect words to objects, pictures, pronunciation, and repeated use.','Label classroom objects and group them by place or use.','Play a teacher-led pointing game: hear the word, find the object, say it back.','Create five vocabulary cards with word, meaning, and example.','vocabulary, object, label, pronunciation, meaning','table'),
  ('french','languages',3,'Sentence patterns','Questions and answers','Building short French sentences','Ask and answer simple questions using familiar sentence patterns.','Sentence frames help learners move from single words to meaningful communication.','Turn a word list into a short question and answer pair.','Practise three question-answer exchanges with a partner.','Write four short sentences about school, home, or family.','question, answer, sentence frame, partner, meaning','text_reference'),
  ('french','languages',4,'Reading and culture','Short text meaning','Understanding a simple French text','Read a short original French text and identify the main idea and key details.','Reading in another language requires clues from words, context, structure, and prior knowledge.','Read a simple classroom notice and identify who it is for and what action is needed.','Underline known words, circle new words, and infer meaning from context.','Write two comprehension answers in simple French or English as directed by the teacher.','main idea, detail, notice, context, infer','text_reference'),

  ('german','languages',1,'Language foundations','Greetings and introductions','German greetings and introductions','Use simple German greetings and introductions in familiar situations.','Useful communication begins with polite greetings, names, simple responses, and pronunciation practice.','Model a greeting dialogue and identify the greeting, name phrase, and response.','Practise greeting three classmates using a sentence frame.','Write a short self-introduction with name and one simple detail.','hallo, guten tag, name, response, polite form','text_reference'),
  ('german','languages',2,'Vocabulary building','Classroom and home words','Using familiar German vocabulary','Recognize and use simple German words for classroom or home objects.','Vocabulary grows when learners connect words to objects, pictures, pronunciation, and repeated use.','Label classroom objects and group them by place or use.','Play a teacher-led pointing game: hear the word, find the object, say it back.','Create five vocabulary cards with word, meaning, and example.','vocabulary, object, label, pronunciation, meaning','table'),
  ('german','languages',3,'Sentence patterns','Questions and answers','Building short German sentences','Ask and answer simple questions using familiar sentence patterns.','Sentence frames help learners move from single words to meaningful communication.','Turn a word list into a short question and answer pair.','Practise three question-answer exchanges with a partner.','Write four short sentences about school, home, or family.','question, answer, sentence frame, partner, meaning','text_reference'),
  ('german','languages',4,'Reading and culture','Short text meaning','Understanding a simple German text','Read a short original German text and identify the main idea and key details.','Reading in another language requires clues from words, context, structure, and prior knowledge.','Read a simple classroom notice and identify who it is for and what action is needed.','Underline known words, circle new words, and infer meaning from context.','Write two comprehension answers in simple German or English as directed by the teacher.','main idea, detail, notice, context, infer','text_reference'),

  ('hre','humanities',1,'Beliefs and values','Respect and responsibility','Learning values through stories and choices','Identify values in a faith or moral story and connect them to daily decisions.','Values are shown through choices, relationships, service, honesty, respect, and responsibility.','Read an original moral scenario and identify the value shown by each character.','Discuss what a respectful response would look like in a school conflict.','Write one action plan for showing responsibility at home or school.','values, respect, responsibility, service, choice','text_reference'),
  ('hre','humanities',2,'Scripture and meaning','Reading for message','Finding the message in a religious text','Identify the main message, context, and application of a short religious text.','A text is understood better when learners ask who is speaking, what is happening, and what lesson is being taught.','Use a short teacher-provided passage and identify the message, audience, and action expected.','Complete a message-detail-application chart.','Explain how the message could guide a real decision this week.','message, context, application, scripture, audience','text_reference'),
  ('hre','humanities',3,'Community and worship','Practices and service','Faith in community life','Explain how worship, service, and community practices shape responsible living.','Community practices help people remember beliefs, support each other, and serve those in need.','Compare two community actions: prayer gathering and charity visit, then identify their purpose.','Plan a respectful service activity with roles and expected impact.','Reflect on one way young people can contribute positively to the community.','worship, community, service, charity, responsibility','workflow'),
  ('hre','humanities',4,'Moral decision making','Choosing wisely','Solving moral dilemmas','Use a step-by-step process to make a responsible moral decision.','A moral decision considers facts, values, possible effects, advice, and personal responsibility.','Work through a dilemma about honesty in a group project and evaluate possible choices.','Use the decision ladder: facts, values, options, effects, choice.','Write a short response explaining the best choice and why.','dilemma, consequence, honesty, advice, responsibility','workflow'),

  ('indigenous-language','languages',1,'Oral language','Listening and speaking','Respectful oral communication','Use local language listening and speaking routines for greetings, stories, and classroom exchange.','Oral language carries meaning through words, tone, gesture, respect, and shared community context.','Listen to a short original oral exchange and identify greeting, speaker, listener, and purpose.','Practise a respectful greeting or response using teacher-approved local vocabulary.','Record a family-safe phrase or proverb with its meaning, after checking appropriateness.','oral language, greeting, tone, proverb, respect','text_reference'),
  ('indigenous-language','languages',2,'Vocabulary and meaning','Words in context','Building vocabulary from community life','Use familiar community vocabulary accurately in sentences and explanations.','Words become meaningful when learners connect them to people, places, activities, and values.','Group words by home, school, market, environment, or ceremony context.','Use selected words to create short spoken sentences.','Create a vocabulary card set with word, meaning, context, and respectful use note.','vocabulary, context, sentence, community, meaning','table'),
  ('indigenous-language','languages',3,'Stories and culture','Narrative structure','Learning from stories','Identify setting, characters, events, lesson, and cultural value in an original story.','Stories preserve memory, values, problem solving, humour, and identity across generations.','Break a short teacher-created story into beginning, problem, action, and lesson.','Retell the story in sequence using a visual story map.','Write or tell a short original story with one clear lesson.','setting, character, event, lesson, culture','workflow'),
  ('indigenous-language','languages',4,'Writing and preservation','Recording language respectfully','From speech to written record','Create a simple written or recorded text that preserves language respectfully and accurately.','Language preservation requires accuracy, consent, context, and respect for community knowledge.','Compare a bare word list with a contextual record that includes speaker, meaning, and situation.','Draft a short local-language record with translation and context note.','Revise the record after checking spelling, meaning, and respectful use.','record, translation, consent, context, preservation','text_reference'),

  ('integrated-science','science',1,'Scientific inquiry','Observation and evidence','Thinking like a scientist','Use observation, questioning, prediction, and evidence to investigate a simple science problem.','Science starts with careful observation, testable questions, fair comparisons, and evidence-based conclusions.','Compare two plant leaves or materials, then describe observations before making an explanation.','Write a testable question and prediction for a simple classroom investigation.','Design a fair test with one thing changed, one thing measured, and safety steps.','observation, evidence, prediction, fair test, conclusion','workflow'),
  ('integrated-science','science',2,'Living things and environment','Systems and interactions','Living things in their environment','Explain how living things depend on structures, functions, energy, and environmental conditions.','Living systems survive through interactions among organisms, body structures, food, water, air, and habitat.','Trace how a change in water, light, or food affects a living thing.','Build a cause-effect diagram for one organism and its environment.','Write a short explanation of how to protect one local habitat.','organism, habitat, structure, function, interaction','diagram'),
  ('integrated-science','science',3,'Matter and energy','Properties and change','Investigating materials and energy','Classify materials or energy changes using observable properties and safe investigation.','Materials and energy can be described by properties, changes, transfers, and uses in daily life.','Compare two materials by texture, strength, flexibility, or response to heat or water.','Complete a property table and justify the best material for a simple task.','Explain one energy transfer or material change seen at home or school.','property, material, energy, change, classify','table'),
  ('integrated-science','science',4,'Technology and health','Applying science','Using science to solve problems','Apply scientific ideas to health, environment, or technology decisions.','Science becomes useful when evidence guides safer, healthier, and more sustainable choices.','Evaluate two water-handling or hygiene choices and decide which is safer.','Use evidence cards to choose a solution for a local science problem.','Create a poster plan explaining a science-based solution and its evidence.','health, technology, environment, evidence, solution','workflow'),

  ('ire','humanities',1,'Beliefs and values','Respect and responsibility','Learning values through stories and choices','Identify values in a faith or moral story and connect them to daily decisions.','Values are shown through choices, relationships, service, honesty, respect, and responsibility.','Read an original moral scenario and identify the value shown by each character.','Discuss what a respectful response would look like in a school conflict.','Write one action plan for showing responsibility at home or school.','values, respect, responsibility, service, choice','text_reference'),
  ('ire','humanities',2,'Scripture and meaning','Reading for message','Finding the message in a religious text','Identify the main message, context, and application of a short religious text.','A text is understood better when learners ask who is speaking, what is happening, and what lesson is being taught.','Use a short teacher-provided passage and identify the message, audience, and action expected.','Complete a message-detail-application chart.','Explain how the message could guide a real decision this week.','message, context, application, scripture, audience','text_reference'),
  ('ire','humanities',3,'Community and worship','Practices and service','Faith in community life','Explain how worship, service, and community practices shape responsible living.','Community practices help people remember beliefs, support each other, and serve those in need.','Compare two community actions: prayer gathering and charity visit, then identify their purpose.','Plan a respectful service activity with roles and expected impact.','Reflect on one way young people can contribute positively to the community.','worship, community, service, charity, responsibility','workflow'),
  ('ire','humanities',4,'Moral decision making','Choosing wisely','Solving moral dilemmas','Use a step-by-step process to make a responsible moral decision.','A moral decision considers facts, values, possible effects, advice, and personal responsibility.','Work through a dilemma about honesty in a group project and evaluate possible choices.','Use the decision ladder: facts, values, options, effects, choice.','Write a short response explaining the best choice and why.','dilemma, consequence, honesty, advice, responsibility','workflow'),

  ('kiswahili','languages',1,'Kusikiliza na kuzungumza','Mawasiliano fasaha','Kusikiliza na kuzungumza kwa lengo','Tumia mikakati ya kusikiliza na kuzungumza ili kuwasiliana kwa heshima na uwazi.','Mawasiliano bora hutegemea lengo, hadhira, zamu ya kuzungumza, sauti, na ushahidi kutoka kwa yaliyosikika.','Sikiliza maelezo mafupi na utaje lengo la msemaji pamoja na hoja mbili muhimu.','Fanya mazoezi ya kuuliza swali la ufafanuzi baada ya maelezo ya mwenzako.','Andaa maelezo ya dakika moja yenye mwanzo, kati, na mwisho.','lengo, hadhira, sauti, zamu, ufafanuzi','workflow'),
  ('kiswahili','languages',2,'Kusoma','Wazo kuu na ushahidi','Kusoma kwa ufahamu','Tambua wazo kuu, maelezo yanayounga mkono, na ushahidi katika kifungu asilia.','Msomaji mzuri hutofautisha ujumbe mkuu na mifano, maoni, au maelezo ya ziada.','Soma aya fupi na uoneshe wazo kuu, maelezo mawili, na neno jipya.','Tumia jedwali la wazo kuu kueleza namna maelezo yanavyounga mkono ujumbe.','Andika kichwa kipya cha aya na ukitetea kwa ushahidi.','wazo kuu, maelezo, ushahidi, msamiati, ufahamu','text_reference'),
  ('kiswahili','languages',3,'Sarufi','Ujenzi wa sentensi','Kutunga sentensi bora','Tunga sentensi sahihi kwa kutumia nomino, vitenzi, vivumishi, alama, na mpangilio bora.','Sarufi husaidia mawazo yawe wazi, sahihi, na rahisi kusomeka.','Boresha sentensi dhaifu kwa kuongeza kitenzi sahihi, kivumishi, na alama inayofaa.','Panga maneno katika aina zake kisha tunga sentensi tatu zenye maana.','Hariri aya fupi ili sentensi ziwe wazi zaidi.','nomino, kitenzi, kivumishi, alama, sentensi','table'),
  ('kiswahili','languages',4,'Uandishi','Kupanga na kuhariri','Kuandika aya yenye lengo','Panga, andika rasimu, boresha, na hariri aya kwa lengo maalum.','Uandishi bora ni mchakato wa kupanga, kuandika, kuboresha maana, na kuhariri makosa.','Linganisha rasimu ya kwanza na aya iliyoboreshwa ili utambue kilichobadilika.','Tumia muundo wa aya: sentensi kuu, maelezo, mfano, na hitimisho.','Andika na uboreshe aya moja kuhusu mada ya shule au jamii.','rasimu, hariri, aya, sentensi kuu, hitimisho','workflow'),

  ('mandarin','languages',1,'Language foundations','Greetings and tones','Mandarin greetings and tone awareness','Use simple Mandarin greetings and notice how tone affects meaning.','Mandarin learning begins with listening to tones, practising pronunciation, and using greetings in context.','Listen to two greetings and identify the repeated sound pattern and polite response.','Practise a greeting-response chain with slow teacher modelling.','Write or record a short greeting exchange with pronunciation notes.','tone, greeting, response, pronunciation, context','text_reference'),
  ('mandarin','languages',2,'Character awareness','Symbols and meaning','Connecting characters, sounds, and meaning','Recognize that Mandarin characters connect visual form, sound, and meaning.','Characters are learned through shape observation, pronunciation support, meaning, and repeated use.','Study a simple character card and identify visual parts, sound support, and meaning.','Match character cards to meanings and say each word aloud.','Create three character cards with meaning and usage note.','character, sound, meaning, stroke, pattern','table'),
  ('mandarin','languages',3,'Sentence patterns','Questions and answers','Building short Mandarin sentences','Ask and answer simple questions using familiar Mandarin sentence frames.','Sentence frames help learners move from isolated words to useful communication.','Turn a vocabulary set into a short question and answer pair.','Practise three question-answer exchanges with a partner.','Write or record four short sentences about school or family.','question, answer, sentence frame, partner, meaning','text_reference'),
  ('mandarin','languages',4,'Reading and culture','Short text meaning','Understanding a simple Mandarin text','Read a short original Mandarin-supported text and identify main idea and key details.','Reading in another language requires clues from known words, context, structure, and prior knowledge.','Read a simple classroom notice and identify who it is for and what action is needed.','Underline known words, circle new words, and infer meaning from context.','Answer two comprehension questions with teacher-supported language.','main idea, detail, notice, context, infer','text_reference'),

  ('mathematics','mathematics',1,'Number and operations','Reasoning with quantities','Numbers, place value, and operations','Represent quantities and choose operations that match a problem situation.','Mathematics starts by understanding quantity, place value, relationships, and the operation required.','Compare two multi-step word problems and identify whether to add, subtract, multiply, or divide.','Use a place-value chart or bar model to solve one problem together.','Create and solve one real-life number problem from school, market, or home context.','quantity, place value, operation, estimate, reason','table'),
  ('mathematics','mathematics',2,'Patterns and algebra','Finding relationships','Patterns, rules, and unknowns','Describe a pattern, write a rule, and use it to find a missing value.','A pattern becomes mathematical when we can describe its rule and use the rule to predict or solve.','Study a growing pattern, list the first terms, and predict the next two terms.','Complete a table of values and explain the rule in words.','Create a pattern for a classmate and write its rule.','pattern, rule, term, unknown, table','table'),
  ('mathematics','mathematics',3,'Measurement and geometry','Shape and space','Measuring and describing shapes','Use measurement and geometry language to describe, compare, and solve practical problems.','Measurement connects number to length, area, volume, angle, time, and real objects.','Compare two shapes or containers and decide which measurement is needed to answer a question.','Measure or calculate a classroom example step by step.','Design a small measurement problem and solve it with units.','measure, unit, shape, angle, area, volume','formula'),
  ('mathematics','mathematics',4,'Data and probability','Using evidence','Collecting and interpreting data','Organize data and use it to answer a question with evidence.','Data helps us move from guessing to evidence-based decisions.','Read a small table or bar chart and answer what it shows, what is highest, and what changed.','Collect a quick class dataset and display it in a table or simple chart.','Write a conclusion supported by two pieces of data.','data, table, chart, evidence, conclusion','chart'),

  ('pre-technical-studies','technical',1,'Technology and design','Needs and solutions','Designing useful solutions','Identify a need and explain how a simple technical solution can respond to it.','Technical work begins with a real need, constraints, materials, tools, and a tested solution.','Analyse a school problem such as bag storage or water carrying and name the user need.','Use a design brief template: user, need, constraints, idea, test.','Sketch a simple solution and explain how it meets the need.','need, constraint, material, design, test','workflow'),
  ('pre-technical-studies','technical',2,'Tools and safety','Safe practical work','Choosing and using tools safely','Choose suitable tools and explain safe procedures before practical work.','Safety means selecting the right tool, checking the workspace, using protective habits, and following instructions.','Compare a safe and unsafe tool-use scenario and identify the risk.','Build a safety checklist for one classroom practical task.','Explain what to do before, during, and after using a selected tool.','tool, safety, risk, procedure, workspace','workflow'),
  ('pre-technical-studies','technical',3,'Materials and structures','Properties and strength','Understanding materials','Classify materials by properties and choose them for a simple task.','Materials behave differently because of strength, flexibility, texture, absorbency, weight, and durability.','Compare paper, wood, plastic, fabric, or metal for a small design task.','Complete a property table and justify the best material choice.','Recommend a material for a school object and explain the trade-off.','material, property, strength, durable, trade-off','table'),
  ('pre-technical-studies','technical',4,'Making and evaluating','Prototype improvement','Testing and improving a prototype','Test a simple prototype and use evidence to improve it.','A prototype is improved by testing, observing failure points, gathering feedback, and revising.','Review a weak bridge, holder, or container design and identify why it fails.','Run a simple test and record what worked, what failed, and what to change.','Write an improvement note for the second version of the prototype.','prototype, test, feedback, improve, evidence','workflow'),

  ('science-and-technology','science',1,'Scientific inquiry','Observation and evidence','Thinking like a scientist','Use observation, questioning, prediction, and evidence to investigate a simple science problem.','Science starts with careful observation, testable questions, fair comparisons, and evidence-based conclusions.','Compare two plant leaves or materials, then describe observations before making an explanation.','Write a testable question and prediction for a simple classroom investigation.','Design a fair test with one thing changed, one thing measured, and safety steps.','observation, evidence, prediction, fair test, conclusion','workflow'),
  ('science-and-technology','science',2,'Living things and environment','Systems and interactions','Living things in their environment','Explain how living things depend on structures, functions, energy, and environmental conditions.','Living systems survive through interactions among organisms, body structures, food, water, air, and habitat.','Trace how a change in water, light, or food affects a living thing.','Build a cause-effect diagram for one organism and its environment.','Write a short explanation of how to protect one local habitat.','organism, habitat, structure, function, interaction','diagram'),
  ('science-and-technology','science',3,'Matter, energy, and tools','Properties and change','Investigating materials, energy, and tools','Classify materials or energy changes using observable properties and safe investigation.','Materials, energy, and technology can be described by properties, changes, transfers, and responsible use.','Compare two materials by texture, strength, flexibility, or response to heat or water.','Complete a property table and justify the best material or tool for a simple task.','Explain one energy transfer or material change seen at home or school.','property, material, energy, tool, classify','table'),
  ('science-and-technology','science',4,'Technology and health','Applying science','Using science and technology to solve problems','Apply scientific ideas to health, environment, or technology decisions.','Science and technology become useful when evidence guides safer, healthier, and more sustainable choices.','Evaluate two water-handling or hygiene choices and decide which is safer.','Use evidence cards to choose a solution for a local science or technology problem.','Create a poster plan explaining a science-based solution and its evidence.','health, technology, environment, evidence, solution','workflow'),

  ('social-studies','humanities',1,'People and places','Reading maps and communities','Understanding our communities','Use maps, observations, and community evidence to describe people, places, and services.','Social studies helps learners understand where people live, how places are organized, and how communities meet needs.','Compare a school map and a community map, then identify services, routes, and landmarks.','Create a simple community map with a key and two services.','Explain how one community service supports learners or families.','map, community, service, landmark, key','map'),
  ('social-studies','humanities',2,'History and culture','Change over time','Learning from the past','Explain how people, places, and practices change over time while preserving identity.','History is understood by looking at evidence, sequence, cause, change, continuity, and memory.','Place three community events on a timeline and explain what changed.','Use a timeline to connect past, present, and future in a familiar example.','Interview or imagine a respectful oral-history question and explain why it matters.','history, timeline, evidence, culture, change','workflow'),
  ('social-studies','humanities',3,'Citizenship and governance','Rights and responsibilities','Being a responsible citizen','Describe rights, responsibilities, rules, and participation in school and community life.','Citizenship balances rights with responsibility, fairness, leadership, and respect for others.','Analyse a school rule and explain which right or responsibility it protects.','Sort examples into rights, responsibilities, and shared rules.','Write a pledge for one responsible action in school or community.','right, responsibility, rule, fairness, leadership','table'),
  ('social-studies','humanities',4,'Resources and environment','Care and sustainability','Using resources responsibly','Explain how communities use resources and make choices that protect the environment.','Resource decisions affect people, livelihoods, fairness, and the environment now and in the future.','Compare two choices for water, waste, land, or energy use and predict their effects.','Use a cause-effect chart to analyse one local resource issue.','Propose one action that improves resource use in school or community.','resource, environment, sustainability, cause, effect','workflow');

UPDATE public.courses c
SET
  status = 'published',
  lesson_generation_mode = 'mixed',
  target_lesson_count = 4,
  pricing_label = COALESCE(NULLIF(c.pricing_label, ''), 'Free CBC starter pathway'),
  description =
    'Published KingPin-owned Kenyan CBC starter course for ' ||
    COALESCE(c.curriculum_subject, c.subject, 'this subject') ||
    '. Includes original classroom-ready starter lessons; teachers should extend it with licensed or institution-provided source materials for full syllabus coverage.',
  curriculum_metadata = COALESCE(c.curriculum_metadata, '{}'::jsonb) || jsonb_build_object(
    'teachable_seed_version', 'cbc_starter_v1',
    'starter_lessons_per_course', 4,
    'rights_rule', 'Starter lessons are original KingPin-authored teaching content and do not reproduce textbook text.',
    'teacher_review_required_for_full_syllabus', true
  ),
  updated_at = now()
WHERE c.country = 'Kenya'
  AND c.curriculum_family = 'CBC'
  AND c.grade BETWEEN 6 AND 9
  AND c.curriculum_subject_slug IN (SELECT DISTINCT subject_slug FROM cbc_starter_lesson_seed);

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
  'KingPin CBC starter teaching outline',
  'text',
  'Original starter teaching outline for ' || c.title || E'.\n\n' ||
    string_agg(
      'Lesson ' || s.lesson_order || ': ' || s.title || E'\n' ||
      'Objective: ' || s.objective || E'\n' ||
      'Key concept: ' || s.key_concept || E'\n' ||
      'Worked example: ' || s.worked_example || E'\n' ||
      'Guided task: ' || s.guided_task || E'\n' ||
      'Independent task: ' || s.independent_task,
      E'\n\n'
      ORDER BY s.lesson_order
    ),
  'KingPin CBC starter pathway',
  'ready',
  'other',
  'licensed',
  'Original KingPin-authored starter teaching material. It does not contain copied textbook passages.',
  jsonb_build_object(
    'seedKey', 'cbc_starter_outline_v1',
    'country', 'Kenya',
    'curriculumFamily', 'CBC',
    'grade', c.grade,
    'subject', c.curriculum_subject,
    'rightsRule', 'Use as starter teaching context; upload licensed or institution-provided materials for exact book coverage.'
  ),
  now(),
  now()
FROM public.courses c
JOIN cbc_starter_lesson_seed s ON s.subject_slug = c.curriculum_subject_slug
WHERE c.country = 'Kenya'
  AND c.curriculum_family = 'CBC'
  AND c.grade BETWEEN 6 AND 9
  AND NOT EXISTS (
    SELECT 1
    FROM public.course_materials existing
    WHERE existing.course_id = c.id
      AND existing.curriculum_metadata->>'seedKey' = 'cbc_starter_outline_v1'
  )
GROUP BY c.id, c.institution_id, c.title, c.grade, c.curriculum_subject;

CREATE INDEX IF NOT EXISTS idx_lessons_seed_key
  ON public.lessons ((lesson_data_json->>'seedKey'))
  WHERE lesson_data_json ? 'seedKey';

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
    'cbc_starter_v1_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order AS seed_key
  FROM public.courses c
  JOIN cbc_starter_lesson_seed s ON s.subject_slug = c.curriculum_subject_slug
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
  ls.objective || ' This starter lesson is original teaching content and should be reviewed with licensed materials for full syllabus depth.',
  'beginner',
  40,
  ls.lesson_order - 1,
  ls.objective,
  'KingPin CBC starter pathway: ' || ls.strand || ' / ' || ls.sub_strand,
  30,
  40,
  'mixed',
  'published',
  jsonb_build_object(
    'seedKey', ls.seed_key,
    'seedVersion', 'cbc_starter_v1',
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
      'syllabusReference', 'KingPin CBC starter pathway',
      'rightsRule', 'Original starter lesson; no textbook text reproduced.'
    ),
    'pacingPlan', jsonb_build_object(
      'minimumDurationMinutes', 30,
      'targetDurationMinutes', 40,
      'maximumDurationMinutes', 55,
      'extensionStrategies', jsonb_build_array(
        'Ask learners to explain the concept in their own words.',
        'Add a second local example before independent practice.',
        'Pause for peer comparison and correction.',
        'Use the visual plan to reteach the key relationship.'
      )
    ),
    'visualPlan', jsonb_build_array(
      jsonb_build_object(
        'id', ls.seed_key || '_visual_1',
        'kind', ls.visual_kind,
        'source', 'fallback',
        'title', ls.title || ' visual organizer',
        'description', 'A simple teacher-created organizer for ' || ls.key_concept,
        'alt', 'Visual organizer for ' || ls.title,
        'teacherCue', 'Point to the organizer while connecting the key concept, worked example, and practice task.',
        'labels', jsonb_build_array(ls.strand, ls.sub_strand, ls.vocabulary)
      )
    ),
    'instructionalSegments', jsonb_build_array(
      jsonb_build_object('id', ls.seed_key || '_welcome', 'title', 'Welcome and goal', 'type', 'welcome', 'estimatedMinutes', 4),
      jsonb_build_object('id', ls.seed_key || '_concept', 'title', 'Concept teaching', 'type', 'concept', 'estimatedMinutes', 12, 'visualRequired', true, 'visualCue', ls.visual_kind),
      jsonb_build_object('id', ls.seed_key || '_example', 'title', 'Worked example', 'type', 'worked_example', 'estimatedMinutes', 8),
      jsonb_build_object('id', ls.seed_key || '_practice', 'title', 'Guided and independent practice', 'type', 'guided_practice', 'estimatedMinutes', 12),
      jsonb_build_object('id', ls.seed_key || '_reflect', 'title', 'Summary and reflection', 'type', 'summary', 'estimatedMinutes', 4)
    ),
    'reteachMoments', jsonb_build_array(
      jsonb_build_object(
        'concept', ls.key_concept,
        'recapPoints', jsonb_build_array('Name the idea.', 'Show it in an example.', 'Apply it to a learner task.'),
        'alternateExplanation', 'If learners are confused, use a familiar local example and ask them to identify the parts before naming the formal term.',
        'visualCue', 'Return to the visual organizer and trace the relationship slowly.'
      )
    ),
    'guidedQuestions', jsonb_build_array(
      jsonb_build_object(
        'question', 'Which statement best matches today''s key idea?',
        'options', jsonb_build_array(ls.key_concept, ls.guided_task, ls.independent_task, 'Skip evidence and guess quickly.'),
        'correct', ls.key_concept,
        'explanation', 'The key idea is the concept that explains the whole lesson. The tasks are ways to practise it.'
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
            'question', ls.independent_task,
            'correctAnswer', 'A complete answer explains the choice, uses lesson vocabulary, and gives evidence.',
            'hint', 'Start by naming the key concept.',
            'hints', jsonb_build_array('Name the key concept.', 'Connect it to the worked example.', 'Use evidence from the task.'),
            'misconception', jsonb_build_object('answer', 'A one-word answer.', 'note', 'Explain the reason, not only the final word.')
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
    l.lesson_data_json->>'seedKey' AS seed_key,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.*
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  JOIN cbc_starter_lesson_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_starter_v1_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
),
section_seed(order_index, type, title, estimated_minutes) AS (
  VALUES
    (0, 'welcome', 'Welcome and learning focus', 4),
    (1, 'objective', 'What success looks like', 3),
    (2, 'why_it_matters', 'Why this matters', 4),
    (3, 'prerequisite_check', 'Check what we already know', 4),
    (4, 'concept', 'Key concept', 8),
    (5, 'worked_example', 'Worked example', 7),
    (6, 'question_checkpoint', 'Check for understanding', 3),
    (7, 'guided_practice', 'Guided practice', 6),
    (8, 'independent_practice', 'Independent practice', 6),
    (9, 'summary', 'Summary', 3),
    (10, 'exit_reflection', 'Exit reflection and homework', 2)
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
    c.title AS course_title,
    c.grade,
    c.curriculum_subject,
    c.curriculum_subject_slug,
    s.*
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  JOIN cbc_starter_lesson_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_starter_v1_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
  WHERE c.country = 'Kenya'
    AND c.curriculum_family = 'CBC'
    AND c.grade BETWEEN 6 AND 9
),
item_seed(lesson_id, section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake) AS (
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
    x.common_mistake
  FROM seeded_lessons sl
  CROSS JOIN LATERAL (
    VALUES
      ('welcome', 0, 'heading', 'Today: ' || sl.title, 'Welcome to ' || sl.title || ' in Grade ' || sl.grade || ' ' || sl.curriculum_subject || '.', 'Today we will move slowly from the main idea into an example and then into practice. Keep your notebook open, listen for the vocabulary, and be ready to explain your thinking.', 'Lesson focus: ' || sl.title || '.', 'Board heading showing the lesson title.', 'A clear opening helps learners know the purpose of the class.', null),
      ('objective', 0, 'concept', 'Goal: ' || sl.objective, sl.objective, 'By the end, a strong learner should be able to explain the idea, show it in an example, and attempt a similar task independently. This is more than memorising words; it is using the idea correctly.', 'Goal: ' || sl.objective, 'Lesson objective displayed on the board.', 'The objective tells us what success looks like.', 'Do not copy the objective without understanding what action it asks you to do.'),
      ('why_it_matters', 0, 'bullet', 'Why it matters: useful beyond this lesson', 'This matters because ' || lower(sl.key_concept), 'The lesson connects to real school, home, community, or future work situations. When learners can connect the idea to daily life, they remember it better and use it more responsibly.', 'Why it matters: ' || sl.key_concept, 'Short explanation of why the topic matters.', 'CBC learning should connect knowledge, skills, values, and real situations.', null),
      ('prerequisite_check', 0, 'question', 'Before we begin: what do you already know?', 'Before we continue, think about what you already know about ' || sl.strand || '.', 'I want learners to activate prior knowledge before new teaching starts. Even a small memory, example, word, or question can become a bridge into the new concept.', 'Starter check: name one thing you already know about ' || sl.strand || '.', 'Prerequisite question for learners.', 'Prior knowledge makes new learning easier to attach and remember.', 'Do not be silent because you are unsure; even a question is useful evidence.'),
      ('concept', 0, 'concept', 'Key idea: ' || sl.key_concept, sl.key_concept, 'Let us unpack the key idea carefully. First, identify the main words. Next, connect them to the example. Finally, ask what evidence would prove that the idea has been understood.', 'Key idea: ' || sl.key_concept, 'Main concept written on the board.', 'This is the idea the rest of the lesson depends on.', 'Do not rush to the activity before you can explain the concept.'),
      ('concept', 1, 'bullet', 'Vocabulary: ' || sl.vocabulary, 'The important vocabulary today is: ' || sl.vocabulary || '.', 'These words are the handles for the lesson. Learners should use them in answers so their thinking becomes precise rather than vague.', 'Vocabulary: ' || sl.vocabulary, 'Vocabulary list for the lesson.', 'Subject vocabulary helps learners communicate accurately.', 'Using the word without explaining it can hide weak understanding.'),
      ('worked_example', 0, 'instruction', 'Worked example: ' || sl.worked_example, sl.worked_example, 'Watch how the example is handled. I will first name the situation, then choose the useful idea, then explain the evidence or steps that support the answer.', 'Worked example: ' || sl.worked_example, 'Worked example prompt on the board.', 'A worked example shows the thinking process before learners practise alone.', 'Do not only copy the answer; notice the reasoning steps.'),
      ('question_checkpoint', 0, 'question', 'Checkpoint: explain the key idea in your own words.', 'Pause and explain the key idea in your own words.', 'This checkpoint is not a test of memory only. I am checking whether learners can restate the idea, connect it to the example, and ask for help if one part is still unclear.', 'Checkpoint: restate the key idea and give one example.', 'Checkpoint question for understanding.', 'Short checks prevent confusion from building up.', 'Do not repeat the exact board words if you cannot explain them.'),
      ('guided_practice', 0, 'instruction', 'Guided task: ' || sl.guided_task, sl.guided_task, 'We will complete this together. I will model the first move, then ask learners to suggest the next move, then we will correct the response using the lesson vocabulary.', 'Guided practice: ' || sl.guided_task, 'Guided practice task on the board.', 'Guided practice helps learners move from watching to doing.', 'Do not wait for the teacher to do every step.'),
      ('independent_practice', 0, 'question', 'Your turn: ' || sl.independent_task, sl.independent_task, 'Now learners try independently. A complete answer should name the concept, apply it to the task, and give evidence or a reason. The teacher should circulate, listen, and reteach where needed.', 'Independent task: ' || sl.independent_task, 'Independent practice task on the board.', 'Independent practice shows whether the learner can transfer the idea.', 'A short answer without evidence is not yet complete.'),
      ('summary', 0, 'bullet', 'Summary: concept, example, practice, reflection', 'Today we learned the key concept, studied a worked example, practised together, and tried an independent task.', 'The summary helps learners organise the lesson into memory: what the idea was, how it looked in the example, how they practised it, and what they still need to review.', 'Summary: idea, example, guided practice, independent practice.', 'Summary sequence shown on the board.', 'A summary turns activity into remembered learning.', null),
      ('exit_reflection', 0, 'question', 'Exit: what should we review next?', 'Before we finish, choose what we should review next: the vocabulary, the example, the guided task, or the independent task.', 'The exit reflection gives useful evidence for the next lesson. Learners should answer honestly so the teacher can decide whether to reteach, extend, or move forward.', 'Exit reflection: choose the part that needs review.', 'Exit reflection question on the board.', 'Reflection helps the next lesson start at the right place.', null)
  ) AS x(section_type, order_index, item_type, board_text, exact_spoken_text, teacher_explanation, learner_notes, accessible_description, why_this_matters, common_mistake)
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
  180,
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
  JOIN cbc_starter_lesson_seed s
    ON s.subject_slug = c.curriculum_subject_slug
    AND ('cbc_starter_v1_' || c.grade || '_' || c.curriculum_subject_slug || '_' || s.lesson_order) = l.lesson_data_json->>'seedKey'
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
  'KP-CBC-G' || sl.grade || '-' || sl.curriculum_subject_slug || '-L' || sl.lesson_order,
  sl.strand,
  sl.sub_strand,
  'KingPin CBC starter pathway lesson ' || sl.lesson_order,
  'other',
  sl.course_id,
  sl.lesson_id,
  'published',
  'Original starter mapping. Replace or extend with exact licensed syllabus scope when materials are uploaded.',
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
