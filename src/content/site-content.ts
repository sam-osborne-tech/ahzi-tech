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
  id: string
  label: string
  nextDecision: string
  problem: string
  summary: string
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
  actions: string
  businessFunction: AgentBusinessFunction
  evidence: string
  humanGate: string
  id: string
  outcome: string
  readsFrom: string
  title: string
  trigger: string
  writes: string
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
  id: string
  label: string
  summary: string
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
    id: 'offering-workflow-selection',
    label: 'Select',
    nextDecision:
      'Choose a production build, fix a prerequisite, or stop before spending on implementation.',
    problem:
      'The team has AI ideas but lacks the context, risk boundary, and accountable operator needed to choose one.',
    summary:
      'Choose a workflow with a clear owner, boundary, and release decision.',
    systems:
      'The review stays read-only across representative records and process artifacts.',
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
    id: 'offering-production-agent',
    label: 'Build',
    nextDecision:
      'Approve a bounded release, hold for remediation, or keep the agent in supervised operation.',
    problem:
      'The prototype produces an answer but lacks record retrieval, approved actions, and production review evidence.',
    summary:
      'Connect one owned workflow to approved systems, tools, and release controls.',
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
    id: 'offering-document-intelligence',
    label: 'Extract',
    nextDecision:
      'Publish the structured data, revise the schema or checks, or hold the affected records for review.',
    problem:
      'Critical terms are trapped in inconsistent documents, and spot checks leave the full export unverified.',
    summary:
      'Turn documents into source-linked records with a review queue and population checks.',
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
    id: 'offering-embedded-copilot',
    label: 'Embed',
    nextDecision:
      'Release to a limited audience, keep the feature behind a flag, or return it to evaluation.',
    problem:
      'The prompt works in isolation, but the product lacks grounded context, safe actions, version comparison, and a release mechanism.',
    summary:
      'Embed grounded retrieval and approved actions inside an existing product.',
    systems:
      'Existing product or internal application, approved knowledge, model provider, application APIs, telemetry, and feature controls.',
    title: 'Embedded Copilot Delivery',
    work:
      'Ahzi connects the interface, retrieval, tools, trace, feedback, and release gates inside the existing product.',
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
      'Teams with an existing agent or AI feature that lacks a dependable quality and release loop.',
    id: 'offering-agent-operations',
    label: 'Operate',
    nextDecision:
      'Ship the candidate, hold the release, or prioritize the failure class that needs another build cycle.',
    problem:
      'A completed run lacks proof for the tool choice, intermediate decisions, and final action.',
    summary:
      'Turn traces and failures into repeatable release gates and operating checks.',
    systems:
      'Existing agent runtime, traces, evaluation data, CI or release workflow, human review queue, and production telemetry.',
    title: 'Agent Evaluation and Operations',
    work:
      'Ahzi instruments the run, defines representative cases and rubrics, connects failures to regression tests, and creates an owner-operated release loop.',
  },
] as const satisfies readonly OfferingContent[]

