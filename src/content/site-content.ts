export type CallToActionContent = {
  label: string
  target: string
}

export type SectionHeadingContent = {
  badge: string
  body: string
  title: string
}

export type OfferingContent = {
  controls: string
  deliverables: readonly string[]
  forWho: string
  label: string
  nextDecision: string
  problem: string
  systems: string
  title: string
  work: string
}

export type AgentBusinessFunction =
  | 'Data'
  | 'Legal'
  | 'Operations'
  | 'Product'
  | 'Revenue'
  | 'Service'

export type AgentPatternContent = {
  businessFunction: AgentBusinessFunction
  evidence: string
  humanGate: string
  id: string
  readsFrom: string
  status: 'Buildable agent pattern'
  summary: string
  title: string
  trigger: string
  workPerformed: string
  writesActions: string
}

export type AgentLabScenarioContent = {
  action: string
  evaluation: string
  id: string
  label: string
  plan: readonly string[]
  reads: readonly string[]
  risk: 'controlled' | 'low'
  riskReason: string
  summary: string
  trigger: string
  write: string
}

export type UseCaseContent = {
  agentBehavior: string
  decisionEvidence: string
  exceptionPath: string
  flow: readonly string[]
  humanControls: string
  label: string
  startingState: string
  systemMap: string
  title: string
}

const callsToAction = {
  heroPrimary: {
    label: 'Request a workflow review',
    target: '#contact',
  },
  heroSecondary: {
    label: 'Open the Agent Lab',
    target: '#agent-lab',
  },
  engagement: {
    label: 'See what the review returns',
    target: '#contact',
  },
  footer: {
    label: 'Review a workflow',
    target: '#contact',
  },
} as const satisfies Record<string, CallToActionContent>

const offerings = [
  {
    controls:
      'The workflow owner approves the boundary, names forbidden actions, and signs the build or no-build decision.',
    deliverables: [
      'Candidate workflow map with a named trigger and owner',
      'System, data, permission, and exception boundary',
      'Representative evaluation plan and first release decision',
    ],
    forWho:
      'Operations, product, or CRM owners choosing where an agent should enter a real process.',
    label: 'Select',
    nextDecision:
      'Choose a production build, fix a prerequisite, or stop before spending on implementation.',
    problem:
      'The team has a list of AI ideas but cannot tell which one has usable context, bounded risk, and an accountable operator.',
    systems:
      'Representative records and process artifacts are reviewed read-only. Production systems are not changed.',
    title: 'Workflow Selection Review',
    work:
      'Ahzi traces one process from trigger to decision, tests the riskiest assumption, and defines the smallest useful agent boundary.',
  },
  {
    controls:
      'Action-level approvals, purpose-specific permissions, exception ownership, a release gate, and a documented stop path stay explicit.',
    deliverables: [
      'Working agent with scoped tools and system connectors',
      'Tool and permission catalog plus approval interface',
      'Evaluation cases, deployment checks, operating runbook, and rollback path',
    ],
    forWho:
      'Teams that already know the workflow and need an agent connected to business systems.',
    label: 'Build',
    nextDecision:
      'Approve a bounded release, hold for remediation, or keep the agent in supervised operation.',
    problem:
      'A prototype can produce an answer but cannot yet retrieve the right record, call an approved action, or survive a production review.',
    systems:
      'CRM, approved knowledge sources, internal APIs, and workflow queues, first in a sandbox and then behind a release decision.',
    title: 'Production Agent Build',
    work:
      'Ahzi implements the trigger, context assembly, tool plan, human gate, write path, trace, and evaluation loop as one inspectable system.',
  },
  {
    controls:
      'Domain owners define material fields, adjudicate low-confidence records, and approve any publish or downstream update.',
    deliverables: [
      'Target schema and source-linked extraction pipeline',
      'Review queue for missing, conflicting, or low-confidence fields',
      'Population reconciliation and publication evidence',
    ],
    forWho:
      'Legal, finance, and operations teams turning contracts, forms, or case files into structured records.',
    label: 'Extract',
    nextDecision:
      'Publish the structured data, revise the schema or checks, or hold the affected records for review.',
    problem:
      'Critical terms are trapped in inconsistent documents, and spot checks cannot show whether a full export is safe to use.',
    systems:
      'Document repository, native or selected OCR, extraction model, staging tables, exception queue, and audit store.',
    title: 'Document Intelligence System',
    work:
      'Ahzi builds ingestion, OCR, field extraction, normalization, source linking, exception routing, and deterministic population checks.',
  },
  {
    controls:
      'Product owners set the approved sources, review consequential actions, control rollout, and retain override and rollback paths.',
    deliverables: [
      'Embedded assistant surface and application integration',
      'Retrieval and tool boundaries with trace capture',
      'Regression suite, release checks, and production monitoring plan',
    ],
    forWho:
      'Product and engineering teams embedding AI into customer software or an internal operating tool.',
    label: 'Embed',
    nextDecision:
      'Release to a limited audience, keep the feature behind a flag, or return it to evaluation.',
    problem:
      'The prompt works in isolation, but the product lacks grounded context, safe actions, version comparison, and a release mechanism.',
    systems:
      'Existing product or internal application, approved knowledge, model provider, application APIs, telemetry, and feature controls.',
    title: 'Embedded Copilot Delivery',
    work:
      'Ahzi connects the interface, retrieval, tools, trace, feedback, and release gates without replacing the product around them.',
  },
  {
    controls:
      'Domain reviewers calibrate scoring, own release thresholds, inspect flagged traces, and authorize rollback or expansion.',
    deliverables: [
      'Trace schema and failure taxonomy',
      'Versioned evaluation dataset with deterministic and judged checks',
      'Release gate, review queue, incident path, and operating dashboard definition',
    ],
    forWho:
      'Teams with an existing agent or AI feature but no dependable quality and release loop.',
    label: 'Operate',
    nextDecision:
      'Ship the candidate, hold the release, or prioritize the failure class that needs another build cycle.',
    problem:
      'The team can see that a run completed but cannot prove the tool choice, intermediate decisions, or final action were acceptable.',
    systems:
      'Existing agent runtime, traces, evaluation data, CI or release workflow, human review queue, and production telemetry.',
    title: 'Agent Evaluation and Operations',
    work:
      'Ahzi instruments the run, defines representative cases and rubrics, connects failures to regression tests, and creates an owner-operated release loop.',
  },
] as const satisfies readonly OfferingContent[]

