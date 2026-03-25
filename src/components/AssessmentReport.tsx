/**
 * ASSESSMENT REPORT COMPONENT
 * Renders a detailed phonics progress report for a student.
 * Supports screen display (in an overlay) and print via window.print().
 */

import { PHONICS_GROUPS } from '../data/phonics';
import { getRecentActivities } from '../services/activityLogger';
import type { PhonicsAssessment, SoundAssessmentResult } from '../services/assessmentService';
import './AssessmentReport.css';

// ============================================================
// TYPES
// ============================================================

export interface AssessmentReportProps {
  assessment: PhonicsAssessment;
  studentName: string;
  userId: string;
  onPrint: () => void;
  onClose: () => void;
}

// ============================================================
// INLINE SVG ICONS
// ============================================================

function IconPrint({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ============================================================
// HELPERS
// ============================================================

function groupAverageMastery(
  soundResults: SoundAssessmentResult[],
  groupNum: number,
): number {
  const groupSounds = soundResults.filter((r) => r.phonicsGroup === groupNum);
  if (groupSounds.length === 0) return 0;
  return Math.round(
    groupSounds.reduce((sum, r) => sum + r.masteryPercent, 0) /
      groupSounds.length,
  );
}

function formatActivityDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function soundCellClass(status: SoundAssessmentResult['status']): string {
  switch (status) {
    case 'mastered':     return 'ar-sound-cell ar-sound-cell--mastered';
    case 'in_progress':  return 'ar-sound-cell ar-sound-cell--in-progress';
    case 'needs_work':   return 'ar-sound-cell ar-sound-cell--needs-work';
    default:             return 'ar-sound-cell ar-sound-cell--not-started';
  }
}

function groupFillClass(pct: number): string {
  if (pct >= 80) return 'ar-group-fill ar-group-fill--mastered';
  if (pct < 30)  return 'ar-group-fill ar-group-fill--low';
  return 'ar-group-fill';
}

// ============================================================
// SUB-SECTIONS
// ============================================================

function ReportHeader({
  studentName,
  dateGenerated,
  assessmentPeriod,
}: {
  studentName: string;
  dateGenerated: string;
  assessmentPeriod: string;
}) {
  return (
    <div className="ar-header">
      <div>
        <div className="ar-logo">MinesMinis</div>
        <div className="ar-logo-sub">Phonics Assessment Report</div>
      </div>
      <div className="ar-header-meta">
        <div className="ar-student-name">{studentName}</div>
        <div className="ar-header-date">Generated: {dateGenerated}</div>
        <div className="ar-header-period">{assessmentPeriod}</div>
      </div>
    </div>
  );
}

function SummaryStrip({ assessment }: { assessment: PhonicsAssessment }) {
  return (
    <div className="ar-summary-strip">
      <div className="ar-metric-card ar-metric-card--mastered">
        <div className="ar-metric-value">
          {assessment.soundsMastered}
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            /{assessment.soundResults.length}
          </span>
        </div>
        <div className="ar-metric-label">Sounds Mastered</div>
      </div>

      <div className="ar-metric-card ar-metric-card--accuracy">
        <div className="ar-metric-value">{assessment.averageAccuracy}%</div>
        <div className="ar-metric-label">Avg Accuracy</div>
      </div>

      <div className="ar-metric-card ar-metric-card--streak">
        <div className="ar-metric-value">{assessment.streakDays}</div>
        <div className="ar-metric-label">Day Streak</div>
      </div>

      <div className="ar-metric-card ar-metric-card--reading">
        <div className="ar-metric-value">
          {assessment.estimatedReadingLevelTr}
        </div>
        <div className="ar-metric-label">Reading Level</div>
      </div>
    </div>
  );
}

function GroupProgress({
  soundResults,
}: {
  soundResults: SoundAssessmentResult[];
}) {
  return (
    <div>
      <p className="ar-section-title">Phonics Group Progress</p>
      <div className="ar-groups">
        {PHONICS_GROUPS.map((group) => {
          const pct = groupAverageMastery(soundResults, group.group);
          return (
            <div key={group.group} className="ar-group-row">
              <div className="ar-group-name">
                Gr {group.group}: {group.name}
              </div>
              <div className="ar-group-track">
                <div
                  className={groupFillClass(pct)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="ar-group-pct">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SoundGrid({
  soundResults,
}: {
  soundResults: SoundAssessmentResult[];
}) {
  return (
    <div>
      <p className="ar-section-title">Sound-by-Sound Breakdown</p>
      <div className="ar-sound-grid">
        {soundResults.map((result) => (
          <div
            key={result.soundId}
            className={soundCellClass(result.status)}
            title={`/${result.soundLabel}/ — ${result.masteryPercent}% mastery`}
          >
            <span className="ar-sound-grapheme">{result.soundLabel}</span>
            <span className="ar-sound-pct">
              {result.status === 'not_started'
                ? '—'
                : `${result.masteryPercent}%`}
            </span>
          </div>
        ))}
      </div>

      <div className="ar-legend">
        <div className="ar-legend-item">
          <div className="ar-legend-dot ar-legend-dot--mastered" />
          Mastered (80%+)
        </div>
        <div className="ar-legend-item">
          <div className="ar-legend-dot ar-legend-dot--in-progress" />
          In Progress (40–79%)
        </div>
        <div className="ar-legend-item">
          <div className="ar-legend-dot ar-legend-dot--needs-work" />
          Needs Work (1–39%)
        </div>
        <div className="ar-legend-item">
          <div className="ar-legend-dot ar-legend-dot--not-started" />
          Not Started
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ userId }: { userId: string }) {
  const activities = getRecentActivities(10, userId);

  if (activities.length === 0) {
    return (
      <div>
        <p className="ar-section-title">Recent Activity</p>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          No activity recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="ar-section-title">Recent Activity</p>
      <div className="ar-activity-list">
        {activities.map((act) => (
          <div key={act.id} className="ar-activity-item">
            <span className="ar-activity-type">{act.type}</span>
            <span className="ar-activity-title">{act.title}</span>
            {act.accuracy !== undefined && (
              <span
                className={`ar-activity-acc${act.accuracy < 60 ? ' ar-activity-acc--low' : ''}`}
              >
                {act.accuracy}%
              </span>
            )}
            <span className="ar-activity-date">
              {formatActivityDate(act.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Recommendations({
  recommendations,
  recommendationsTr,
}: {
  recommendations: string[];
  recommendationsTr: string[];
}) {
  if (recommendations.length === 0) return null;

  return (
    <div>
      <p className="ar-section-title">Recommendations</p>
      <div className="ar-recommendations">
        <ul className="ar-rec-list">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="ar-rec-item">
              <span className="ar-rec-bullet" aria-hidden="true" />
              <span>
                {rec}
                {recommendationsTr[idx] && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {recommendationsTr[idx]}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AssessmentReport({
  assessment,
  studentName,
  userId,
  onPrint,
  onClose,
}: AssessmentReportProps) {
  const namedAssessment: PhonicsAssessment = {
    ...assessment,
    studentName,
  };

  return (
    <div
      className="assessment-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Phonics Assessment Report for ${studentName}`}
    >
      <div className="assessment-report">
        {/* Actions bar */}
        <div className="assessment-report-actions">
          <button className="ar-btn ar-btn--print" onClick={onPrint}>
            <IconPrint />
            Print / Save PDF
          </button>
          <button className="ar-btn ar-btn--close" onClick={onClose}>
            <IconX />
            Close
          </button>
        </div>

        {/* Report content */}
        <div className="ar-body">
          <ReportHeader
            studentName={namedAssessment.studentName}
            dateGenerated={namedAssessment.dateGenerated}
            assessmentPeriod={namedAssessment.assessmentPeriod}
          />

          <SummaryStrip assessment={namedAssessment} />

          <hr className="ar-divider" />

          <GroupProgress soundResults={namedAssessment.soundResults} />

          <hr className="ar-divider" />

          <SoundGrid soundResults={namedAssessment.soundResults} />

          <hr className="ar-divider" />

          <ActivityTimeline userId={userId} />

          <hr className="ar-divider" />

          <Recommendations
            recommendations={namedAssessment.recommendations}
            recommendationsTr={namedAssessment.recommendationsTr}
          />

          <div className="ar-footer">
            Generated by MinesMinis &mdash; minesminis.com
          </div>
        </div>
      </div>
    </div>
  );
}
