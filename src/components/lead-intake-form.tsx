import { ArrowUpRight, Mail, ShieldCheck } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  buildLeadMailTo,
  collectLeadAttribution,
  systemOptions,
  timingOptions,
  validateLeadIntake,
  type LeadIntakeField,
  type LeadIntakeValues,
} from '../lib/lead-intake'
import { foregroundHoverClass } from '../lib/style-classes'

type LeadIntakeFormProps = {
  formTitle: string
  onPrepareDraft: (mailTo: string) => boolean
}

type SubmissionState = 'idle' | 'invalid' | 'blocked' | 'prepared'
type FormErrors = Partial<Record<LeadIntakeField, string>>
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type UpdateValue = (field: keyof LeadIntakeValues) => (event: FormChangeEvent) => void

const fieldClassName =
  'mt-2 w-full rounded-md border border-[var(--line)] bg-[rgb(255_255_255_/_6%)] px-3 py-3 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent-wash)]'
const labelClassName = 'text-sm font-semibold text-[var(--foreground)]'

function createInitialValues(): LeadIntakeValues {
  return {
    company: '',
    email: '',
    name: '',
    system: '',
    timing: '',
    website: '',
    workflow: '',
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <span className="mt-2 block text-sm text-[var(--accent-soft)]" id={id}>
      {message}
    </span>
  )
}

type TextFieldProps = {
  autoComplete: string
  error?: string
  id: string
  label: string
  maxLength: number
  name: 'company' | 'email' | 'name'
  optional?: boolean
  required?: boolean
  type?: 'email' | 'text'
  updateValue: UpdateValue
  value: string
}

function TextField({
  autoComplete,
  error,
  id,
  label,
  maxLength,
  name,
  optional,
  required,
  type = 'text',
  updateValue,
  value,
}: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label className={labelClassName} htmlFor={id}>
        {label}{' '}
        {required ? <span aria-hidden="true">*</span> : null}
        {optional ? (
          <span className="font-normal text-[var(--foreground-subtle)]">(optional)</span>
        ) : null}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={fieldClassName}
        id={id}
        maxLength={maxLength}
        name={name}
        onChange={updateValue(name)}
        required={required}
        type={type}
        value={value}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

type SelectFieldProps = {
  error?: string
  id: string
  label: string
  name: 'system' | 'timing'
  options: readonly string[]
  updateValue: UpdateValue
  value: string
}

function SelectField({
  error,
  id,
  label,
  name,
  options,
  updateValue,
  value,
}: SelectFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label className={labelClassName} htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={fieldClassName}
        id={id}
        name={name}
        onChange={updateValue(name)}
        required
        value={value}
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

function FormHeader({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--accent-wash)] text-[var(--accent)]">
        <Mail aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
          Share enough context for a specific first reply. Required fields are marked.
        </p>
      </div>
    </div>
  )
}

function IdentityFields({
  errors,
  updateValue,
  values,
}: {
  errors: FormErrors
  updateValue: UpdateValue
  values: LeadIntakeValues
}) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <TextField autoComplete="name" error={errors.name} id="lead-name" label="Name" maxLength={80} name="name" required updateValue={updateValue} value={values.name} />
      <TextField autoComplete="email" error={errors.email} id="lead-email" label="Work email" maxLength={254} name="email" required type="email" updateValue={updateValue} value={values.email} />
      <TextField autoComplete="organization" error={errors.company} id="lead-company" label="Company" maxLength={120} name="company" optional updateValue={updateValue} value={values.company} />
      <SelectField error={errors.system} id="lead-system" label="Current system" name="system" options={systemOptions} updateValue={updateValue} value={values.system} />
    </div>
  )
}

function WorkflowFields({
  errors,
  updateValue,
  values,
}: {
  errors: FormErrors
  updateValue: UpdateValue
  values: LeadIntakeValues
}) {
  return (
    <>
      <div className="mt-5">
        <label className={labelClassName} htmlFor="lead-workflow">
          Workflow to review <span aria-hidden="true">*</span>
        </label>
        <textarea
          aria-describedby={`lead-workflow-help${errors.workflow ? ' lead-workflow-error' : ''}`}
          aria-invalid={Boolean(errors.workflow)}
          className={`${fieldClassName} min-h-32 resize-y`}
          id="lead-workflow"
          maxLength={1500}
          name="workflow"
          onChange={updateValue('workflow')}
          placeholder="What happens today, who owns it, and where does the delay or error cost show up?"
          required
          value={values.workflow}
        />
        <span className="mt-2 block text-sm text-[var(--foreground-subtle)]" id="lead-workflow-help">
          Include the business result and the system underneath it.
        </span>
        <FieldError id="lead-workflow-error" message={errors.workflow} />
      </div>
      <div className="mt-5">
        <SelectField error={errors.timing} id="lead-timing" label="Timing" name="timing" options={timingOptions} updateValue={updateValue} value={values.timing} />
      </div>
    </>
  )
}

