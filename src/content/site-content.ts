export type CallToActionContent = {
  label: string
  target: string
}

export type SectionHeadingContent = {
  badge: string
  body: string
  title: string
}

export type UseCaseContent = {
  aiHandles: string
  cta: CallToActionContent
  decisionEvidence: string
  humanControls: string
  label: string
  publicProof?: string
  startingProblem: string
  systemsInvolved: string
  title: string
}

export type PlatformContent = {
  accent: string
  focus: string
  initials?: string
  logo:
    | 'anthropic'
    | 'aws'
    | 'gemini'
    | 'meta'
    | 'microsoft'
    | 'mistral'
    | 'openai'
    | 'perplexity'
    | 'salesforce'
    | 'wordmark'
  name: string
}

const callsToAction = {
  heroPrimary: {
    label: 'Request a workflow fit review',
    target: '#contact',
  },
  heroSecondary: {
    label: 'Explore the use cases',
    target: '#use-cases',
  },
  crmUseCase: {
    label: 'Test a service intake flow',
    target: '#contact',
  },
  documentUseCase: {
    label: 'Map a document extraction decision',
    target: '#contact',
  },
  copilotUseCase: {
    label: 'Define a copilot release path',
    target: '#contact',
  },
  engagement: {
    label: 'Scope the first decision',
    target: '#contact',
  },
  footer: {
    label: 'Start a workflow fit review',
    target: '#contact',
  },
} as const satisfies Record<string, CallToActionContent>

const platforms: PlatformContent[] = [
  {
    accent: '#74aa9c',
    focus: 'Assistants, tool use, and model evaluation',
    logo: 'openai',
    name: 'OpenAI',
  },
  {
    accent: '#d4b896',
    focus: 'Knowledge work, review loops, and governed actions',
    logo: 'anthropic',
    name: 'Anthropic',
  },
  {
    accent: '#00a1e0',
    focus: 'CRM context, service handoffs, and record updates',
    logo: 'salesforce',
    name: 'Salesforce Agentforce',
  },
  {
    accent: '#8e75b2',
    focus: 'Workspace context, search, and operations support',
    logo: 'gemini',
    name: 'Google Gemini',
  },
  {
    accent: '#f25022',
    focus: 'Business copilots and Microsoft application context',
    logo: 'microsoft',
    name: 'Microsoft Copilot',
  },
  {
    accent: '#ff9900',
    focus: 'Cloud deployment, model access, and data boundaries',
    logo: 'aws',
    name: 'AWS Bedrock',
  },
  {
    accent: '#0668e1',
    focus: 'Open-model strategy and private deployment paths',
    logo: 'meta',
    name: 'Meta Llama',
  },
  {
    accent: '#fa520f',
    focus: 'Lightweight models and private use cases',
    logo: 'mistral',
    name: 'Mistral AI',
  },
  {
    accent: '#39594d',
    focus: 'Retrieval and enterprise knowledge flows',
    initials: 'co',
    logo: 'wordmark',
    name: 'Cohere',
  },
  {
    accent: '#20b8a7',
    focus: 'Research tasks and sourced answer surfaces',
    logo: 'perplexity',
    name: 'Perplexity',
  },
]