const agentPatterns = [
  {
    businessFunction: 'Service',
    evidence:
      'Case source links, classification rationale, approval identity, reconciled record changes, and exception status.',
    humanGate:
      'A service owner approves queue changes or customer-facing language and owns ambiguous entitlement decisions.',
    id: 'crm-service-triage',
    readsFrom:
      'CRM case and account records, entitlement data, approved support policy, and queue capacity.',
    status: 'Buildable agent pattern',
    summary:
      'Completes missing service context, proposes a route, and keeps consequential CRM updates behind an owner decision.',
    title: 'CRM service triage agent',
    trigger:
      'A new case, message, or intake record arrives without enough information for reliable routing.',
    workPerformed:
      'Detect missing fields, retrieve account context, classify the request, draft clarifying questions, and select an allowed queue.',
    writesActions:
      'Propose or apply accepted case fields, create a follow-up task, and route the record through an approved CRM action.',
  },
  {
    businessFunction: 'Operations',
    evidence:
      'Requirement checklist, source references, missing-item log, approval state, and downstream handoff record.',
    humanGate:
      'An onboarding owner clears identity, eligibility, policy exceptions, and any step that creates external access.',
    id: 'intake-onboarding',
    readsFrom:
      'Submitted forms, CRM or case records, document repository, eligibility rules, and internal checklists.',
    status: 'Buildable agent pattern',
    summary:
      'Turns a scattered intake package into a complete, reviewable onboarding decision and handoff.',
    title: 'Intake and onboarding agent',
    trigger:
      'A prospect, customer, vendor, or employee submits the first intake package.',
    workPerformed:
      'Validate completeness, normalize fields, match records, request missing items, and assemble the next-step packet.',
    writesActions:
      'Update staging fields, open approved tasks, and prepare the accepted onboarding record for the system of record.',
  },
  {
    businessFunction: 'Legal',
    evidence:
      'Field-level source citations, extraction status, conflict flags, reviewer decisions, and population reconciliation.',
    humanGate:
      'A domain reviewer adjudicates material clauses, conflicting dates, missing pages, and final publication.',
    id: 'contract-intelligence',
    readsFrom:
      'Agreement files, OCR output, approved clause definitions, target schema, and reference examples.',
    status: 'Buildable agent pattern',
    summary:
      'Extracts contract terms into structured data while preserving every source and exception needed for review.',
    title: 'Contract intelligence agent',
    trigger:
      'An agreement is uploaded, renewed, or selected for a structured contract inventory.',
    workPerformed:
      'Run OCR when needed, identify target clauses, normalize values, compare related terms, and route uncertainty.',
    writesActions:
      'Write source-linked fields to staging, create exception items, and publish only the reviewer-approved record.',
  },
  {
    businessFunction: 'Revenue',
    evidence:
      'Source-linked brief, stale-data warnings, unresolved questions, action approvals, and CRM activity record.',
    humanGate:
      'The account owner approves outreach, forecast changes, opportunity edits, and any external communication.',
    id: 'revenue-account-prep',
    readsFrom:
      'Account, contact, opportunity, activity, support, and approved product or market context.',
    status: 'Buildable agent pattern',
    summary:
      'Assembles an account briefing and next-step options without fabricating missing commercial context.',
    title: 'Revenue and account preparation agent',
    trigger:
      'An account review, renewal discussion, pipeline inspection, or customer meeting is scheduled.',
    workPerformed:
      'Reconcile account signals, surface recent changes, identify missing context, and draft grounded preparation notes.',
    writesActions:
      'Publish an internal brief, propose CRM follow-ups, and create accepted owner tasks.',
  },
  {
    businessFunction: 'Product',
    evidence:
      'Cited answer, retrieved-source list, tool trace, user feedback, policy outcome, and escalation record.',
    humanGate:
      'Subject owners approve restricted answers and consequential tools, while users can edit, reject, or escalate every recommendation.',
    id: 'knowledge-operations-copilot',
    readsFrom:
      'Approved knowledge, operational records, internal APIs, access policy, and current user context.',
    status: 'Buildable agent pattern',
    summary:
      'Answers an internal operating question, gathers the supporting records, and proposes only authorized next actions.',
    title: 'Internal knowledge and operations copilot',
    trigger:
      'A user asks a supported operational question or requests help completing an internal task.',
    workPerformed:
      'Retrieve authoritative sources, reconcile conflicts, produce a cited answer, and plan an allowed tool call.',
    writesActions:
      'Draft or execute an approved internal action, attach evidence, and route unsupported requests to the right queue.',
  },
  {
    businessFunction: 'Data',
    evidence:
      'Before and after values, source hierarchy, validation output, approver identity, and rollback reference.',
    humanGate:
      'A data steward approves merges, ownership changes, destructive edits, and corrections that lack a single authoritative source.',
    id: 'crm-data-quality',
    readsFrom:
      'CRM records, duplicate candidates, ownership rules, validation policy, and approved reference systems.',
    status: 'Buildable agent pattern',
    summary:
      'Finds actionable CRM quality defects, explains the source conflict, and stages governed corrections.',
    title: 'CRM data-quality and governed action agent',
    trigger:
      'A record fails validation, a duplicate cluster appears, or an owner requests a quality review.',
    workPerformed:
      'Compare sources, classify the defect, calculate the safe correction set, and isolate ambiguous records.',
    writesActions:
      'Stage approved field updates, merge or route records through existing controls, and record a reversible change set.',
  },
  {
    businessFunction: 'Product',
    evidence:
      'Version comparison, failed-case trace, scorer output, reviewer annotation, release result, and rollback trigger.',
    humanGate:
      'Product and domain owners calibrate the rubric, accept threshold changes, and make the final release decision.',
    id: 'agent-release-watchdog',
    readsFrom:
      'Agent traces, evaluation datasets, release candidates, production feedback, and incident policy.',
    status: 'Buildable agent pattern',
    summary:
      'Turns agent failures into repeatable evaluation cases and blocks a release when an owned gate fails.',
    title: 'Agent evaluation and release watchdog',
    trigger:
      'A prompt, model, tool, retrieval source, or orchestration change creates a new release candidate.',
    workPerformed:
      'Run representative scenarios, score final and intermediate steps, compare versions, and classify regressions.',
    writesActions:
      'Publish the release report, add approved failures to the regression set, and hold or clear the deployment gate.',
  },
] as const satisfies readonly AgentPatternContent[]

