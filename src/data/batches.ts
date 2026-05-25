// Single source of truth for upcoming batches.
// Update this list weekly: when a batch fills, drop seatsLeft; when a batch
// starts, remove it; when a new batch opens, append it.
// Each batch caps at 4 seats — enforced by tests.

export interface Batch {
  /** Display label like "Mon Jun 1". Keep abbreviation style consistent. */
  dayLabel: string;
  /** Always one of the two tracks. */
  track: 'DevOps' | 'SRE';
  /** Remaining seats. Setting this to 0 marks the row as Full / Waitlist. */
  seatsLeft: number;
  /** Hard cap. Should always be 4 unless the program model changes. */
  seatsTotal: number;
  /** One-line summary of what this batch focuses on. */
  focus: string;
  /** Shift label, e.g. "09:00–17:00 PT" or "13:00–21:00 PT (evening)". */
  shift: string;
}

export const batches: Batch[] = [
  { dayLabel: 'Mon Jun 1',  track: 'DevOps', seatsLeft: 2, seatsTotal: 4, focus: 'CI/CD + AWS + Terraform',      shift: '09:00–17:00 PT' },
  { dayLabel: 'Mon Jun 8',  track: 'SRE',    seatsLeft: 3, seatsTotal: 4, focus: 'On-call + Prometheus + K8s',   shift: '09:00–17:00 PT' },
  { dayLabel: 'Mon Jun 15', track: 'DevOps', seatsLeft: 4, seatsTotal: 4, focus: 'Pipelines + Docker + secrets', shift: '13:00–21:00 PT (evening)' },
  { dayLabel: 'Mon Jun 22', track: 'SRE',    seatsLeft: 4, seatsTotal: 4, focus: 'Incident response + alerting', shift: '09:00–17:00 PT' },
  { dayLabel: 'Mon Jul 6',  track: 'DevOps', seatsLeft: 4, seatsTotal: 4, focus: 'IaC + cost control + GitHub',  shift: '09:00–17:00 PT' },
  { dayLabel: 'Mon Jul 13', track: 'SRE',    seatsLeft: 4, seatsTotal: 4, focus: 'SLOs + runbooks + chaos eng',  shift: '13:00–21:00 PT (evening)' },
];

/** First batch with at least one open seat. Used by the scarcity banner. */
export const nextBatch: Batch | undefined = batches.find((b) => b.seatsLeft > 0);
