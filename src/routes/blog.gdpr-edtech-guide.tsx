import { createFileRoute, Link } from "@tanstack/react-router";
import { BlogLayout } from "@/components/marketing/BlogLayout";

export const Route = createFileRoute("/blog/gdpr-edtech-guide")({
  head: () => ({
    meta: [
      {
        title:
          "GDPR Compliance for EdTech: A Practical Guide for Education Institutions — Klassruum Blog",
      },
      {
        name: "description",
        content:
          "A comprehensive, practical guide to GDPR compliance for EdTech platforms and education institutions. Covers lawful bases for processing, children's data, DPIAs for AI, data subject rights, international transfers, and a vendor due-diligence checklist.",
      },
      {
        name: "keywords",
        content:
          "GDPR EdTech, GDPR compliance education, data protection schools, GDPR AI education, children data protection, DPIA EdTech, GDPR lawful basis education, education data privacy, GDPR student data, Klassruum GDPR",
      },
    ],
  }),
  component: () => (
    <BlogLayout
      meta={{
        title: "GDPR compliance for EdTech: A practical guide for education institutions",
        description:
          "Everything school leaders, data protection officers, and IT administrators need to know about GDPR compliance when adopting AI-powered learning platforms.",
        publishDate: "June 2026",
        readTime: "17 min read",
        author: "Klassruum Team",
      }}
    >
      {/* ─────────────────────────── Introduction ─────────────────────────── */}
      <section className="mb-12">
        <p className="text-lg leading-relaxed text-neutral-700">
          Artificial intelligence is reshaping education at every level. From adaptive learning
          pathways to real-time classroom analytics, EdTech platforms now process enormous volumes
          of personal data — often data belonging to children and young people. That reality places
          the General Data Protection Regulation (GDPR) at the centre of every technology adoption
          decision an education institution makes.
        </p>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Yet GDPR is frequently treated as a box-ticking exercise rather than the strategic,
          risk-aware framework it is designed to be. Schools sign processing agreements without
          understanding them. Vendors claim "GDPR compliant" without explaining what that means in
          practice. Data Protection Officers are brought in after procurement decisions have already
          been made.
        </p>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          This guide changes that. It is written for school leaders, university administrators, data
          protection officers, and IT teams who need a thorough, actionable understanding of how
          GDPR applies to EdTech — and specifically to AI-powered learning platforms. We cover the
          legal foundations, walk through the practical obligations, and provide a vendor
          due-diligence checklist you can use today.
        </p>

        <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-6">
          <p className="text-sm font-semibold text-sky-800">How Klassruum handles GDPR</p>
          <p className="mt-2 text-sm leading-relaxed text-sky-700">
            Klassruum is built with privacy by design. All data is encrypted at rest and in transit,
            hosted exclusively in EU data centres, and is never used to train AI models. Our
            platform provides the tools education institutions need to meet their GDPR obligations
            without adding operational complexity.{" "}
            <Link
              to="/features"
              className="font-medium underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
            >
              Explore features
            </Link>{" "}
            or{" "}
            <Link
              to="/contact"
              className="font-medium underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
            >
              talk to our team
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─────────────────── 1. Why GDPR Matters in Education ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          1. Why GDPR matters specifically for education
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          GDPR applies to every organisation that processes the personal data of individuals in the
          European Economic Area (EEA) and the United Kingdom. Education institutions are not exempt
          — in fact, they face some of the regulation's most demanding requirements. Three
          characteristics of the education sector make this especially important.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Children's data is special data
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          The GDPR treats data relating to children with particular care. Under Article 8, where
          information society services are offered directly to children, the consent of a parent or
          guardian is required for children below a certain age — 13 in some Member States, 16 in
          others, with flexibility down to 13. When an EdTech platform serves minors, every data
          processing activity must be evaluated through the lens of children's rights. This includes
          learning analytics, progress tracking, behavioural data, and any form of profiling.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Special category data is routine in education
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Article 9 of the GDPR identifies categories of data that are especially sensitive: health
          data, biometric data, data revealing racial or ethnic origin, and data concerning a
          person's sex life or sexual orientation. In an education context, this data is not rare —
          it is routine. Learning disability diagnoses, medical accommodation plans, language
          background assessments, and free-school-meal eligibility all fall within or near these
          categories. When an AI platform adapts content for a student with dyslexia, it processes
          health-related special category data. When a school records a student's ethnicity for
          inclusion monitoring, it triggers Article 9 obligations.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Asymmetric power dynamics
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          The relationship between a school and a student is inherently unequal. Students —
          especially minors — cannot freely withdraw consent when refusal might affect their
          education. This power asymmetry is why regulators scrutinise consent as a lawful basis in
          educational settings and why legitimate interest or public task bases are often more
          appropriate. The same asymmetry applies to staff data, where employment relationships
          limit genuine voluntariness.
        </p>
      </section>

      {/* ─────────────────── 2. The 6 Lawful Bases ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          2. The six lawful bases for processing — and which apply to education
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Every act of processing personal data under GDPR must be grounded in at least one of six
          lawful bases defined in Article 6. Choosing the wrong basis — or failing to document the
          choice — is one of the most common compliance failures regulators identify in education
          settings.
        </p>

        <div className="mt-6 space-y-4">
          {[
            {
              title: "Consent (Article 6(1)(a))",
              desc: "The data subject has given clear, affirmative consent for processing for a specific purpose. Freely given, specific, informed, and unambiguous. In education, consent is problematic as a primary basis because of the power imbalance: a student who refuses consent may fear academic consequences. Consent must be as easy to withdraw as to give.",
              applicable: "Limited — best used as supplementary basis, not primary.",
            },
            {
              title: "Contract (Article 6(1)(b))",
              desc: "Processing is necessary for the performance of a contract to which the data subject is a party, or for pre-contractual steps. Relevant where a student (or parent) has a direct contractual relationship with the institution. Less applicable to third-party EdTech vendors unless the school acts as data processor under a data processing agreement.",
              applicable: "Moderate — applies to direct student-institution relationships.",
            },
            {
              title: "Legal obligation (Article 6(1)(c))",
              desc: "Processing is necessary for compliance with a legal obligation. Schools in the EU and UK are legally required to maintain attendance records, exam results, safeguarding records, and certain reporting. This is a strong basis for mandatory data processing but does not cover all school activities.",
              applicable: "Strong for statutory functions (attendance, exams, safeguarding).",
            },
            {
              title: "Vital interests (Article 6(1)(d))",
              desc: "Processing is necessary to protect someone's life. Rarely applicable to routine EdTech processing, but relevant in safeguarding emergencies — for example, sharing a student's medical information with emergency services.",
              applicable: "Narrow — emergency and safeguarding scenarios only.",
            },
            {
              title: "Public task (Article 6(1)(e))",
              desc: "Processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority. This is the strongest and most commonly relied-upon basis for public education institutions. It covers teaching, assessment, safeguarding, and the administrative functions that support them.",
              applicable: "Strongest basis for public schools and universities.",
            },
            {
              title: "Legitimate interests (Article 6(1)(f))",
              desc: "Processing is necessary for the legitimate interests pursued by the controller or a third party, except where overridden by the data subject's rights. Requires a documented Legitimate Interests Assessment (LIA). Useful for private schools, EdTech vendors, and activities that do not fall neatly under public task — such as marketing, research, or platform analytics.",
              applicable: "Important for private institutions and vendor activities.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-5">
              <h4 className="text-base font-semibold text-neutral-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
              <p className="mt-2 text-sm font-medium text-sky-700">
                Education applicability: {item.applicable}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          In practice, most public education institutions rely primarily on
          <strong> public task</strong> and <strong>legal obligation</strong>, supplemented by
          consent where appropriate (such as for optional extracurricular activities or marketing).
          Private institutions more often use <strong>legitimate interests</strong> and{" "}
          <strong>contract</strong>. The key obligation is to document your chosen basis for each
          processing activity in your Record of Processing Activities (ROPA).
        </p>
      </section>

      {/* ─────────────────── 3. Data Minimisation ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          3. Data minimisation: what data do AI classrooms actually need?
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Article 5(1)(c) of the GDPR requires that personal data be "adequate, relevant and limited
          to what is necessary in relation to the purposes for which they are processed." This is
          the data minimisation principle, and it is where many EdTech deployments go wrong.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          AI systems are, by nature, data-hungry. Machine learning models improve with more training
          data, and adaptive algorithms need continuous signals to personalise learning. The
          temptation is to collect everything — every click, every pause, every hesitation — on the
          assumption that more data leads to better outcomes. GDPR requires a different approach.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          What an AI classroom genuinely needs
        </h3>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            <strong>Student identity data</strong> — name, class assignment, and a unique
            identifier. Sufficient to link learning activity to a student without duplicating
            national ID numbers or other unnecessary identifiers.
          </li>
          <li>
            <strong>Learning interaction data</strong> — answers submitted, time spent on tasks,
            areas where a student struggles. This is the core signal that drives adaptive pathways.
          </li>
          <li>
            <strong>Progress metrics</strong> — competency levels, completion rates, and mastery
            scores. Aggregated and anonymised where possible.
          </li>
          <li>
            <strong>Accessibility preferences</strong> — font size, colour contrast, screen reader
            settings. Necessary to deliver an inclusive experience.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          What an AI classroom does not need
        </h3>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            Home address, parental income, or family composition — unless required for a specific,
            documented purpose such as means-tested bursary administration.
          </li>
          <li>
            Browsing history outside the platform — no legitimate basis exists for tracking what
            students do outside the learning environment.
          </li>
          <li>
            Device fingerprinting or persistent cross-session tracking — unless strictly necessary
            for security (e.g., detecting unauthorised access).
          </li>
          <li>
            Biometric data (facial recognition, fingerprints) for attendance — unless no less
            intrusive alternative exists and a DPIA has been completed.
          </li>
        </ul>

        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-800">Practical tip</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-700">
            Before approving any new data collection field in an EdTech platform, ask: "Can the
            platform deliver its core educational function without this data?" If the answer is yes,
            the data should not be collected. Document this assessment in your ROPA.
          </p>
        </div>
      </section>

      {/* ─────────────────── 4. Purpose Limitation ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          4. Purpose limitation: can student data be used for AI model training?
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Article 5(1)(b) requires that personal data be collected for specified, explicit, and
          legitimate purposes and not further processed in a manner incompatible with those
          purposes. This is the purpose limitation principle, and it has profound implications for
          AI in education.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          Consider the typical scenario: a school shares student learning data with an EdTech vendor
          to power adaptive learning. The stated purpose is "to provide personalised educational
          content to the student." Can the vendor then use that data to train its machine learning
          models?
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          The answer depends on the legal basis and the terms of the data processing agreement.
          Under GDPR:
        </p>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            <strong>If consent is the basis</strong>, the further purpose (model training) must be
            specifically disclosed and consented to at the point of collection. Bundling model
            training into a general consent clause is insufficient.
          </li>
          <li>
            <strong>If public task or legitimate interest is the basis</strong>, the vendor must
            demonstrate that model training is compatible with the original purpose. This requires a
            compatibility assessment considering: the link between purposes, the context of
            collection, the nature of the data, potential consequences, and the existence of
            appropriate safeguards.
          </li>
          <li>
            <strong>In all cases</strong>, if the data includes children's data or special category
            data, the bar for compatibility is significantly higher.
          </li>
        </ul>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          The safest and most ethical approach — and the one Klassruum takes — is to contractually
          commit that student data is never used for model training. This eliminates the
          compatibility question entirely and gives institutions and families genuine assurance.
        </p>

        <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-6">
          <p className="text-sm font-semibold text-sky-800">Klassruum's commitment</p>
          <p className="mt-2 text-sm leading-relaxed text-sky-700">
            Klassruum does not use student data, teacher data, or school data to train, fine-tune,
            or improve AI models. Our data processing agreements explicitly prohibit this use. Your
            data serves your students — nothing else.{" "}
            <Link
              to="/privacy"
              className="font-medium underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
            >
              Read our privacy policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─────────────────── 5. Consent vs Legitimate Interest ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          5. Consent vs legitimate interest in educational settings
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          The choice between consent and legitimate interest is one of the most debated topics in
          EdTech data protection. The European Data Protection Board (EDPB) and national supervisory
          authorities have consistently warned that consent in education is fraught with problems.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Why consent is problematic in education
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          For consent to be valid under GDPR, it must be freely given. The EDPB has clarified that
          where there is a "clear imbalance" between the data subject and the controller, consent
          cannot be considered freely given. In a school setting, this imbalance is inherent:
          students (and their parents) may feel unable to refuse consent for fear of academic
          disadvantage.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          This does not mean consent can never be used in education. It means it should not be the
          primary basis for processing that is integral to delivering education. Consent can be
          appropriate for optional activities: a school newsletter, participation in a research
          study, or the use of an optional supplementary app.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          When legitimate interest is appropriate
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Legitimate interest (Article 6(1)(f)) requires a three-part test:
        </p>

        <ol className="mt-4 list-decimal space-y-3 pl-6 text-base text-neutral-700">
          <li>
            <strong>Purpose test</strong> — Is there a legitimate interest? Yes: improving
            educational outcomes, ensuring platform security, conducting anonymised research.
          </li>
          <li>
            <strong>Necessity test</strong> — Is the processing necessary to achieve that interest?
            This requires demonstrating that less intrusive alternatives would not suffice.
          </li>
          <li>
            <strong>Balancing test</strong> — Do the data subject's interests, rights, and freedoms
            override the legitimate interest? For children's data, the balancing test places
            significant weight on the data subject's side.
          </li>
        </ol>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          The outcome is not always the same. For some processing activities, legitimate interest
          passes the balancing test; for others, it does not. The critical requirement is to
          document the assessment — a Legitimate Interests Assessment (LIA) — and to review it
          periodically.
        </p>
      </section>

      {/* ─────────────────── 6. Children's Data ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          6. Children's data: age-appropriate design and parental consent
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          The GDPR does not set a single EU-wide age of digital consent. Instead, Article 8 allows
          Member States to set the age between 13 and 16. In the United Kingdom, the age of digital
          consent is 13. This means that for children under 13 in the UK (and under the applicable
          age in each EU Member State), a parent or guardian must consent to the processing of their
          child's data for information society services.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">Age-appropriate design</h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Beyond the age-of-consent threshold, EdTech platforms must consider the broader principle
          of age-appropriate design. The UK's ICO Children's Code (formally the Age Appropriate
          Design Code) applies to "information society services" likely to be accessed by children
          and establishes 15 standards including:
        </p>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            Best interests of the child — the best interests of the child must be a primary
            consideration in all design decisions.
          </li>
          <li>
            Data minimisation — collect and retain only the minimum amount of personal data needed.
          </li>
          <li>
            Transparency — privacy information must be communicated in age- appropriate language.
          </li>
          <li>
            Parental controls — provide effective parental oversight without undermining the child's
            autonomy where appropriate.
          </li>
          <li>
            Default settings — default settings must be set to provide a high level of privacy.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Practical implications for schools
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Schools must ensure that the EdTech platforms they deploy comply with age-appropriate
          design requirements. This means reviewing vendor privacy notices for clarity and
          age-appropriateness, confirming that consent mechanisms for under-age children are in
          place, verifying that default privacy settings are set to maximum protection, and ensuring
          that data retention periods are genuinely limited.
        </p>
      </section>

      {/* ─────────────────── 7. DPIAs ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          7. Data Protection Impact Assessments (DPIAs) for AI in education
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Article 35 of the GDPR requires a Data Protection Impact Assessment (DPIA) where
          processing is "likely to result in a high risk to the rights and freedoms of natural
          persons." The EDPB and national supervisory authorities have identified several criteria
          that trigger a DPIA — and AI-powered EdTech platforms frequently meet multiple triggers
          simultaneously.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          When a DPIA is required in EdTech
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          A DPIA is required when processing involves:
        </p>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            Systematic and extensive evaluation of personal aspects — adaptive learning algorithms
            that profile student abilities meet this threshold.
          </li>
          <li>
            Automated decision-making with legal or similarly significant effects — an AI system
            that determines a student's learning pathway, recommends streaming, or flags at-risk
            students can significantly affect their educational experience.
          </li>
          <li>
            Processing of children's data on a large scale — schools with hundreds or thousands of
            student records clearly meet this threshold.
          </li>
          <li>
            Processing of special category data on a large scale — learning disability data,
            health-related accommodations, and ethnicity data.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          What a good DPIA contains
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          A DPIA is not a one-page form. For AI in education, it should include a systematic
          description of the processing operations and their purposes, an assessment of the
          necessity and proportionality of the processing, an assessment of the risks to the rights
          and freedoms of data subjects, and the measures envisaged to address those risks. The DPO
          must be consulted throughout the process, and where the DPIA indicates that the processing
          would result in a high risk that cannot be mitigated, prior consultation with the
          supervisory authority is required.
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm font-semibold text-neutral-800">Klassruum supports your DPIA</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Klassruum provides comprehensive documentation to support your DPIA process, including
            detailed descriptions of data flows, technical and organisational security measures, and
            sub-processor information. Our team is available to assist your DPO throughout the
            assessment.{" "}
            <Link
              to="/contact"
              className="font-medium underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900"
            >
              Request DPIA documentation
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─────────────────── 8. Data Subject Rights ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          8. Data subject rights: access, rectification, erasure, and more
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          The GDPR grants data subjects a suite of rights that education institutions must
          facilitate. In practice, these rights are most often exercised by parents on behalf of
          their children.
        </p>

        <div className="mt-6 space-y-4">
          {[
            {
              title: "Right of access (Article 15)",
              desc: "Data subjects can request a copy of all personal data processed about them. Schools must respond within one month (extendable by two months for complex requests). For EdTech platforms, this means the school must be able to extract a student's complete data record from the platform — a capability not all platforms provide.",
            },
            {
              title: "Right to rectification (Article 16)",
              desc: "Data subjects can request correction of inaccurate data. If an AI system has made an incorrect assessment of a student's competency, the student (or parent) can request that this be corrected. The school must propagate this correction to the platform.",
            },
            {
              title: "Right to erasure (Article 17)",
              desc: "The right to have personal data deleted — commonly known as the right to be forgotten. This is not absolute: it does not apply where processing is necessary for compliance with a legal obligation (e.g., statutory record-keeping). But where a student leaves a school and the school has no further legal basis for retention, the data must be deleted from EdTech systems.",
            },
            {
              title: "Right to restrict processing (Article 18)",
              desc: "Data subjects can request that processing be restricted while accuracy is contested or where processing is unlawful but the data subject prefers restriction over erasure.",
            },
            {
              title: "Right to data portability (Article 20)",
              desc: "Where processing is based on consent or contract and carried out by automated means, data subjects can receive their data in a structured, commonly used, and machine-readable format. This is particularly relevant for students transferring between institutions.",
            },
            {
              title: "Right to object (Article 21)",
              desc: "Data subjects can object to processing based on legitimate interests or public task. The controller must then cease processing unless it demonstrates compelling legitimate grounds. For direct marketing, the objection is absolute.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-5">
              <h4 className="text-base font-semibold text-neutral-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          Schools should ensure their EdTech vendors provide data export capabilities, support
          automated data deletion workflows, and can respond to data subject requests within the
          statutory timeframe.{" "}
          <Link
            to="/data-protection"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            Learn more about data protection at Klassruum
          </Link>
          .
        </p>
      </section>

      {/* ─────────────────── 9. International Data Transfers ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          9. International data transfers: where is student data stored?
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Chapter V of the GDPR restricts the transfer of personal data to countries outside the EEA
          that do not provide an "adequate" level of data protection. Post-Brexit, the UK maintains
          its own adequacy framework, largely aligned with the EEA's.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Why this matters for EdTech
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Many EdTech platforms are built on cloud infrastructure that may route data through data
          centres in the United States, Asia, or elsewhere. Even where the vendor is headquartered
          in the EU, sub-processors (cloud providers, analytics services, AI inference endpoints)
          may process data outside the EEA. Post-Schrems II, transfers to the United States require
          additional safeguards such as Standard Contractual Clauses (SCCs), supplementary measures,
          and Transfer Impact Assessments (TIAs).
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          What institutions should verify
        </h3>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>Where exactly is data stored at rest? (Country, data centre, cloud provider.)</li>
          <li>
            Where is data processed? (Does AI inference happen in the EU or is it routed to a US
            endpoint?)
          </li>
          <li>
            Are there sub-processors outside the EEA? If so, what transfer mechanism is in place?
          </li>
          <li>
            Is there a data processing agreement that contractually restricts transfers and
            sub-processing?
          </li>
        </ul>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-800">Klassruum's data residency</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-700">
            Klassruum hosts all student and school data exclusively in EU-based data centres. AI
            inference is performed within the EU. We do not transfer personal data outside the EEA,
            and we do not use sub-processors outside the EU. Your data never leaves Europe.
          </p>
        </div>
      </section>

      {/* ─────────────────── 10. AI and Automated Decision-Making ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          10. AI and automated decision-making: Article 22 implications for adaptive learning
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Article 22 of the GDPR provides that data subjects have the right not to be subject to a
          decision based solely on automated processing — including profiling — which produces legal
          effects or similarly significantly affects them.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Does adaptive learning trigger Article 22?
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          This is a nuanced question. An AI system that recommends which topic a student studies
          next is making an automated decision — but does it "significantly affect" the student?
          Regulators and courts are still developing guidance, but the conservative and responsible
          approach is to treat any AI system that materially shapes a student's educational
          experience as potentially triggering Article 22.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          The consequences are significant. If Article 22 applies, the data subject has the right to
          obtain human intervention, to express their point of view, and to contest the decision. In
          practical terms, this means that adaptive learning platforms should provide mechanisms for
          teachers to review, override, and adjust AI-generated recommendations.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Building Article 22 compliance into AI classrooms
        </h3>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            <strong>Human oversight</strong> — Teachers must be able to see what the AI has
            recommended and override it. The AI should support teacher decision-making, not replace
            it.
          </li>
          <li>
            <strong>Transparency</strong> — Students and parents should be able to understand why a
            particular learning pathway was recommended. Explainability is both a legal requirement
            and a pedagogical best practice.
          </li>
          <li>
            <strong>Right to contest</strong> — A clear process for students or parents to request
            that an AI-generated decision be reviewed by a human.
          </li>
          <li>
            <strong>No consequential decisions without human review</strong> — AI should not
            autonomously make decisions about streaming, exclusion, or assessment grades.
          </li>
        </ul>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          The AI Act (Regulation (EU) 2024/1689), which entered into force in August 2024, adds
          further obligations. AI systems used in education are classified as high-risk under the AI
          Act, requiring conformity assessments, risk management systems, and human oversight
          mechanisms. The interplay between GDPR and the AI Act makes it essential that education
          institutions assess both regulatory frameworks when adopting AI.
        </p>
      </section>

      {/* ─────────────────── 11. Data Breach Notification ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          11. Data breach notification: the 72-hour rule and education-specific scenarios
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          Under Article 33, a data controller must notify the supervisory authority of a personal
          data breach within 72 hours of becoming aware of it. Where the breach is likely to result
          in a high risk to the rights and freedoms of individuals, the controller must also notify
          the affected data subjects without undue delay.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Common breach scenarios in education
        </h3>

        <ul className="mt-4 list-disc space-y-3 pl-6 text-base text-neutral-700">
          <li>
            <strong>Ransomware attack on school systems</strong> — encrypting student records,
            including SEN data, health records, and academic results.
          </li>
          <li>
            <strong>Phishing attack leading to credential compromise</strong> — an attacker gaining
            access to teacher accounts on an EdTech platform and viewing student data.
          </li>
          <li>
            <strong>Misdirected communication</strong> — an email containing student personal data
            sent to the wrong recipient, or a batch export of student records shared with an
            unauthorised party.
          </li>
          <li>
            <strong>Vendor breach</strong> — a security incident at the EdTech vendor affecting data
            processed on behalf of the school. The vendor must notify the school, which then
            assesses its own notification obligations.
          </li>
          <li>
            <strong>Lost or stolen devices</strong> — a laptop or USB drive containing student data
            left on public transport.
          </li>
        </ul>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          Education-specific considerations
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Breaches involving children's data are treated with heightened seriousness by supervisory
          authorities. A breach affecting thousands of student records — including SEN data, medical
          information, or family circumstances — will almost certainly require individual
          notification and will attract significant regulatory attention. Schools should have a
          breach response plan that includes: internal escalation procedures, vendor notification
          requirements in the DPA, templates for supervisory authority notification, templates for
          data subject notification, and post-incident review processes.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          You can report concerns or incidents directly to us via{" "}
          <Link
            to="/contact"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            our contact page
          </Link>
          .
        </p>
      </section>

      {/* ─────────────────── 12. How Klassruum Handles GDPR ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          12. How Klassruum handles GDPR
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          GDPR compliance is not a feature we bolt on — it is an architectural principle embedded in
          every layer of the Klassruum platform. Here is how we translate the principles above into
          practice.
        </p>

        <div className="mt-6 space-y-4">
          {[
            {
              title: "Encryption at rest and in transit",
              desc: "All personal data is encrypted using AES-256 at rest and TLS 1.3 in transit. Database backups are encrypted. Encryption keys are managed in hardware security modules (HSMs) and are never accessible to application code.",
            },
            {
              title: "EU-only hosting",
              desc: "All data is stored and processed exclusively in EU data centres. We do not use US-based cloud providers for data processing, and we do not transfer data outside the EEA. AI inference is performed within the EU.",
            },
            {
              title: "No model training on user data",
              desc: "Klassruum does not use school, student, or teacher data to train, fine-tune, or improve AI models. This commitment is contractually binding and auditable.",
            },
            {
              title: "Data minimisation by design",
              desc: "We collect only what is necessary for the platform's educational function. We do not track browsing behaviour outside the platform, do not use device fingerprinting, and do not collect biometric data.",
            },
            {
              title: "Comprehensive Data Processing Agreements",
              desc: "Our DPAs are aligned with the European Commission's Standard Contractual Clauses and cover all GDPR-required provisions, including sub-processor transparency, data subject rights support, and breach notification procedures.",
            },
            {
              title: "Support for data subject rights",
              desc: "Schools can export, rectify, or delete student data at any time through our admin dashboard. We support data portability in machine-readable formats and respond to data subject requests within 72 hours.",
            },
            {
              title: "DPIA-ready documentation",
              desc: "We provide detailed technical documentation, data flow maps, and security assessments to support your DPIA process.",
            },
            {
              title: "Teacher oversight of AI decisions",
              desc: "All AI-generated learning pathway recommendations are visible to teachers and can be overridden. No consequential decisions are made without human review.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-5">
              <h4 className="text-base font-semibold text-neutral-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          For full details, review our{" "}
          <Link
            to="/privacy"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            privacy policy
          </Link>
          ,{" "}
          <Link
            to="/terms"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            terms of service
          </Link>
          , and{" "}
          <Link
            to="/data-protection"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            data protection documentation
          </Link>
          .
        </p>
      </section>

      {/* ─────────────────── 13. Vendor Due Diligence Checklist ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          13. Choosing a GDPR-compliant EdTech vendor: due-diligence checklist
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          When evaluating any EdTech platform, use this checklist to assess GDPR compliance. Any
          vendor that cannot answer these questions clearly should be treated with caution.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-neutral-900">Question</th>
                <th className="px-5 py-3 font-semibold text-neutral-900">What to look for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {[
                {
                  q: "Who is the data controller?",
                  a: "Clear identification. If the vendor is a processor, they must provide a compliant DPA.",
                },
                {
                  q: "Where is data stored?",
                  a: "Specific country and data centre, not vague references to 'the cloud'. EU hosting preferred.",
                },
                {
                  q: "Is data transferred outside the EEA?",
                  a: "If yes, what transfer mechanism? SCCs? adequacy decision? supplementary measures?",
                },
                {
                  q: "Is data used for model training?",
                  a: "Must be a clear 'no', contractually guaranteed and auditable.",
                },
                {
                  q: "What sub-processors are used?",
                  a: "Full list with countries, purposes, and DPA status. Right to object to new sub-processors.",
                },
                {
                  q: "How are data subject requests handled?",
                  a: "Export, deletion, and rectification capabilities. Response time commitments.",
                },
                {
                  q: "What encryption is used?",
                  a: "AES-256 at rest, TLS 1.3 in transit. Key management details.",
                },
                {
                  q: "Is there a DPIA?",
                  a: "Vendor should support your DPIA with technical documentation.",
                },
                {
                  q: "What happens on termination?",
                  a: "Data deletion or return within a specified timeframe. Certification of deletion.",
                },
                {
                  q: "Is there breach notification?",
                  a: "Vendor notifies school within 24-48 hours of becoming aware of a breach. Clear escalation path.",
                },
                {
                  q: "How is AI decision-making handled?",
                  a: "Human oversight mechanisms. Explainability. No autonomous consequential decisions.",
                },
                {
                  q: "Are there third-party audits?",
                  a: "SOC 2, ISO 27001, or equivalent certifications. Right to audit.",
                },
              ].map((item, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-5 py-3 font-medium text-neutral-800">{item.q}</td>
                  <td className="px-5 py-3 text-neutral-600">{item.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────────── 14. GDPR and Accessibility ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          14. The intersection of GDPR and accessibility: when data collection enables inclusion
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          GDPR and accessibility are often framed as competing interests — as if collecting data to
          support disabled students conflicts with minimising data collection. In reality, the two
          goals are deeply complementary.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          How data enables accessibility
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          An AI-powered classroom that knows a student has dyslexia can automatically adjust font
          spacing, offer text-to-speech, and simplify sentence structure. A platform that
          understands a student's motor impairment can provide larger click targets and keyboard
          navigation. These accommodations require processing personal data — but the purpose is
          explicitly inclusive.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          The GDPR principle of purpose limitation requires that this data be used only for its
          stated purpose: enabling accessibility. It cannot be repurposed for marketing, profiling,
          or model training. The principle of data minimisation requires that only the accessibility
          data actually needed be collected — not a comprehensive medical history when a preference
          setting suffices.
        </p>

        <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
          The legal basis for accessibility data
        </h3>

        <p className="text-base leading-relaxed text-neutral-700">
          Processing accessibility-related special category data requires an Article 9(2) condition.
          The most relevant are: explicit consent (Article 9(2)(a)), where a parent or guardian
          explicitly consents to the processing of their child's disability data for accessibility
          purposes; and reasons of substantial public interest (Article 9(2)(g)), where national law
          provides a basis for processing disability data in the context of education.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          The responsible approach — and the one Klassruum takes — is to design accessibility
          features that minimise the data required. Preferences can often replace diagnoses. A
          student does not need to disclose a medical diagnosis to have larger fonts enabled. Where
          more detailed data is needed (for example, to provide exam accommodations), it should be
          collected with explicit consent, used only for its stated purpose, and retained only as
          long as necessary.
        </p>

        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          Our{" "}
          <Link
            to="/solutions/schools"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            schools
          </Link>{" "}
          and{" "}
          <Link
            to="/solutions/universities"
            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
          >
            universities
          </Link>{" "}
          solutions are designed with this balance in mind — delivering genuinely inclusive learning
          without unnecessary data collection.
        </p>
      </section>

      {/* ─────────────────── 15. Implementation Checklist ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          15. Practical steps: implementation checklist for school data protection officers
        </h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          If you are a Data Protection Officer, school leader, or IT administrator responsible for
          GDPR compliance in an education setting, use this checklist to audit your current EdTech
          stack and plan improvements.
        </p>

        <div className="mt-6 space-y-3">
          {[
            "Audit your Record of Processing Activities (ROPA). Ensure every EdTech platform is listed with its processing purposes, lawful basis, data categories, recipients, retention periods, and international transfers.",
            "Review all Data Processing Agreements. Confirm DPAs are in place with every EdTech vendor, cover all required GDPR provisions, and are reviewed annually.",
            "Complete a DPIA for AI-powered platforms. Any platform using adaptive learning, automated assessment, or student profiling should be covered by a DPIA.",
            "Verify data minimisation. For each platform, confirm that the data collected is limited to what is necessary for its stated educational purpose.",
            "Confirm data residency. Verify where student data is stored and processed. Flag any non-EEA transfers and ensure appropriate safeguards are in place.",
            "Test data subject rights processes. Can you extract a student's complete data from each platform within one month? Can you delete it? Run a test.",
            "Review consent mechanisms. Where consent is relied upon, confirm it meets GDPR requirements: freely given, specific, informed, and unambiguous. Check that withdrawal is as easy as giving consent.",
            "Assess children's data protections. For platforms used by under-13s, verify that parental consent mechanisms are in place and that age-appropriate design standards are met.",
            "Prepare a breach response plan. Ensure you have a documented plan that covers internal escalation, vendor notification, supervisory authority notification (72-hour window), and data subject notification.",
            "Train staff. Ensure teachers and administrators understand their GDPR obligations, particularly around data minimisation, password security, and recognising phishing attempts.",
            "Schedule annual reviews. GDPR compliance is ongoing, not one-time. Schedule annual reviews of all DPAs, DPIAs, and processing activities.",
            "Document everything. Supervisory authorities assess compliance based on documentation. If it is not documented, it did not happen.",
          ].map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-sky-600 focus:ring-sky-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ─────────────────── Conclusion ─────────────────── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900">Conclusion</h2>

        <p className="text-lg leading-relaxed text-neutral-700">
          GDPR compliance in EdTech is not a constraint on innovation — it is the foundation for
          trustworthy innovation. When institutions understand the regulation, when vendors build
          with privacy by design, and when students and families can trust that their data is
          handled responsibly, everyone benefits. Learning improves. Trust deepens. Innovation
          accelerates — because it is built on solid ground.
        </p>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          The practical steps in this guide — from lawful basis selection to vendor due diligence to
          the implementation checklist — give you the tools to move from theory to action. If you
          have questions, or if you want to understand how Klassruum specifically supports your GDPR
          obligations, our team is ready to help.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            View pricing
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      {/* ─────────────────── Related Content ─────────────────── */}
      <section className="border-t border-neutral-200 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">Related resources</h3>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li>
            <Link
              to="/privacy"
              className="underline decoration-neutral-300 underline-offset-2 hover:text-sky-700"
            >
              Klassruum Privacy Policy
            </Link>{" "}
            — how we collect, use, and protect personal data
          </li>
          <li>
            <Link
              to="/terms"
              className="underline decoration-neutral-300 underline-offset-2 hover:text-sky-700"
            >
              Terms of Service
            </Link>{" "}
            — contractual terms governing your use of the platform
          </li>
          <li>
            <Link
              to="/cookie-policy"
              className="underline decoration-neutral-300 underline-offset-2 hover:text-sky-700"
            >
              Cookie Policy
            </Link>{" "}
            — what cookies we use and why
          </li>
          <li>
            <Link
              to="/data-protection"
              className="underline decoration-neutral-300 underline-offset-2 hover:text-sky-700"
            >
              Data Protection
            </Link>{" "}
            — our technical and organisational security measures
          </li>
          <li>
            <Link
              to="/help"
              className="underline decoration-neutral-300 underline-offset-2 hover:text-sky-700"
            >
              Help Centre
            </Link>{" "}
            — step-by-step guides for data export and deletion
          </li>
        </ul>
      </section>
    </BlogLayout>
  ),
});