const agentLabScenarios = [
  {
    action:
      'Propose a queue, case category, and clarifying questions through the allowed service tools.',
    evaluation:
      'Verify required context, allowed action scope, accepted field changes, and a complete trace.',
    id: 'service-triage',
    label: 'Service triage',
    plan: [
      'Complete the missing service context without inventing entitlement data.',
      'Classify the request, propose the route, and prepare a reversible CRM update.',
    ],
    reads: [
      'Synthetic Salesforce Case and Account',
      'Synthetic entitlement record',
      'Approved service routing policy',
      'Current queue ownership',
    ],
    risk: 'controlled',
    riskReason:
      'The run proposes a customer-record update, so the write requires an accountable service owner.',
    summary:
      'A service request arrives with an unclear category and missing entitlement context.',
    trigger: 'Synthetic case received from a web intake channel.',
    write:
      'Update the synthetic case only after approval, then record the before and after values.',
  },
  {
    action:
      'Extract the target terms, compare related dates, and send conflicts to the document exception queue.',
    evaluation:
      'Check every required field, source citation, exception rule, and the full synthetic population manifest.',
    id: 'contract-extraction',
    label: 'Contract extraction',
    plan: [
      'Run OCR only where the source lacks usable text and preserve page references.',
      'Normalize the requested clauses, isolate conflicts, and stage the result for review.',
    ],
    reads: [
      'Synthetic agreement pages',
      'Target contract schema',
      'Approved clause definitions',
      'Reference extraction cases',
    ],
    risk: 'controlled',
    riskReason:
      'Conflicting renewal language affects publication, so a domain reviewer must adjudicate the staged record.',
    summary:
      'A newly uploaded agreement contains inconsistent renewal and notice language.',
    trigger: 'Synthetic agreement added to the document intake folder.',
    write:
      'Publish approved structured terms or retain the record in the exception queue with no downstream update.',
  },
  {
    action:
      'Assemble a source-linked account brief and propose internal preparation tasks.',
    evaluation:
      'Check citation coverage, stale-record warnings, unsupported inferences, and trace completeness.',
    id: 'account-preparation',
    label: 'Account preparation',
    plan: [
      'Reconcile current account, opportunity, activity, and support context.',
      'Create an internal brief that separates known facts from unanswered questions.',
    ],
    reads: [
      'Synthetic CRM account and opportunity',
      'Synthetic activity history',
      'Synthetic support summary',
      'Approved product knowledge',
    ],
    risk: 'low',
    riskReason:
      'The output is an internal, source-linked brief and does not change customer records or send communication.',
    summary:
      'An account owner needs a grounded briefing before an internal pipeline review.',
    trigger: 'Synthetic account review requested by the opportunity owner.',
    write:
      'Save the synthetic internal brief and proposed tasks without editing the source CRM records.',
  },
] as const satisfies readonly AgentLabScenarioContent[]