function Honeypot({ updateValue, value }: { updateValue: UpdateValue; value: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label htmlFor="lead-website">Website</label>
      <input
        autoComplete="off"
        id="lead-website"
        name="website"
        onChange={updateValue('website')}
        tabIndex={-1}
        value={value}
      />
    </div>
  )
}

function initialAttribution() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return collectLeadAttribution('https://ahzi.tech/', '')
  }

  return collectLeadAttribution(window.location.href, document.referrer)
}

function useLeadIntakeController(onPrepareDraft: LeadIntakeFormProps['onPrepareDraft']) {
  const [values, setValues] = useState(createInitialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const [preparedMailTo, setPreparedMailTo] = useState('')
  const [attribution] = useState(initialAttribution)
  const startedAtRef = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const updateValue =
    (field: keyof LeadIntakeValues) =>
    (event: FormChangeEvent) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      setSubmissionState('idle')
    }

  const focusFirstError = (fieldErrors: FormErrors) => {
    const firstInvalidField = Object.keys(fieldErrors)[0]
    if (!firstInvalidField) return

    window.requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
        ?.focus()
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = validateLeadIntake(values, startedAtRef.current, Date.now())

    if (result.isSpam) {
      setSubmissionState('blocked')
      return
    }

    if (Object.keys(result.errors).length) {
      setErrors(result.errors)
      setSubmissionState('invalid')
      focusFirstError(result.errors)
      return
    }

    const mailTo = buildLeadMailTo(values, attribution)
    setErrors({})
    setPreparedMailTo(mailTo)
    setSubmissionState(onPrepareDraft(mailTo) ? 'prepared' : 'blocked')
  }

  return { errors, formRef, handleSubmit, preparedMailTo, submissionState, updateValue, values }
}

function statusMessage(submissionState: SubmissionState) {
  if (submissionState === 'invalid') {
    return 'Review the highlighted fields, then prepare the request again.'
  }
  if (submissionState === 'blocked') {
    return 'The email draft did not open. Use the form controls, then try again.'
  }
  if (submissionState === 'prepared') {
    return 'Your email draft is ready. Send it to complete the workflow review request.'
  }
  return ''
}

function SubmissionFeedback({
  preparedMailTo,
  submissionState,
}: {
  preparedMailTo: string
  submissionState: SubmissionState
}) {
  const message = statusMessage(submissionState)
  if (!message) return null

  return (
    <div
      className="mt-5 rounded-md border border-[var(--accent-border)] bg-[var(--accent-wash)] p-4 text-sm leading-6 text-[var(--foreground)]"
      role={submissionState === 'invalid' || submissionState === 'blocked' ? 'alert' : 'status'}
    >
      {message}
      {submissionState === 'prepared' && preparedMailTo ? (
        <>
          {' '}
          <a className={`font-semibold underline ${foregroundHoverClass}`} href={preparedMailTo}>
            Open the draft again.
          </a>
        </>
      ) : null}
    </div>
  )
}

function PrivacyNote() {
  return (
    <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--foreground-subtle)]">
      <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      Your details stay in an email draft on your device until you send it. This site loads no
      third-party form or analytics scripts.
    </p>
  )
}

export function LeadIntakeForm({ formTitle, onPrepareDraft }: LeadIntakeFormProps) {
  const {
    errors,
    formRef,
    handleSubmit,
    preparedMailTo,
    submissionState,
    updateValue,
    values,
  } = useLeadIntakeController(onPrepareDraft)

  return (
    <form
      className="photo-card rounded-md border border-[var(--line)] p-5 shadow-[var(--panel-shadow)] sm:p-7"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <FormHeader title={formTitle} />

      <IdentityFields
        errors={errors}
        updateValue={updateValue}
        values={values}
      />

      <WorkflowFields
        errors={errors}
        updateValue={updateValue}
        values={values}
      />
      <Honeypot
        updateValue={updateValue}
        value={values.website}
      />

      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-6 text-base font-semibold text-[var(--accent-foreground)] transition hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
        data-slot="button"
        type="submit"
      >
        Prepare my review request
        <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
      </button>

      <SubmissionFeedback
        preparedMailTo={preparedMailTo}
        submissionState={submissionState}
      />
      <PrivacyNote />
    </form>
  )
}
