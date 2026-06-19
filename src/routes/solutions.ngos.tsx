import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { Globe, Accessibility, MessageCircle, BarChart3, Handshake, Heart } from "lucide-react";

export const Route = createFileRoute("/solutions/ngos")({
  head: () => ({
    meta: [
      {
        title: "Klassruum for NGOs — Deliver Accessible Education to Underserved Communities",
      },
      {
        name: "description",
        content:
          "Klassruum gives NGOs a cost-effective, accessible classroom platform that works offline, supports multiple languages and disability modes, and delivers measurable learning outcomes in resource-constrained environments.",
      },
      {
        name: "keywords",
        content:
          "NGO education platform, nonprofit learning technology, offline classroom software, accessible education for NGOs, low-bandwidth learning, community education programs, disability-inclusive education, GDPR beneficiary data, capacity building NGOs, education for underserved communities, multilingual classroom platform, NGO edtech discount",
      },
      {
        property: "og:title",
        content: "Klassruum for NGOs — Accessible Education That Reaches Every Learner",
      },
      {
        property: "og:description",
        content:
          "A browser-based classroom platform built for NGOs: works offline, supports learners with disabilities, and delivers measurable outcomes in remote communities.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For NGOs"
      title="Quality teaching that reaches everyone"
      intro="Bring structured, accessible lessons to learners in underserved and remote communities. Klassruum is built to run on modest devices and patchy networks, with accessibility for learners who are too often left out."
      cta={{ label: "Start a programme", to: "/contact" }}
      sections={[
        {
          icon: <Globe size={20} />,
          title: "Reaches remote learners",
          body: "Lightweight and browser-based, designed for low-cost hardware and limited bandwidth.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Inclusion at the core",
          body: "Modes for deaf, low-vision, dyslexia and more open lessons to learners with disabilities.",
        },
        {
          icon: <MessageCircle size={20} />,
          title: "Local relevance",
          body: "Teach from materials and examples that fit the communities you serve.",
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Impact evidence",
          body: "Activity-based progress data helps demonstrate outcomes to funders.",
        },
        {
          icon: <Handshake size={20} />,
          title: "Train local facilitators",
          body: "Facilitators guide groups while the lesson does the structured teaching.",
        },
        {
          icon: <Heart size={20} />,
          title: "Mission-aligned pricing",
          body: "Flexible terms for non-profit and humanitarian programmes.",
        },
      ]}
    >
      {/* ─── What Is Klassruum for NGOs ─────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          What is Klassruum for NGOs?
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Klassruum is a browser-based, AI-assisted classroom platform that enables non-governmental
          organisations to deliver structured, engaging, and accessible education at scale. It was
          built from the ground up for the constraints that NGOs actually face: shared devices with
          limited processing power, intermittent internet connectivity, multilingual learner
          populations, and learners with a wide range of accessibility needs.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Unlike conventional LMS platforms designed for stable corporate or university networks,
          Klassruum works on Android tablets, Chromebooks, and low-end laptops. Its core classroom
          experience runs entirely in the browser, meaning there is no software to install and no
          app store dependency. A facilitator or teacher opens a browser, loads a lesson, and the
          session begins. Learners can join on any device with a modern browser — even a shared
          smartphone.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          For NGOs, this means you can deploy a consistent, structured curriculum across dozens of
          sites without needing dedicated IT infrastructure at each one. Whether you are running
          adult literacy programmes in rural East Africa, vocational training for displaced
          populations in the Middle East, or supplementary schooling for out-of-school children in
          South Asia, Klassruum adapts to your context rather than demanding that your context adapt
          to it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Explore all platform features
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Try the classroom demo
          </Link>
        </div>
      </div>

      {/* ─── Delivering Education in Resource-Constrained Environments ── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Delivering education in resource-constrained environments
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          The global education crisis is not primarily a content crisis — it is an access crisis.
          Over 244 million children and young people worldwide are out of school, and hundreds of
          millions more attend school but receive an education of insufficient quality. NGOs working
          in this space face structural barriers that commercial edtech rarely addresses: unreliable
          electricity, shared devices, learners who speak different languages in the same classroom,
          and facilitators who may not have formal teaching qualifications.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Low-cost hardware, full-featured classroom
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum is deliberately optimised for the hardware your programmes already use. The
          platform loads quickly on devices with as little as 2 GB of RAM. The interface is clean
          and responsive, avoiding the heavy JavaScript bundles that slow down commodity tablets.
          Lessons are designed to function with minimal data transfer — a single session typically
          uses less than 5 MB of bandwidth. This means that even in areas where connectivity is
          limited to a 2G mobile data connection or a shared satellite link, the classroom stays
          functional.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Structured lessons, flexible delivery
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Each lesson follows a clear pedagogical structure: the AI teacher introduces a concept,
          demonstrates it on a shared whiteboard, checks understanding through interactive
          questions, and captures notes automatically. This structure means that even when the
          facilitator is a trained community volunteer rather than a certified teacher, the learner
          experience remains consistent and effective. The facilitator's role is to guide the group,
          manage the physical space, and provide the human support that no technology can replace —
          while the platform handles the content delivery, scaffolding, and assessment.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Offline and low-bandwidth support
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Internet access is not a given in the communities many NGOs serve. Klassruum supports
          offline lesson delivery so that learning does not stop when connectivity drops. Lessons
          can be pre-loaded when a connection is available, and learner progress is recorded
          locally. When the device next connects to the internet — whether that is hours or days
          later — progress syncs automatically to the cloud. This approach eliminates the fragile
          dependency on real-time connectivity that makes most cloud-based platforms unusable in
          rural and displacement settings.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/solutions/schools"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Schools solution
          </Link>
          <Link
            to="/solutions/universities"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Universities solution
          </Link>
          <Link
            to="/solutions/training-providers"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Training providers solution
          </Link>
          <Link
            to="/solutions/online-academies"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Online academies solution
          </Link>
        </div>
      </div>

      {/* ─── Multilingual Accessibility ────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Multilingual and accessibility-first design
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Inclusion is not a feature checkbox — it is a design principle. Many NGO programmes serve
          communities where learners have diverse linguistic backgrounds, varying levels of
          literacy, and a wide range of physical and cognitive abilities. Klassruum is built to meet
          all of these needs within a single platform, rather than requiring separate tools or
          workarounds.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Multilingual classroom experience
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Lessons can be delivered in any language. The AI teacher speaks and captions in the
          language of instruction, and the whiteboard renders text in the correct script and
          direction — whether that is Latin, Arabic, Devanagari, or any other writing system. For
          programmes that serve multilingual populations, such as refugee education where learners
          may speak Somali, Arabic, and Kurdish in the same classroom, Klassruum allows facilitators
          to switch the lesson language mid-session without losing progress or disrupting the
          learner experience.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Disability inclusion modes
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum ships with built-in accessibility modes that adapt the classroom experience for
          learners with specific needs:
        </p>
        <ul className="mt-4 max-w-3xl space-y-3 text-base leading-8 text-body">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Deaf and hard-of-hearing mode:</strong> real-time
              captions for all AI teacher speech, visual indicators for audio cues, and full
              sign-language compatibility with the whiteboard layout.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Low-vision mode:</strong> high contrast colour
              schemes, enlarged text, and screen-reader compatibility for all interactive elements.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Dyslexia-friendly mode:</strong>
              adjusted fonts, spacing, and colour overlays that reduce visual stress and improve
              reading fluency.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Motor accessibility:</strong>
              full keyboard navigation and large tap targets for learners who use assistive devices
              or have limited fine motor control.
            </span>
          </li>
        </ul>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          These modes are not separate product tiers — they are included for every organisation. An
          NGO serving a mixed population of learners with and without disabilities can activate the
          relevant mode for each learner or for the whole group without additional configuration or
          cost. This matters because disability inclusion in education should never be a budget line
          item that competes with other programme needs.
        </p>
        <div className="mt-6">
          <Link
            to="/accessibility"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Learn more about accessibility features
          </Link>
        </div>
      </div>

      {/* ─── Community Education Programmes ────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Supporting community education programmes
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          NGOs operate education programmes across an enormous range of contexts: accelerated
          learning for overage children who missed years of schooling, adult literacy and numeracy,
          vocational skills training, peace education, sexual and reproductive health education, and
          climate literacy, to name a few. Klassruum is designed to support all of these through a
          flexible content model and a facilitator-led pedagogy that works in both formal and
          non-formal settings.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Import your own curriculum
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum does not lock you into a predefined content library. Organisations can import
          their own curriculum materials — PDFs, slide decks, text documents, images, and video —
          and the AI teacher turns them into interactive, whiteboard-driven lessons. This means that
          your organisation retains full control over what is taught and how it is framed. If your
          programme uses locally developed materials in Hausa, Khmer, or Portuguese, those materials
          work natively in the platform. You can also adapt existing open educational resources
          (OER) and restructure them into Klassruum's lesson format, saving weeks of content
          development time.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Facilitator-led, not facilitator-dependent
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Many NGO education programmes rely on community facilitators rather than professionally
          trained teachers. This is a pragmatic reality: there are not enough qualified teachers in
          the regions where the need is greatest. Klassruum addresses this by embedding pedagogical
          structure into the platform itself. The AI teacher guides the lesson through a proven
          sequence — introduction, demonstration, practice, and reflection — while the facilitator
          manages the group, provides encouragement, and intervenes when a learner is struggling.
          This model allows organisations to train facilitators in hours rather than weeks, while
          still delivering a high-quality learning experience.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Group learning on shared devices
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          In many programme settings, devices are shared. A single tablet may serve a group of five
          to fifteen learners. Klassruum's classroom interface is designed for this reality. The AI
          teacher presents content on the shared screen, the facilitator manages discussion and
          participation, and the interactive elements (questions, whiteboard annotations, polls) are
          designed to work in a group setting where learners take turns engaging with the device.
          This is not a compromise — it is a pedagogical choice. Group learning with a facilitator
          often produces better outcomes than isolated device use, particularly for younger learners
          and those with lower baseline literacy.
        </p>
      </div>

      {/* ─── Capacity Building ────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Capacity building and facilitator training
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Technology is only as effective as the people who use it. Klassruum includes a lightweight
          capacity-building programme designed specifically for NGO contexts. The goal is not to
          turn facilitators into software operators — it is to give them the confidence and skills
          to use the platform as a tool for better teaching.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Rapid onboarding
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Most facilitators can be productive on the platform within a single training session. The
          interface is intentionally simple: load a lesson, start the session, manage the group. The
          AI teacher handles content delivery, pacing, and formative assessment. Facilitators learn
          to navigate the lesson library, activate accessibility modes, and interpret basic learner
          progress data. For organisations deploying at scale, Klassruum provides train-the-trainer
          materials that your own programme staff can adapt and deliver in local languages.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">Ongoing support</h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Beyond initial training, Klassruum provides in-platform guidance and a{" "}
          <Link
            to="/help"
            className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
          >
            help centre
          </Link>{" "}
          with articles, videos, and troubleshooting guides. Programme managers can access usage
          dashboards to identify facilitators who may need additional support, and the{" "}
          <Link
            to="/contact"
            className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
          >
            Klassruum team
          </Link>{" "}
          is available for implementation consultations, particularly during the launch phase of a
          new programme.
        </p>
      </div>

      {/* ─── Measuring Impact ─────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Measuring impact and demonstrating outcomes
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Demonstrating impact is not optional for NGOs — it is a requirement. Funders, donors, and
          institutional partners expect evidence that education programmes are producing measurable
          learning outcomes. Klassruum generates this evidence automatically through its
          activity-based progress tracking system.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          What gets tracked
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Every learner interaction on the platform generates structured data. This includes lesson
          completion rates, time-on-task, responses to interactive questions, whiteboard engagement,
          note-taking activity, and progression through curriculum milestones. The system also
          tracks accessibility mode usage, giving organisations evidence on inclusion outcomes. All
          of this data is available through programme-level dashboards that can be filtered by site,
          cohort, learner demographic, and time period.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Reporting for funders
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum's dashboards are designed to speak the language of donors. You can generate
          reports that show learning gain over time, compare outcomes across programme sites, and
          produce the kind of evidence that satisfies both bilateral donors (USAID, DFID, EU DevCo)
          and private foundations. Reports can be exported in standard formats for inclusion in
          grant reports and programme reviews. This eliminates the manual data collection and
          spreadsheet analysis that consumes programme staff time and often produces unreliable
          results.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Data-driven programme improvement
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Impact data is not just for external reporting — it is a tool for programme improvement.
          When you can see that learners in a particular site are struggling with a specific
          concept, or that engagement drops off after a certain lesson length, you can adjust your
          approach. Klassruum gives programme managers the granular data they need to make
          evidence-based decisions about curriculum sequencing, facilitator support, and resource
          allocation — without requiring a dedicated M&E team to process raw data.
        </p>
      </div>

      {/* ─── GDPR and Beneficiary Data Protection ─────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          GDPR compliance and beneficiary data protection
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          NGOs that serve vulnerable populations — refugees, displaced persons, minors, survivors of
          conflict — have an elevated duty of care when it comes to data protection. A data breach
          at an education programme is not an inconvenience; it can put lives at risk. Klassruum
          takes this responsibility seriously and has been designed with data protection as a
          foundational requirement, not an afterthought.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          How Klassruum protects beneficiary data
        </h3>
        <ul className="mt-4 max-w-3xl space-y-3 text-base leading-8 text-body">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Minimal data collection:</strong> the platform
              collects only the data necessary for educational delivery and progress tracking. No
              unnecessary personal information is gathered.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Encryption at rest and in transit:</strong> all
              learner data is encrypted using industry-standard AES-256 encryption at rest and TLS
              1.3 in transit.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Role-based access control:</strong> facilitators see
              only the data relevant to their groups. Programme managers see aggregated data.
              Individual learner data is restricted to authorised staff with a documented need.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Data portability and deletion:</strong> organisations
              can export all programme data at any time and request complete deletion of beneficiary
              data in line with GDPR Article 17 (right to erasure).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              <strong className="text-heading">Data processing agreements:</strong> Klassruum
              provides standard Data Processing Agreements (DPAs) that meet GDPR Article 28
              requirements, suitable for inclusion in your donor compliance documentation.
            </span>
          </li>
        </ul>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          For organisations working under specific national data protection frameworks (such as
          Kenya's Data Protection Act 2019 or Nigeria's NDPR), Klassruum's data practices are
          designed to be compatible with these regulations as well. If your programme operates in a
          jurisdiction with specific requirements, our team can work with you to ensure
          configuration aligns with your compliance obligations.
        </p>
        <div className="mt-6">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Read our full privacy policy
          </Link>
        </div>
      </div>

      {/* ─── Cost-Effective Scaling ───────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Cost-effective scaling across programmes and geographies
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          NGOs rarely have the luxury of unlimited budgets. Every dollar spent on technology
          infrastructure is a dollar not spent on direct service delivery. Klassruum is designed to
          maximise the educational impact per dollar spent on technology, and to scale efficiently
          as programmes grow.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          No per-learner licensing
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Many edtech platforms charge per learner per month. This pricing model penalises NGOs for
          success — the more learners you reach, the more you pay. Klassruum uses a different
          approach. Pricing is structured around programme scope and organisation size, not
          individual learner counts. This means you can scale from 50 learners to 5,000 without
          watching your licence costs spiral. It also means you do not have to make difficult
          decisions about which learners to count and which to exclude from your platform
          deployment.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Shared infrastructure, dedicated support
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum runs on shared cloud infrastructure, which keeps costs low while maintaining
          enterprise-grade reliability and security. Your data is logically isolated from other
          organisations, and your programme has dedicated support from the Klassruum team. As you
          expand to new sites or new countries, the platform scales with you — there is no
          additional infrastructure to procure, no new servers to configure, no new software to
          install.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Reuse and adapt across programmes
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Curriculum materials created in Klassruum are reusable. If you develop a nutrition
          education module for one programme in Kenya, you can adapt and redeploy it for a similar
          programme in Tanzania with minimal effort. This reduces duplication of effort across your
          organisation and ensures that successful content development investments pay dividends
          across multiple programmes and years.
        </p>
      </div>

      {/* ─── Partnerships ─────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Partnerships and collaboration
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Klassruum is not a standalone product in isolation. We actively seek partnerships with
          NGOs, INGOs, government education agencies, multilateral organisations, and technology
          providers to expand the reach and impact of the platform. Our partnership model is
          designed to be flexible and responsive to the needs of each organisation.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Implementation partnerships
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          For organisations launching new education programmes, Klassruum offers implementation
          partnership arrangements. This includes co-design of the deployment plan, facilitator
          training, curriculum integration support, and ongoing technical assistance during the
          critical first months of a programme. We have found that organisations that receive
          structured implementation support in the first three months achieve significantly higher
          adoption rates and better learning outcomes than those left to self-deploy.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Research and evaluation partnerships
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          We collaborate with academic institutions and research organisations to evaluate the
          impact of Klassruum-supported education programmes. These partnerships produce independent
          evidence on effectiveness, which benefits both the participating NGO (through credible
          impact evidence) and the broader education sector (through published research). If your
          organisation is interested in rigorous evaluation of your programme outcomes, we can help
          design the data collection framework and provide platform data to support the analysis.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Technology and content partnerships
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-8 text-body">
          Klassruum integrates with the tools and content ecosystems that NGOs already use. We
          support integration with common student information systems, single sign-on providers, and
          content repositories. We also work with open educational resource providers to ensure that
          high-quality openly licensed content is available within the platform. If your
          organisation has specific integration needs, the{" "}
          <Link
            to="/contact"
            className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
          >
            Klassruum team
          </Link>{" "}
          can discuss bespoke arrangements.
        </p>
      </div>

      {/* ─── Pricing with NGO Discounts ──────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Mission-aligned pricing with NGO discounts
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Klassruum offers dedicated pricing for non-profit organisations, humanitarian agencies,
          and government-funded education programmes. We understand that NGO budgets are
          constrained, often funded by grants with strict cost ceilings, and subject to audit
          requirements. Our pricing is transparent, predictable, and designed to work within these
          realities.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          What the NGO pricing includes
        </h3>
        <ul className="mt-4 max-w-3xl space-y-3 text-base leading-8 text-body">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              Full access to the platform, including all accessibility modes, AI teacher,
              whiteboard, progress tracking, and facilitator tools.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>
              Unlimited lessons and learners within your programme scope — no per-learner charges.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>Implementation support and facilitator training for new programmes.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>Ongoing technical support and platform updates.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-education-green" />
            <span>Data processing agreements and GDPR compliance documentation.</span>
          </li>
        </ul>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          We also offer multi-year pricing for organisations that can commit to longer programme
          horizons, which further reduces the annual cost. For smaller organisations or pilot
          programmes, we offer entry-level pricing that scales up as your programme grows.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            View full pricing plans
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Contact sales for NGO pricing
          </Link>
        </div>
      </div>

      {/* ─── Getting Started ──────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Getting started with Klassruum
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-body">
          Launching a Klassruum-powered education programme is straightforward. Here is the typical
          process from initial conversation to first classroom session:
        </p>
        <ol className="mt-4 max-w-3xl space-y-4 text-base leading-8 text-body">
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-education-green text-xs font-bold text-white">
              1
            </span>
            <span>
              <strong className="text-heading">Discovery call:</strong> we discuss your programme
              context, learner population, device environment, connectivity constraints, and
              curriculum needs. This typically takes 30 to 45 minutes.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-education-green text-xs font-bold text-white">
              2
            </span>
            <span>
              <strong className="text-heading">Pilot planning:</strong> we agree on a pilot scope —
              typically one site, 20 to 50 learners, and a 4 to 6 week timeframe. We configure your
              Klassruum environment and upload your initial curriculum materials.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-education-green text-xs font-bold text-white">
              3
            </span>
            <span>
              <strong className="text-heading">Facilitator training:</strong> your facilitators
              receive hands-on training, either in person or remotely. Most facilitators are
              comfortable with the platform after a single session.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-education-green text-xs font-bold text-white">
              4
            </span>
            <span>
              <strong className="text-heading">Pilot delivery:</strong> the programme runs its
              pilot. The Klassruum team provides active support during this phase, troubleshooting
              issues and helping refine the deployment approach.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-education-green text-xs font-bold text-white">
              5
            </span>
            <span>
              <strong className="text-heading">Review and scale:</strong> at the end of the pilot,
              we review outcomes data together and plan the scale-up to additional sites and larger
              learner populations.
            </span>
          </li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Try the classroom demo first
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-learning-blue transition-colors hover:bg-soft-blue"
          >
            Book a discovery call
          </Link>
        </div>
      </div>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              Can Klassruum work without internet?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Yes. Klassruum supports offline lesson delivery. Facilitators can pre-load lessons
              when a connection is available, and learner progress is recorded locally on the
              device. When connectivity resumes, progress syncs automatically to the cloud. This
              makes the platform viable in areas with intermittent or no internet access.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              What devices are supported?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Any device with a modern web browser. This includes Android tablets, Chromebooks,
              Windows and macOS laptops, and iOS devices. The platform is optimised for low-cost
              Android tablets and performs well on devices with as little as 2 GB of RAM. No app
              installation is required.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              How does the AI teacher work?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              The AI teacher is a structured lesson delivery system built into the classroom. It
              follows a pedagogical sequence — concept introduction, demonstration on the
              whiteboard, interactive practice, and reflection. It speaks, captions, and adapts to
              the selected language. It is not a general-purpose chatbot; it is specifically
              designed for structured educational delivery.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              Can we use our own curriculum materials?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Absolutely. Klassruum allows you to import your own curriculum materials in multiple
              formats. The AI teacher adapts these materials into interactive lessons. You retain
              full control over content and can modify, update, or replace materials at any time.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              Is Klassruum GDPR compliant?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Yes. Klassruum is designed with GDPR compliance as a foundational requirement. We
              provide Data Processing Agreements, encryption at rest and in transit, role-based
              access control, and full data portability and deletion capabilities. For organisations
              working under other data protection frameworks, our team can help ensure configuration
              aligns with your specific compliance obligations.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              What accessibility features are included?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Klassruum includes built-in modes for deaf and hard-of-hearing learners, low-vision
              learners, learners with dyslexia, and learners with motor accessibility needs. These
              modes are included for all organisations at no additional cost. You can read more on
              our{" "}
              <Link
                to="/accessibility"
                className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
              >
                accessibility features page
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              How much does it cost for NGOs?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Klassruum offers dedicated pricing for non-profit organisations that is significantly
              below commercial rates. Pricing is structured around programme scope, not per-learner
              counts, so your costs remain predictable as you scale. Multi-year commitments receive
              additional discounts. Visit our{" "}
              <Link
                to="/pricing"
                className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
              >
                pricing page
              </Link>{" "}
              for details, or{" "}
              <Link
                to="/contact"
                className="font-semibold text-learning-blue underline decoration-learning-blue/30 underline-offset-2 transition-colors hover:text-heading"
              >
                contact us
              </Link>{" "}
              for a tailored quote.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-heading">
              Can we pilot before committing?
            </h3>
            <p className="mt-3 text-base leading-8 text-body">
              Yes. We encourage all NGO partners to run a pilot before full deployment. A typical
              pilot runs 4 to 6 weeks with 20 to 50 learners at one site. The pilot includes
              implementation support, facilitator training, and a structured review at the end. This
              gives you evidence-based confidence that Klassruum works for your specific context
              before you commit to a larger rollout.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Final CTA ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-heading p-8 text-center sm:p-12">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Ready to reach more learners?
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base leading-8 text-white/70">
          Whether you are launching a new programme or looking to improve outcomes in an existing
          one, Klassruum gives you the tools to deliver quality, accessible education at scale. Talk
          to us about your programme needs.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-education-green px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-education-green/90"
          >
            Contact sales
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
          >
            Try the classroom demo
          </Link>
        </div>
      </div>
    </InfoPage>
  ),
});