export const siteContent = {
  narrativeOrder: [
    'top',
    'agent-lab',
    'offerings',
    'agent-catalog',
    'use-cases',
    'proof',
    'engagement',
    'contact',
  ],
  nav: [
    { label: 'Agent Lab', target: '#agent-lab' },
    { label: 'Offerings', target: '#offerings' },
    { label: 'Agent catalog', target: '#agent-catalog' },
    { label: 'Use cases', target: '#use-cases' },
    { label: 'Proof and controls', target: '#proof' },
    { label: 'Workflow review', target: '#engagement' },
  ],
  hero: {
    badge: 'Forward-deployed AI systems',
    body:
      'Ahzi maps the system boundary, builds the agent and its tools, and leaves behind the tests, approval path, and runbook needed for a release decision.',
    ctas: [callsToAction.heroPrimary, callsToAction.heroSecondary],
    reviewOutputs: [
      'A named trigger, owner, and exception path',
      'The records, tools, and writes inside the boundary',
      'Evidence for a build, prerequisite, or no-build decision',
    ],
    reviewTitle: 'What the first review produces',
    title:
      'Turn one manual workflow into an agent your team can inspect, approve, and operate.',
  },
  agentLab: {
    disclaimer:
      'Interactive synthetic walkthrough. No live model, customer data, or production execution.',
    heading: {
      badge: 'Agent Lab',
      body:
        'Choose a synthetic workflow, change its approval policy, and step through the trigger, context, plan, gate, action, and audit evidence.',
      title: 'Inspect the run, not a chatbot transcript.',
    },
    policies: [
      {
        body:
          'Every proposed write pauses for a named reviewer before the run can continue.',
        id: 'review-every-action',
        label: 'Approve every write',
      },
      {
        body:
          'Low-risk internal outputs may continue when all policy checks pass. Controlled actions still stop for review.',
        id: 'bounded-autonomy',
        label: 'Autonomy within policy',
      },
    ] as const,
    scenarios: agentLabScenarios,
  },
  offerings: {
    heading: {
      badge: 'Productized offerings',
      body:
        'Each engagement has a defined buyer problem, system boundary, tangible handoff, human control, and next decision.',
      title: 'Five things Ahzi can be hired to deliver.',
    },
    items: offerings,
  },
  agentCatalog: {
    filters: ['All', 'Service', 'Operations', 'Legal', 'Revenue', 'Product', 'Data'] as const,
    heading: {
      badge: 'Agent catalog',
      body:
        'These patterns show the exact trigger, context, work, actions, gate, and evidence that a build would need.',
      title: 'Agents designed around business events and owned decisions.',
    },
    items: agentPatterns,
    patternNote:
      'Buildable agent patterns, not claims of customer deployment. Final scope depends on source access, permissions, policy, and representative evaluation data.',
  },
  useCases: {
    heading: {
      badge: 'Deep use cases',
      body:
        'Each walkthrough follows the operating system around the model: starting state, system map, agent behavior, owner gate, exception branch, and release evidence.',
      title: 'Three implementation paths from event to accountable outcome.',
    },
    items: [
      {
        agentBehavior:
          'The agent completes permitted context, classifies the request, proposes a route, drafts follow-up questions, and calls only the actions assigned to this workflow.',
        decisionEvidence:
          'Representative intake cases, permission tests, accepted and rejected approval paths, before-and-after reconciliation, and exception ownership support the release decision.',
        exceptionPath:
          'Missing entitlement, conflicting account state, or an unsupported request stops the write and opens a service-owner review item with source context attached.',
        flow: [
          'Intake event',
          'CRM context assembly',
          'Policy and ownership check',
          'Human-approved record action',
          'Reconciliation and audit',
        ],
        humanControls:
          'The service owner defines eligible queues and writes, approves customer-record changes, edits proposed language, and can stop or reroute the run.',
        label: 'Salesforce and CRM intake',
        startingState:
          'Requests arrive with incomplete details, forcing the service team to search account history before it can classify or assign the work.',
        systemMap:
          'Intake channel to CRM case and account to entitlement and routing policy to service queue, with an approval record and audit store alongside the write.',
        title: 'A supervised service triage path',
      },
      {
        agentBehavior:
          'The pipeline detects whether OCR is required, extracts the target terms, normalizes values, links every field to its source, and classifies uncertainty.',
        decisionEvidence:
          'A field-level reference set, source coverage, exception tests, record counts, deterministic cross-checks, and the reviewer ledger support publication.',
        exceptionPath:
          'Unreadable pages, absent fields, conflicting clauses, and invalid normalized values enter a review queue without silently filling the target record.',
        flow: [
          'Document intake',
          'Text and page extraction',
          'Clause normalization',
          'Domain exception review',
          'Population verification and publish',
        ],
        humanControls:
          'Domain owners set the schema and materiality rules, adjudicate flagged fields, approve the export, and can rerun the affected population.',
        label: 'Contracts and document data',
        startingState:
          'Terms live across inconsistent files, while manual copying and sample review leave the full data population unverified.',
        systemMap:
          'Document repository to native or selected OCR to extraction and normalization to staging and exception queues to a controlled data target and audit store.',
        title: 'A source-linked contract data pipeline',
      },
      {
        agentBehavior:
          'The copilot retrieves approved context, cites the relevant source, plans an allowed tool call, records intermediate decisions, and surfaces uncertainty.',
        decisionEvidence:
          'Versioned evaluation cases, step-level traces, deterministic checks, calibrated review, override tests, regression results, and an operating plan support rollout.',
        exceptionPath:
          'Restricted topics, missing evidence, unavailable tools, or a failed release scorer produce a safe refusal or owner escalation instead of a partial action.',
        flow: [
          'User intent',
          'Approved retrieval',
          'Tool and policy plan',
          'Owner gate or safe refusal',
          'Release evaluation and feedback',
        ],
        humanControls:
          'Product owners choose the sources and evaluation cases, approve consequential actions, control the feature flag, and own rollback and incident response.',
        label: 'Embedded product and internal copilot',
        startingState:
          'A useful prompt or prototype exists, but the application cannot compare versions, constrain tools, or block a regression from reaching users.',
        systemMap:
          'Product interface to identity and approved knowledge to model and tool gateway to application action, with tracing, evaluation, and release controls around the path.',
        title: 'An embedded copilot with a release gate',
      },
    ] satisfies UseCaseContent[],
  },
  proof: {
    claims: [
      {
        body:
          'Ahzi has run contract intelligence across more than 5,000 agreements with population-level verification.',
        title: 'Contract data at population scale',
      },
      {
        body:
          'Public experience includes agents connected to Salesforce context and governed record actions.',
        title: 'Salesforce-connected agent work',
      },
      {
        body:
          'Internal MCP tools, review queues, benchmarks, and agent harnesses are used as operating software, not presentation artifacts.',
        title: 'Operator-owned AI tooling',
      },
      {
        body:
          'AI delivery inside a utility-scale enterprise informs the permission, ownership, exception, and release controls used in the build process.',
        title: 'Enterprise delivery context',
      },
    ],
    controls: [
      'Context boundary: approved sources and purpose-specific access',
      'Action boundary: reversible tools and approval for consequential writes',
      'Quality boundary: representative cases, deterministic checks, and domain review',
      'Operating boundary: trace capture, exception ownership, release gate, and rollback path',
    ],
    heading: {
      badge: 'Public proof and delivery controls',
      body:
        'The proof describes shipped capability. The controls describe what every new implementation must make inspectable before release.',
      title: 'Evidence on one side, operating boundaries on the other.',
    },
  },
  engagement: {
    cta: callsToAction.engagement,
    heading: {
      badge: 'Engagement path',
      body:
        'The first engagement is a compact decision path, not an open-ended advisory program.',
      title: 'One review ends in a build, a prerequisite, or a no-build decision.',
    },
    steps: [
      {
        body:
          'Share the event that starts the work, the current system, representative examples, the owner, and the failure or delay that matters.',
        title: 'Bring the workflow',
      },
      {
        body:
          'Ahzi maps reads, writes, permissions, exceptions, evaluation evidence, and the first assumption worth testing.',
        title: 'Review the boundary',
      },
      {
        body:
          'Leave with a concrete offering, a prerequisite to fix, or a documented reason not to build.',
        title: 'Make the buying decision',
      },
    ],
  },
  conversion: {
    formTitle: 'Share the workflow context',
    heading: {
      badge: 'Workflow review request',
      body:
        'Describe the trigger, system, owner, current handoff, and the action that needs better evidence or control.',
      title: 'Put one workflow on the table.',
    },
    replyCovers: [
      'Which Ahzi offering matches the current decision',
      'The boundary or prerequisite that needs the first test',
      'The records and owner needed for a useful working session',
    ],
    replyTitle: 'What the first reply will resolve',
  },
  callsToAction: Object.values(callsToAction),
  footer: {
    cta: callsToAction.footer,
    tagline: 'Ahzi // Agents built around owned workflows.',
  },
} as const