export const siteContent = {
  narrativeOrder: [
    'top',
    'audiences',
    'use-cases',
    'how',
    'proof',
    'first-sprint',
    'contact',
  ],
  nav: [
    { label: 'Who it is for', target: '#audiences' },
    { label: 'Use cases', target: '#use-cases' },
    { label: 'Delivery', target: '#how' },
    { label: 'Proof', target: '#proof' },
    { label: 'First engagement', target: '#first-sprint' },
    { label: 'Workflow review', target: '#contact' },
  ],
  hero: {
    badge: 'Forward-deployed AI // CRM native',
    body: 'Ahzi builds agents, copilots, and document extraction systems inside the tools your team already owns. Each engagement pairs working software with the checks and controls needed to decide whether it should launch.',
    ctas: [callsToAction.heroPrimary, callsToAction.heroSecondary],
    reviewDecisions: [
      'Where the current process breaks',
      'Which control must stay human',
      'What would justify a build',
    ],
    reviewResult: 'A decision before a build',
    reviewTitle: 'The fit review decides',
    signals: [
      ['Opportunity', 'Mapped'],
      ['Data layer', 'Ready'],
      ['Control points', 'Named'],
      ['Launch test', 'Defined'],
    ],
    title: 'Enterprise AI that makes it into production.',
  },
  audience: {
    cards: [
      {
        body: 'Turn a manual intake, review, or data-entry process into a supervised system with explicit exception ownership.',
        title: 'Business operators',
      },
      {
        body: 'Move a promising feature past the demo by defining representative evaluations, release criteria, and an accountable owner.',
        title: 'Product leaders',
      },
      {
        body: 'Make customer context usable without giving an agent broader read or write access than the process allows.',
        title: 'CRM and service owners',
      },
    ],
    heading: {
      badge: 'Audience and problem',
      body: 'The gap is rarely model access. Teams get stuck on missing context, unclear permissions, exception handling, and no shared test for release.',
      title: 'AI work stalls between a promising demo and an owned business process.',
    },
  },
  useCases: {
    heading: {
      badge: 'Illustrative use cases',
      body: 'These examples make the operating boundary concrete before a build starts. They describe the inputs, controls, and decision evidence without promising an outcome that has not been measured.',
      title: 'Three workflows where the operating details matter.',
    },
    items: [
      {
        aiHandles: 'Gather the missing context, classify the request, draft the next action, call only approved tools, and write the accepted result back to the record.',
        cta: callsToAction.crmUseCase,
        decisionEvidence: 'A representative intake set, permission checks, approval-path tests, record-write reconciliation, and an exception log show whether the flow is safe to release.',
        humanControls: 'Process owners define eligible actions, approve consequential steps, resolve exceptions, and can edit or stop every proposed update.',
        label: 'Service and intake',
        startingProblem: 'Requests arrive with incomplete details, so a service team chases context before it can route work or update the customer record.',
        systemsInvolved: 'Salesforce or another CRM, intake channels, service queues, and approved internal APIs.',
        title: 'Governed CRM service intake',
      },
      {
        aiHandles: 'Extract the required fields and clauses, normalize them into structured output, and route low-confidence or conflicting records to an exception queue.',
        cta: callsToAction.documentUseCase,
        decisionEvidence: 'A field-level reference set, source links, exception coverage, and deterministic checks across the full population support the publication decision.',
        humanControls: 'Domain owners set the target schema, define material exceptions, adjudicate flagged records, and approve the final export.',
        label: 'Contracts and documents',
        publicProof: 'Ahzi has run contract intelligence across more than 5,000 agreements with population-level verification.',
        startingProblem: 'Contracts and forms use inconsistent language, leaving teams to copy key terms manually and discover extraction errors late.',
        systemsInvolved: 'A document repository, OCR and extraction services, a structured data target, an exception queue, and an audit store.',
        title: 'Verified document extraction',
      },
      {
        aiHandles: 'Retrieve approved context, draft or recommend within defined boundaries, record traces, and surface uncertainty instead of hiding it.',
        cta: callsToAction.copilotUseCase,
        decisionEvidence: 'Representative evaluation data, regression results, release-gate output, override tests, and a production monitoring plan support an owner handoff.',
        humanControls: 'Product owners choose the evaluation set, set release gates, override any recommendation, approve rollout, and own the operating runbook.',
        label: 'AI product and internal tools',
        startingProblem: 'A team has a useful prompt or prototype, but no reliable way to compare versions, block regressions, or operate the feature after launch.',
        systemsInvolved: 'The product or internal application, approved knowledge sources, a model provider, an evaluation harness, and production telemetry.',
        title: 'Release-ready internal copilot',
      },
    ] satisfies UseCaseContent[],
  },
  delivery: {
    heading: {
      badge: 'Delivery approach',
      body: 'Strategy, engineering, and adoption stay connected, but each stage answers a different question.',
      title: 'Map the decision, build against real context, then transfer ownership.',
    },
    pipelineLabel: 'How the system comes together',
    stages: [
      {
        body: 'Choose a candidate by business value, available context, failure cost, and the person accountable for the result.',
        title: 'Map',
      },
      {
        body: 'Implement against representative records and exercise permissions, exception paths, and quality checks before rollout.',
        title: 'Build',
      },
      {
        body: 'Set the operating signals, document override paths, train the owner, and hand over a release process the team can run.',
        title: 'Activate',
      },
    ],
  },
  proof: {
    claims: [
      {
        body: 'AI delivery has been run inside a utility-scale enterprise where operating controls and accountable ownership are part of the work.',
        title: 'Enterprise delivery',
      },
      {
        body: 'Agents have been connected to Salesforce with governed context, actions, and customer-record updates.',
        title: 'CRM execution',
      },
      {
        body: 'Internal MCP tools and agent harnesses support daily engineering work instead of ending as presentation artifacts.',
        title: 'Engineer-operated tooling',
      },
    ],
    heading: {
      badge: 'Public proof',
      body: 'Ahzi states what can be backed by shipped work and keeps platform names separate from formal partner claims.',
      title: 'Proof is specific enough to inspect.',
    },
    platformHeading: 'Implementation targets',
    platforms,
    platformNote: 'Platform names describe implementation experience and integration targets, not formal partner claims.',
  },
  engagement: {
    cta: callsToAction.engagement,
    deliverables: [
      'A ranked opportunity with the riskiest assumption identified',
      'A working path through the relevant systems and controls',
      'An evaluation plan tied to the release decision',
      'A handoff map naming the owner, exceptions, and operating signals',
    ],
    deliverablesTitle: 'What the team leaves with',
    heading: {
      badge: 'First engagement',
      body: 'The opening scope is deliberately narrow so the team can test the hard part before expanding the investment.',
      title: 'Start with one decision about one valuable process.',
    },
    startingPoint: 'Bring a business-critical process with a clear owner, real examples, and a known delay, error, or control problem.',
    startingPointTitle: 'Starting point',
  },
  conversion: {
    formTitle: 'Share the workflow context',
    heading: {
      badge: 'Workflow fit review',
      body: 'Describe what happens today, the system underneath it, and the point where work slows down or becomes hard to trust.',
      title: 'Bring the workflow, not a finished AI plan.',
    },
    replyCovers: [
      'Whether the process fits a focused first engagement',
      'Which assumption or control deserves the earliest test',
      'What information would make the next conversation useful',
    ],
    replyTitle: 'The first reply covers',
  },
  callsToAction: Object.values(callsToAction),
  footer: {
    cta: callsToAction.footer,
    tagline: 'Ahzi // Enterprise AI that ships.',
  },
} as const
