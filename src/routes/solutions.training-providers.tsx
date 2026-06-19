import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { Package, CheckCircle, Puzzle, ScrollText, Accessibility, Zap } from "lucide-react";

export const Route = createFileRoute("/solutions/training-providers")({
  head: () => ({
    meta: [
      {
        title:
          "Klassruum for Training Providers — Consistent Corporate Training & Compliance Delivery",
      },
      {
        name: "description",
        content:
          "Turn your courseware into interactive, teacher-led lessons for professional and vocational training. Klassruum delivers consistent, certifiable training at scale with built-in compliance tracking, accessibility, and measurable outcomes.",
      },
      {
        name: "keywords",
        content:
          "training providers, corporate training, compliance training, certification courses, workforce training platform, LMS alternative, interactive training delivery, training content authoring, professional development, vocational training, GDPR compliant training, accessibility training platform, ROI training measurement",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Training Providers"
      title="Consistent, engaging training at scale"
      intro="Convert your courseware into interactive, teacher-led lessons that every cohort experiences the same way. Ideal for professional, vocational and compliance training where consistency and completion matter."
      cta={{ label: "Request a walkthrough", to: "/contact" }}
      sections={[
        {
          icon: <Package size={20} />,
          title: "Your content, taught",
          body: "Bring your existing material and let Klassruum deliver it as a structured, spoken lesson.",
        },
        {
          icon: <CheckCircle size={20} />,
          title: "Consistent delivery",
          body: "Every trainee gets the same accurate, well-paced session — no variability between instructors.",
        },
        {
          icon: <Puzzle size={20} />,
          title: "Practice & checks",
          body: "Built-in worked examples and understanding checks reinforce learning as it happens.",
        },
        {
          icon: <ScrollText size={20} />,
          title: "Completion evidence",
          body: "Track participation and practice to support certificates and compliance records.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Accessible to all staff",
          body: "Captions, audio and learning modes make training inclusive across your workforce.",
        },
        {
          icon: <Zap size={20} />,
          title: "Fast to launch",
          body: "Stand up new courses quickly without rebuilding your delivery from scratch.",
        },
      ]}
    >
      {/* ──────────────────────────────────────────────────────────────────
          SEO CONTENT — 3000+ words of genuine, structured content
          ────────────────────────────────────────────────────────────────── */}

      {/* ── 1. What Is Klassruum for Training Providers? ── */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          What Is Klassruum for Training Providers?
        </h2>
        <p className="text-base leading-relaxed text-body">
          Klassruum is a purpose-built learning platform that transforms existing training materials
          — slide decks, documents, videos, and structured outlines — into interactive, teacher-led
          lessons delivered by an AI instructor. Designed specifically for{" "}
          <strong className="font-semibold text-heading">
            training providers, workforce development teams, and compliance organisations
          </strong>
          , it eliminates the variability that undermines large-scale training programmes while
          drastically reducing the time and cost required to produce new courses.
        </p>
        <p className="text-base leading-relaxed text-body">
          Unlike a traditional learning management system that simply hosts static content,
          Klassruum actively teaches. Every session includes a live AI-driven presentation with
          real-time narration, a shared whiteboard, captioning, and embedded knowledge checks.
          Trainees experience the same high-quality lesson regardless of whether they join the
          Monday cohort or the Friday session, at headquarters or working remotely. That consistency
          is what makes training certifiable, auditable, and defensible.
        </p>
        <p className="text-base leading-relaxed text-body">
          For organisations that need to onboard hundreds or thousands of employees, re-certify an
          existing workforce on new regulations, or deliver vocational qualifications across
          dispersed sites, Klassruum provides a scalable delivery mechanism without sacrificing the
          pedagogical quality that classroom instruction provides. You can learn more about the
          underlying technology on our{" "}
          <Link
            to="/features"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            platform features
          </Link>{" "}
          page.
        </p>
      </div>

      {/* ── 2. Corporate Training Delivery ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Corporate Training Delivery at Scale
        </h2>
        <p className="text-base leading-relaxed text-body">
          Delivering training across a large, geographically dispersed workforce is one of the most
          persistent challenges for training providers. Traditional approaches rely on a network of
          individual facilitators, each bringing their own interpretation, pacing, and emphasis to
          the same curriculum. The result is inconsistent learning experiences, variable completion
          rates, and difficulty demonstrating that every employee received equivalent instruction.
        </p>
        <p className="text-base leading-relaxed text-body">
          Klassruum solves this by standardising the delivery layer while preserving the
          interactive, human-like quality that makes training effective. When a training provider
          uploads a course to Klassruum, the platform becomes the instructor. It narrates content
          with appropriate pacing, draws diagrams on a shared whiteboard, pauses for embedded
          practice questions, and adapts the flow based on learner engagement. Whether you are
          onboarding 50 new hires or rolling out a mandatory compliance update to 10,000 staff,
          every individual receives an identical learning experience.
        </p>
        <p className="text-base leading-relaxed text-body">
          This model is particularly valuable for organisations that operate across multiple time
          zones, shifts, or sites. Rather than scheduling dozens of live facilitator sessions and
          hoping for consistent quality, training managers can deploy a single Klassruum course and
          let employees complete it whenever and wherever suits their schedule — without
          compromising on fidelity. The platform handles large concurrent audiences without
          performance degradation, making it a practical solution for enterprise-wide training
          rollouts.
        </p>
      </div>

      {/* ── 3. Compliance Training ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Compliance Training That Meets Regulatory Standards
        </h2>
        <p className="text-base leading-relaxed text-body">
          Compliance training is arguably the highest-stakes category in professional development.
          Regulators, auditors, and clients expect demonstrable evidence that every employee has
          received specific training — not just that a course was available, but that it was
          completed, understood, and applied. Klassruum is engineered to support exactly this level
          of accountability.
        </p>
        <p className="text-base leading-relaxed text-body">
          Every lesson delivered through Klassruum produces a detailed activity record.
          Participation timestamps, section completion, practice question responses, and session
          notes are all logged automatically. This creates a verifiable audit trail that training
          providers can present to regulators, clients, or internal compliance teams. When a
          question arises about whether a particular employee received specific health and safety,
          data protection, or industry-specific training, the evidence is immediately available.
        </p>
        <p className="text-base leading-relaxed text-body">
          For industries where compliance requirements change frequently — such as financial
          services, healthcare, or construction — Klassruum enables rapid re-certification. When
          regulations change, training providers can update the source material and push a revised
          course to the entire workforce in days rather than weeks. Built-in understanding checks
          ensure that trainees are not merely present but are absorbing and retaining the critical
          information. Our{" "}
          <Link
            to="/pricing"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            pricing plans
          </Link>{" "}
          include options suitable for organisations of varying compliance training intensity.
        </p>
      </div>

      {/* ── 4. Certification Workflows ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Certification Workflows and Credentialing
        </h2>
        <p className="text-base leading-relaxed text-body">
          Many training providers operate within certification frameworks that require learners to
          complete specific modules, pass assessments, and demonstrate competency before credentials
          are issued. Klassruum supports these workflows natively. Course structures can be divided
          into discrete modules, each with its own content, practice checkpoints, and completion
          criteria.
        </p>
        <p className="text-base leading-relaxed text-body">
          As trainees progress through a certification programme, the platform tracks which modules
          have been completed, what scores were achieved on embedded assessments, and how much time
          was spent on each section. Training providers can configure pass thresholds, mandatory
          review points, and sequential module dependencies to match the requirements of any
          certification body.
        </p>
        <p className="text-base leading-relaxed text-body">
          This structured approach means that certification evidence is not assembled after the fact
          from disparate systems. It is generated automatically during the learning process itself.
          When it is time to issue or renew a credential, the training provider has all the data
          needed to justify the decision. This reduces administrative burden, eliminates the risk of
          missing records, and ensures that certified individuals have genuinely engaged with the
          material — not just clicked through a slideshow.
        </p>
      </div>

      {/* ── 5. Multi-Tenant Organisations ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Multi-Tenant and Multi-Department Configuration
        </h2>
        <p className="text-base leading-relaxed text-body">
          Training providers rarely serve a single, monolithic client. Corporate customers typically
          have multiple divisions, regional offices, or subsidiary brands — each with its own
          training requirements, branding expectations, and access controls. Klassruum is designed
          to handle this complexity through multi-tenant architecture.
        </p>
        <p className="text-base leading-relaxed text-body">
          A training provider can create isolated environments for each client organisation or
          department. Each tenant has its own course library, learner cohorts, and reporting
          dashboards, ensuring that sensitive performance data is not visible across organisational
          boundaries. Course content can be shared across tenants where appropriate — for instance,
          a standardised health and safety module that every division must complete — while allowing
          each tenant to maintain its own customised content for role-specific or site-specific
          training.
        </p>
        <p className="text-base leading-relaxed text-body">
          This model also supports branding and white-labelling. Training providers who deliver
          courses on behalf of their clients can configure each tenant with the client's own visual
          identity, creating a seamless experience that reinforces the client relationship. For
          large training organisations managing dozens of client accounts, this eliminates the
          overhead of maintaining separate platform instances while still delivering the tailored
          experience each client expects.
        </p>
      </div>

      {/* ── 6. Content Authoring from Existing Materials ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Content Authoring from Your Existing Materials
        </h2>
        <p className="text-base leading-relaxed text-body">
          One of the most significant barriers to adopting a new training platform is the cost and
          effort of content creation. Training providers invest heavily in developing courseware —
          often over months or years — and those materials represent substantial intellectual
          property. Klassruum is designed to work with your existing content, not replace it.
        </p>
        <p className="text-base leading-relaxed text-body">
          The platform accepts a wide range of input formats: slide decks, PDFs, Word documents,
          structured outlines, video files, and structured data. Rather than requiring a complete
          rebuild, Klassruum ingests your material and transforms it into an interactive, narrated
          lesson. The AI instructor presents the content in logical sequence, annotates key points
          on the whiteboard, and weaves in practice exercises at appropriate intervals.
        </p>
        <p className="text-base leading-relaxed text-body">
          This approach preserves your investment in existing content while dramatically expanding
          how it can be delivered. A slide deck that was previously handed to individual
          facilitators — each interpreting it differently — can now be converted into a standardised
          lesson that maintains fidelity to the original design. Training providers can also iterate
          on their content over time, updating the source material and having changes reflected in
          the delivered lesson without any additional production work. If you would like to see how
          content transformation works in practice, try our{" "}
          <Link
            to="/demo/classroom"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            classroom demo
          </Link>
          .
        </p>
      </div>

      {/* ── 7. Measurable Learning Outcomes ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Measurable Learning Outcomes
        </h2>
        <p className="text-base leading-relaxed text-body">
          Training without measurement is an expense. Training with measurement is an investment.
          Klassruum provides granular analytics that allow training providers and their clients to
          evaluate the effectiveness of every course, module, and session.
        </p>
        <p className="text-base leading-relaxed text-body">
          At the session level, training providers can review completion rates, time-on-task,
          practice question accuracy, and engagement patterns. At the cohort level, they can compare
          performance across groups, identify struggling learners, and spot content sections that
          consistently produce confusion. At the programme level, they can track long-term trends —
          are compliance re-certification rates improving? Are new hires reaching competency faster
          than previous cohorts? Are specific departments consistently underperforming on particular
          modules?
        </p>
        <p className="text-base leading-relaxed text-body">
          These insights transform training from a cost centre into a measurable driver of
          organisational performance. Training providers who can present data-backed evidence of
          their impact — not just completion certificates, but actual learning outcomes —
          differentiate themselves in a competitive market. Klassruum gives you the data to make
          that case convincingly.
        </p>
      </div>

      {/* ── 8. Scalability for Large Workforces ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Scalability for Large Workforces
        </h2>
        <p className="text-base leading-relaxed text-body">
          Scaling training delivery is not simply about running more sessions. It is about
          maintaining quality, consistency, and measurability as volume increases. Traditional
          instructor-led training does not scale linearly — every additional cohort requires another
          facilitator, another venue booking, and another opportunity for quality to drift.
        </p>
        <p className="text-base leading-relaxed text-body">
          Klassruum decouples training quality from facilitator availability. Because the AI
          instructor delivers the same lesson with the same fidelity regardless of how many people
          are enrolled, scaling is a matter of provisioning additional access — not recruiting and
          training additional staff. A course created once can serve ten learners or ten thousand
          without modification.
        </p>
        <p className="text-base leading-relaxed text-body">
          This is particularly valuable for training providers who serve organisations undergoing
          rapid growth, seasonal hiring surges, or large-scale regulatory change. When a new
          regulation requires training for every employee across a national or multinational
          operation, Klassruum can deliver that training in days, with full tracking and compliance
          evidence, without the logistical complexity of scheduling thousands of live sessions. For
          pricing suited to large-scale deployments, see our{" "}
          <Link
            to="/pricing"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            pricing plans
          </Link>
          .
        </p>
      </div>

      {/* ── 9. Accessibility and Inclusion ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Accessibility and Inclusion by Design
        </h2>
        <p className="text-base leading-relaxed text-body">
          Training providers have both a legal and ethical obligation to ensure that their
          programmes are accessible to all learners, including those with visual, auditory,
          cognitive, or motor impairments. Klassruum treats accessibility as a core requirement, not
          an afterthought.
        </p>
        <p className="text-base leading-relaxed text-body">
          Every lesson includes real-time captions, making content accessible to deaf and
          hard-of-hearing learners without any additional configuration. Audio narration is
          available for learners with visual impairments or reading difficulties. Multiple learning
          modes allow individuals to engage with content in the way that works best for them —
          whether that means following along visually, listening to narration, reading transcript
          text, or interacting with the whiteboard.
        </p>
        <p className="text-base leading-relaxed text-body">
          This is not limited to compliance with accessibility legislation such as the Equality Act
          or ADA. Inclusive training design produces better outcomes for everyone. Learners who can
          choose how they engage with content retain more information and complete courses at higher
          rates. Training providers who demonstrably prioritise accessibility also strengthen their
          position when bidding for public sector contracts, where accessibility requirements are
          typically mandatory. Learn more about our comprehensive{" "}
          <Link
            to="/accessibility"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            accessibility features
          </Link>
          .
        </p>
      </div>

      {/* ── 10. GDPR Compliance and Data Protection ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          GDPR Compliance and Data Protection
        </h2>
        <p className="text-base leading-relaxed text-body">
          Training data is personal data. Learner progress, assessment scores, completion records,
          and session activity all constitute information about identifiable individuals. Training
          providers operate under strict obligations to handle this data responsibly, and their
          clients — particularly those in regulated industries — expect assurances about how
          training records are stored, processed, and retained.
        </p>
        <p className="text-base leading-relaxed text-body">
          Klassruum is built with GDPR compliance as a foundational principle. Data processing is
          transparent and purpose-limited: learner information is used solely to deliver training,
          track completion, and generate the reports that training providers and their clients
          require. Data is not shared with third parties for marketing or analytics purposes.
          Retention policies are configurable, allowing training providers to align data lifecycle
          management with their clients' own data protection requirements and contractual
          obligations.
        </p>
        <p className="text-base leading-relaxed text-body">
          Multi-tenant data isolation ensures that information belonging to one client organisation
          is never accessible to another. Audit logs record who accessed what data and when,
          supporting accountability and incident investigation. For training providers who serve
          clients in the public sector or handle sensitive personal data (such as health information
          in occupational training), these controls are not optional — they are prerequisites. Our
          full{" "}
          <Link
            to="/privacy"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            data protection policy
          </Link>{" "}
          details how Klassruum handles personal data.
        </p>
      </div>

      {/* ── 11. ROI and Business Value ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Measuring ROI and Demonstrating Business Value
        </h2>
        <p className="text-base leading-relaxed text-body">
          Training providers who can quantify their impact win more contracts, retain more clients,
          and justify higher investment in their own capabilities. Klassruum provides the data
          infrastructure to make this possible, transforming training from a cost centre into a
          measurable contributor to organisational performance.
        </p>
        <p className="text-base leading-relaxed text-body">
          The platform tracks not just completion but comprehension. By measuring practice question
          performance, time-to-competency, and knowledge retention over time, training providers can
          demonstrate that their programmes produce genuine learning — not just attendance. This
          data can be presented to clients as evidence of return on investment: fewer compliance
          incidents, faster onboarding, improved employee performance, and reduced need for remedial
          training.
        </p>
        <p className="text-base leading-relaxed text-body">
          For training providers operating on a commercial model, this data also supports upselling.
          When a client can see that their sales team completed a product knowledge course with an
          average assessment score of 87% and that the cohort showed measurable improvement in
          customer interactions, the value of the next training engagement is self-evident.
          Klassruum makes it straightforward to generate the reports that support these
          conversations, turning your delivery data into a business development asset.
        </p>
      </div>

      {/* ── 12. How It Compares to Traditional Approaches ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          How Klassruum Compares to Traditional Training Delivery
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-bold text-heading">Capability</th>
                <th className="py-3 pr-4 font-bold text-heading">Traditional LMS</th>
                <th className="py-3 font-bold text-heading">Klassruum</th>
              </tr>
            </thead>
            <tbody className="text-body">
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Delivery format</td>
                <td className="py-3 pr-4">
                  Static slides, PDFs, or video hosted for self-paced access
                </td>
                <td className="py-3">
                  Live AI-led narrated lessons with whiteboard and interaction
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Consistency across cohorts</td>
                <td className="py-3 pr-4">Variable — depends on each learner's engagement</td>
                <td className="py-3">Identical delivery regardless of cohort or timing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Built-in comprehension checks</td>
                <td className="py-3 pr-4">Optional add-ons, often disconnected from content</td>
                <td className="py-3">
                  Embedded in the lesson flow at pedagogically appropriate points
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Accessibility</td>
                <td className="py-3 pr-4">
                  Varies by content type; often requires separate accommodations
                </td>
                <td className="py-3">Captions, audio, and multi-mode access as standard</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Audit trail quality</td>
                <td className="py-3 pr-4">Typically limited to login and completion records</td>
                <td className="py-3">Granular activity, progress, and assessment data</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Time to deploy new content</td>
                <td className="py-3 pr-4">Weeks for video production or facilitator briefing</td>
                <td className="py-3">Days from upload to live delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 13. Industry Use Cases ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">Industry Use Cases</h2>
        <p className="text-base leading-relaxed text-body">
          Klassruum serves training providers across a wide range of sectors. While the platform is
          flexible enough to support virtually any structured training programme, certain industries
          have found particularly strong alignment with its capabilities:
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Health and Safety</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Mandatory safety briefings, risk assessment training, and emergency procedure reviews
              delivered consistently across every site, shift, and role — with compliance records to
              match.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Financial Services Compliance</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Anti-money laundering, data protection, and regulatory awareness training with
              built-in assessment and audit evidence to satisfy FCA and PRA requirements.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">IT and Cyber Security</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Phishing awareness, GDPR data handling, and secure development practices delivered
              with scenario-based exercises that simulate real-world decision points.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">
              Professional and Vocational Qualifications
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Structured modules with sequential progression, knowledge checkpoints, and competency
              evidence to support certification pathways.
            </p>
          </div>
        </div>
      </div>

      {/* ── 14. Pricing Overview ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">Pricing Overview</h2>
        <p className="text-base leading-relaxed text-body">
          Klassruum offers pricing designed to be transparent and predictable. Training providers
          can start with a plan that matches their current scale and expand as their delivery grows
          — without unexpected cost jumps or hidden per-learner fees. Plans are structured to
          support both small specialist training firms and large multi-tenant operations managing
          programmes for enterprise clients.
        </p>
        <p className="text-base leading-relaxed text-body">
          For organisations with specific requirements — such as private cloud deployment, dedicated
          support agreements, or custom integration with existing systems — tailored enterprise
          plans are available on request. Our goal is to ensure that pricing reflects the value
          delivered, not arbitrary usage thresholds. Full pricing details, including a comparison of
          included features across each tier, are available on our{" "}
          <Link
            to="/pricing"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            pricing page
          </Link>
          . Alternatively,{" "}
          <Link
            to="/contact"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            contact our sales team
          </Link>{" "}
          for a bespoke quote tailored to your organisation's needs.
        </p>
      </div>

      {/* ── 15. Getting Started ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Getting Started with Klassruum
        </h2>
        <p className="text-base leading-relaxed text-body">
          Adopting a new training platform does not need to be a months-long project. Klassruum is
          designed for rapid deployment: training providers can typically go from initial
          conversation to a live pilot course within a matter of days.
        </p>
        <p className="text-base leading-relaxed text-body">
          The process begins with understanding your training objectives, audience size, and
          existing content. From there, we work with you to structure your first course, configure
          any tenant-level settings such as branding or access controls, and launch a pilot cohort.
          The pilot allows you to validate the experience with a representative group of learners
          before committing to a full rollout.
        </p>
        <p className="text-base leading-relaxed text-body">
          Throughout the pilot, our team provides hands-on support — from content optimisation to
          learner onboarding guidance — ensuring that your first deployment sets the standard for
          everything that follows. Once the pilot is complete and the results are validated, scaling
          to your full audience is a configuration change, not a new project. We also maintain a{" "}
          <Link
            to="/help"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            help centre
          </Link>{" "}
          with guides, tutorials, and best practices to support your team between engagements.
        </p>
      </div>

      {/* ── 16. Related Solutions ── */}
      <div className="mt-12 space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-heading">Related Solutions</h2>
        <p className="text-base leading-relaxed text-body">
          Klassruum is used by a wide range of organisations. If you also serve clients in these
          sectors, you may find it useful to review how Klassruum addresses their specific
          requirements:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/solutions/schools"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-page-background-alt"
          >
            Klassruum for Schools
          </Link>
          <Link
            to="/solutions/universities"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-page-background-alt"
          >
            Klassruum for Universities
          </Link>
          <Link
            to="/solutions/ngos"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-page-background-alt"
          >
            Klassruum for NGOs
          </Link>
          <Link
            to="/solutions/online-academies"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-page-background-alt"
          >
            Klassruum for Online Academies
          </Link>
        </div>
      </div>

      {/* ── 17. Frequently Asked Questions ── */}
      <div className="mt-12 space-y-6">
        <h2 className="text-3xl font-black tracking-tight text-heading">
          Frequently Asked Questions
        </h2>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            Can I use my existing course materials with Klassruum?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Yes. Klassruum accepts slide decks, PDFs, Word documents, video files, and structured
            outlines. You do not need to rebuild your content from scratch — the platform transforms
            your existing materials into interactive, narrated lessons. If your content is
            well-structured, the transformation is fast and the results faithfully reflect your
            original design.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            How does Klassruum handle compliance training records?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Every lesson generates a detailed activity record including participation timestamps,
            section completion, practice question responses, and session notes. These records are
            retained according to your configured retention policies and can be exported or accessed
            via API for integration with your existing compliance management systems. This creates a
            verifiable audit trail that satisfies regulatory and client requirements.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            Can different client organisations be kept separate?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Absolutely. Klassruum's multi-tenant architecture ensures that each client organisation
            or department operates in an isolated environment with its own courses, learners, and
            reporting. Performance data is not visible across tenants, and you can optionally apply
            client-specific branding to each environment. This is standard for training providers
            managing multiple accounts.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            Is Klassruum accessible to learners with disabilities?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Accessibility is a core design principle. Every lesson includes real-time captions and
            audio narration. Multiple learning modes allow individuals to engage visually,
            auditorily, or through text-based interaction. The platform is designed to meet
            accessibility requirements across public and private sector clients. Full details are
            available on our{" "}
            <Link
              to="/accessibility"
              className="font-semibold text-academic-blue underline-offset-2 hover:underline"
            >
              accessibility features
            </Link>{" "}
            page.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            How quickly can we launch a new course?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Most training providers can go from uploaded content to a live course within days, not
            weeks. The process involves uploading your source material, reviewing the AI-generated
            lesson structure, making any adjustments, and launching to a pilot cohort. Full-scale
            rollout is then a matter of provisioning access to the wider audience.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            Is my data GDPR compliant?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Klassruum is built with GDPR compliance as a foundational principle. Learner data is
            used solely for training delivery and reporting. Data is not shared with third parties
            for marketing purposes. Retention policies are configurable, tenant data is isolated,
            and audit logs track all access. Full details are in our{" "}
            <Link
              to="/privacy"
              className="font-semibold text-academic-blue underline-offset-2 hover:underline"
            >
              data protection policy
            </Link>
            .
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            Can Klassruum integrate with our existing LMS or HR system?
          </summary>
          <p className="text-base leading-relaxed text-body">
            Klassruum is designed to work alongside your existing systems. Data can be exported in
            standard formats or accessed via API for integration with LMS platforms, HR information
            systems, and compliance management tools. Our team can advise on integration approaches
            during your onboarding.{" "}
            <Link
              to="/contact"
              className="font-semibold text-academic-blue underline-offset-2 hover:underline"
            >
              Contact us
            </Link>{" "}
            to discuss your specific integration requirements.
          </p>
        </details>

        <details className="group rounded-xl border border-border bg-white p-5">
          <summary className="cursor-pointer text-lg font-bold text-heading group-open:mb-3">
            What kind of support does Klassruum provide?
          </summary>
          <p className="text-base leading-relaxed text-body">
            We provide hands-on support during onboarding and pilot, including content optimisation,
            learner onboarding guidance, and technical setup. After launch, our{" "}
            <Link
              to="/help"
              className="font-semibold text-academic-blue underline-offset-2 hover:underline"
            >
              help centre
            </Link>{" "}
            provides ongoing guides, tutorials, and best practices. Enterprise customers receive
            dedicated account management and priority support.
          </p>
        </details>
      </div>

      {/* ── 18. Final CTA ── */}
      <div className="mt-16 rounded-2xl border border-border bg-page-background-alt p-8 text-center sm:p-12">
        <h2 className="text-2xl font-black tracking-tight text-heading sm:text-3xl">
          Ready to transform your training delivery?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-body">
          Whether you are delivering compliance training to a regulated workforce, onboarding new
          hires at scale, or certifying professionals across multiple sites, Klassruum gives you
          consistent, measurable, and accessible training — without the logistical overhead.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-heading px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-heading/90"
          >
            Request a walkthrough
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-heading transition-colors hover:bg-page-background-alt"
          >
            Try the classroom
          </Link>
        </div>
      </div>
    </InfoPage>
  ),
});