const agentPatterns = [
  {
    actions:
      'Detect missing fields, retrieve account context, classify the request, draft clarifying questions, and select an allowed queue.',
    businessFunction: 'Service',
    evidence:
      'Case source links, classification rationale, approval identity, reconciled record changes, and exception status.',
    humanGate:
      'A service owner approves queue changes or customer-facing language and owns ambiguous entitlement decisions.',
    id: 'crm-service-triage',
    outcome:
      'Complete service context, an owned route, and a governed CRM update.',
    readsFrom:
      'CRM case and account records, entitlement data, approved support policy, and queue capacity.',
    title: 'CRM service triage agent',
    trigger:
      'A new case, message, or intake record arrives with missing routing information.',
    writes:
      'Propose or apply accepted case fields, create a follow-up task, and route the record through an approved CRM action.',
  },
  {
    actions:
      'Validate completeness, normalize fields, match records, request missing items, and assemble the next-step packet.',
    businessFunction: 'Operations',
    evidence:
      'Requirement checklist, source references, missing-item log, approval state, and downstream handoff record.',
    humanGate:
      'An onboarding owner clears identity, eligibility, policy exceptions, and any step that creates external access.',
    id: 'intake-onboarding',
    outcome:
      'A complete onboarding decision, review packet, and owned handoff.',
    readsFrom:
      'Submitted forms, CRM or case records, document repository, eligibility rules, and internal checklists.',
    title: 'Intake and onboarding agent',
    trigger:
      'A prospect, customer, vendor, or employee submits the first intake package.',
    writes:
      'Update staging fields, open approved tasks, and prepare the accepted onboarding record for the system of record.',
  },
  {
    actions:
      'Run OCR when needed, identify target clauses, normalize values, compare related terms, and route uncertainty.',
    businessFunction: 'Legal',
    evidence:
      'Field-level source citations, extraction status, conflict flags, reviewer decisions, and population reconciliation.',
    humanGate:
      'A domain reviewer adjudicates material clauses, conflicting dates, missing pages, and final publication.',
    id: 'contract-intelligence',
    outcome:
      'Source-linked contract records with every conflict routed for review.',
    readsFrom:
      'Agreement files, OCR output, approved clause definitions, target schema, and reference examples.',
    title: 'Contract intelligence agent',
    trigger:
      'An agreement is uploaded, renewed, or selected for a structured contract inventory.',
    writes:
      'Write source-linked fields to staging, create exception items, and publish only the reviewer-approved record.',
  },
  {
    actions:
      'Reconcile account signals, surface recent changes, identify missing context, and draft grounded preparation notes.',
    businessFunction: 'Revenue',
    evidence:
      'Source-linked brief, stale-data warnings, unresolved questions, action approvals, and CRM activity record.',
    humanGate:
      'The account owner approves outreach, forecast changes, opportunity edits, and any external communication.',
    id: 'revenue-account-prep',
    outcome:
      'A source-linked account brief, open questions, and approved next steps.',
    readsFrom:
      'Account, contact, opportunity, activity, support, and approved product or market context.',
    title: 'Revenue and account preparation agent',
    trigger:
      'An account review, renewal discussion, pipeline inspection, or customer meeting is scheduled.',
    writes:
      'Publish an internal brief, propose CRM follow-ups, and create accepted owner tasks.',
  },
  {
    actions:
      'Retrieve authoritative sources, reconcile conflicts, produce a cited answer, and plan an allowed tool call.',
    businessFunction: 'Product',
    evidence:
      'Cited answer, retrieved-source list, tool trace, user feedback, policy outcome, and escalation record.',
    humanGate:
      'Subject owners approve restricted answers and consequential tools, while users can edit, reject, or escalate every recommendation.',
    id: 'knowledge-operations-copilot',
    outcome:
      'A cited operating answer with authorized next actions and an escalation path.',
    readsFrom:
      'Approved knowledge, operational records, internal APIs, access policy, and current user context.',
    title: 'Internal knowledge and operations copilot',
    trigger:
      'A user asks a supported operational question or requests help completing an internal task.',
    writes:
      'Draft or execute an approved internal action, attach evidence, and route unsupported requests to the right queue.',
  },
  {
    actions:
      'Compare sources, classify the defect, calculate the safe correction set, and isolate ambiguous records.',
    businessFunction: 'Data',
    evidence:
      'Before and after values, source hierarchy, validation output, approver identity, and rollback reference.',
    humanGate:
      'A data steward approves merges, ownership changes, destructive edits, and corrections that lack a single authoritative source.',
    id: 'crm-data-quality',
    outcome:
      'A governed correction set with source conflicts and rollback evidence.',
    readsFrom:
      'CRM records, duplicate candidates, ownership rules, validation policy, and approved reference systems.',
    title: 'CRM data-quality and governed action agent',
    trigger:
      'A record fails validation, a duplicate cluster appears, or an owner requests a quality review.',
    writes:
      'Stage approved field updates, merge or route records through existing controls, and record a reversible change set.',
  },
  {
    actions:
      'Run representative scenarios, score final and intermediate steps, compare versions, and classify regressions.',
    businessFunction: 'Product',
    evidence:
      'Version comparison, failed-case trace, scorer output, reviewer annotation, release result, and rollback trigger.',
    humanGate:
      'Product and domain owners calibrate the rubric, accept threshold changes, and make the final release decision.',
    id: 'agent-release-watchdog',
    outcome:
      'A release decision backed by repeatable cases, traces, and rollback triggers.',
    readsFrom:
      'Agent traces, evaluation datasets, release candidates, production feedback, and incident policy.',
    title: 'Agent evaluation and release watchdog',
    trigger:
      'A prompt, model, tool, retrieval source, or orchestration change creates a new release candidate.',
    writes:
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
      'Complete the missing service context from recorded entitlement data.',
      'Classify the request, propose the route, and prepare a reversible CRM update.',
    ],
    reads: [
      'Sample Salesforce Case and Account',
      'Sample entitlement record',
      'Approved service routing policy',
      'Current queue ownership',
    ],
    risk: 'controlled',
    riskReason:
      'The run proposes a customer-record update, so the write requires an accountable service owner.',
    summary:
      'A service request arrives with an unclear category and missing entitlement context.',
    trigger: 'Sample case received from a web intake channel.',
    write:
      'Update the sample case after approval, then record the before and after values.',
  },
  {
    action:
      'Extract the target terms, compare related dates, and send conflicts to the document exception queue.',
    evaluation:
      'Check every required field, source citation, exception rule, and the full sample population manifest.',
    id: 'contract-extraction',
    label: 'Contract extraction',
    plan: [
      'Run OCR only where the source lacks usable text and preserve page references.',
      'Normalize the requested clauses, isolate conflicts, and stage the result for review.',
    ],
    reads: [
      'Sample agreement pages',
      'Target contract schema',
      'Approved clause definitions',
      'Reference extraction cases',
    ],
    risk: 'controlled',
    riskReason:
      'Conflicting renewal language affects publication, so a domain reviewer must adjudicate the staged record.',
    summary:
      'A newly uploaded agreement contains inconsistent renewal and notice language.',
    trigger: 'Sample agreement added to the document intake folder.',
    write:
      'Publish approved structured terms or keep the record in the exception queue.',
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
      'Sample CRM account and opportunity',
      'Sample activity history',
      'Sample support summary',
      'Approved product knowledge',
    ],
    risk: 'low',
    riskReason:
      'The output is an internal, source-linked brief. Customer records and communications stay unchanged.',
    summary:
      'An account owner needs a grounded briefing before an internal pipeline review.',
    trigger: 'Sample account review requested by the opportunity owner.',
    write:
      'Save the sample internal brief and proposed tasks. Keep source CRM records unchanged.',
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
    { label: 'Agents we build', target: '#agent-catalog' },
    { label: 'Workflow paths', target: '#use-cases' },
    { label: 'Proof', target: '#proof' },
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
    heading: {
      badge: 'Agent Lab',
      body: 'Choose an agent. Set the approval policy. Run the trace.',
      title: 'Trace the workflow from trigger to proof.',
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
          'Low-risk internal outputs continue when all policy checks pass. Controlled actions still stop for review.',
        id: 'bounded-autonomy',
        label: 'Autonomy within policy',
      },
    ] as const,
    scenarios: agentLabScenarios,
  },
  offerings: {
    heading: {
      badge: 'What Ahzi delivers',
      body:
        'Each engagement ends with defined artifacts, named controls, and a clear next decision.',
      title: 'Choose the engagement that matches the decision.',
    },
    items: offerings,
  },
  agentCatalog: {
    filters: ['All', 'Service', 'Operations', 'Legal', 'Revenue', 'Product', 'Data'] as const,
    heading: {
      badge: 'Agents we build',
      body:
        'Filter by function, then open an agent to inspect its trigger, reads, actions, writes, human gate, and proof.',
      title: 'Start with an owned business event.',
    },
    items: agentPatterns,
  },
  useCases: {
    heading: {
      badge: 'Workflow walkthroughs',
      body:
        'Open one path to inspect its systems, controls, exception route, and proof.',
      title: 'Run these workflows from event to accountable action.',
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
        id: 'use-case-service-triage',
        label: 'Salesforce and CRM intake',
        summary:
          'Complete missing case context, route the work, and govern the CRM update.',
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
          'Unreadable pages, absent fields, conflicting clauses, and invalid normalized values enter review before any target record is written.',
        flow: [
          'Document intake',
          'Text and page extraction',
          'Clause normalization',
          'Domain exception review',
          'Population verification and publish',
        ],
        humanControls:
          'Domain owners set the schema and materiality rules, adjudicate flagged fields, approve the export, and can rerun the affected population.',
        id: 'use-case-contract-data',
        label: 'Contracts and document data',
        summary:
          'Extract source-linked contract terms, route conflicts, and verify the full population.',
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
        id: 'use-case-embedded-copilot',
        label: 'Embedded product and internal copilot',
        summary:
          'Ground the copilot, constrain its tools, and hold every release to an owned gate.',
        startingState:
          'A useful prompt or prototype exists, but the application lacks version comparison, tool constraints, and regression gates.',
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
          'Internal MCP tools, review queues, benchmarks, and agent harnesses run Ahzi operating workflows.',
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
      badge: 'Proof and controls',
      body:
        'Delivery evidence sits beside the permissions, approvals, evaluation, and rollback path.',
      title: 'Proof from shipped work. Controls for the next build.',
    },
  },
  engagement: {
    cta: callsToAction.engagement,
    heading: {
      badge: 'Engagement path',
      body:
        'Map the trigger, records, actions, owner, and first test in one focused review.',
      title: 'Bring one workflow. Leave with a decision.',
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
          'Leave with a concrete offering, a prerequisite to fix, or a documented stop decision.',
        title: 'Make the buying decision',
      },
    ],
  },
  conversion: {
    formTitle: 'Share the workflow context',
    heading: {
      badge: 'Workflow review request',
      body:
        'Name the trigger, system, owner, handoff, and action that needs a stronger control.',
      title: 'Start with one workflow.',
    },
  },
  callsToAction: Object.values(callsToAction),
  footer: {
    cta: callsToAction.footer,
    tagline: 'Ahzi // Agents built around owned workflows.',
  },
} as const
