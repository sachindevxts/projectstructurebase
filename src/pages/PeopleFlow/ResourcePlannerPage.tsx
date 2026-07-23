import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const plannerRows = [
  {
    initials: 'AM',
    name: 'Aditi Mehra',
    role: 'Sr. React Dev',
    badge: '100%',
    tone: 'green',
    bars: [
      { label: 'NovaBank Portal · 70%', start: '2025-06-05', end: '2025-08-15', tone: 'billable' },
      { label: 'Internal HR · 30%', start: '2025-06-05', end: '2025-08-31', tone: 'nonBillable' },
    ],
  },
  {
    initials: 'RV',
    name: 'Rahul Verma',
    role: 'Backend Eng.',
    badge: '100%',
    tone: 'green',
    bars: [
      {
        label: 'BrightRetail Commerce · 100%',
        start: '2025-06-01',
        end: '2025-08-31',
        tone: 'full',
      },
    ],
  },
  {
    initials: 'PS',
    name: 'Priya Singh',
    role: 'QA Lead',
    badge: '50%',
    tone: 'blue',
    bars: [
      {
        label: 'HealthBridge Mobile · 50%',
        start: '2025-06-15',
        end: '2025-08-15',
        tone: 'partial',
      },
    ],
  },
  {
    initials: 'NJ',
    name: 'Neha Joshi',
    role: 'UI/UX Designer',
    badge: '130% ⚠',
    tone: 'red',
    danger: true,
    bars: [
      { label: 'HealthBridge · 80%', start: '2025-06-01', end: '2025-08-20', tone: 'over' },
      {
        label: 'Internal Platform · 50%',
        start: '2025-06-10',
        end: '2025-08-31',
        tone: 'overSecondary',
      },
    ],
  },
  {
    initials: 'AD',
    name: 'Amit Dubey',
    role: 'Java Developer',
    badge: 'Bench',
    tone: 'slate',
    bars: [
      {
        label: 'No Allocation · Bench 68 days',
        start: '2025-06-20',
        end: '2025-08-26',
        tone: 'bench',
      },
    ],
  },
  {
    initials: 'KM',
    name: 'Karan Malhotra',
    role: 'Tech Lead',
    badge: 'Releasing',
    tone: 'orange',
    bars: [
      {
        label: 'Internal HR · 100% — Ends Aug 1',
        start: '2025-06-01',
        end: '2025-08-01',
        tone: 'releasing',
      },
    ],
  },
  {
    initials: 'MN',
    name: 'Meera Nair',
    role: 'React Dev',
    badge: '50%',
    tone: 'blue',
    bars: [
      { label: 'HealthBridge · 50%', start: '2025-07-10', end: '2025-08-31', tone: 'partial' },
    ],
  },
];

const DAY_WIDTH = 36;
const DAY_MS = 86_400_000;
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const allocationDates = plannerRows.flatMap((row) =>
  row.bars.flatMap((bar) => [new Date(`${bar.start}T00:00:00`), new Date(`${bar.end}T00:00:00`)]),
);
const minimumYear = Math.min(
  TODAY.getFullYear(),
  ...allocationDates.map((date) => date.getFullYear()),
);
const maximumYear = Math.max(
  TODAY.getFullYear(),
  ...allocationDates.map((date) => date.getFullYear()),
);
const TIMELINE_START = new Date(minimumYear - 1, 0, 1);
const TIMELINE_END = new Date(maximumYear + 1, 11, 31);
const days = Array.from(
  { length: Math.round((TIMELINE_END.getTime() - TIMELINE_START.getTime()) / DAY_MS) + 1 },
  (_, index) => new Date(TIMELINE_START.getTime() + index * DAY_MS),
);
const dayOffset = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  return Math.round((date.getTime() - TIMELINE_START.getTime()) / DAY_MS);
};
const timelineStyle = {
  '--timeline-width': `${days.length * DAY_WIDTH}px`,
  '--timeline-columns': days.length,
  '--today-left': `${dayOffset(TODAY) * DAY_WIDTH}px`,
} as CSSProperties;
const allocationStyle = (start: string, end: string) =>
  ({
    '--allocation-left': `${dayOffset(start) * DAY_WIDTH}px`,
    '--allocation-width': `${(dayOffset(end) - dayOffset(start) + 1) * DAY_WIDTH}px`,
  }) as CSSProperties;

export default function ResourcePlannerPage() {
  const navigate = useNavigate();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState('Month');
  const [group, setGroup] = useState('By Employee');
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );

  const scrollToDate = (date: Date, behavior: ScrollBehavior = 'smooth') => {
    timelineRef.current?.scrollTo({ left: dayOffset(date) * DAY_WIDTH, behavior });
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const changeMonth = (amount: number) => {
    const target = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1);
    scrollToDate(target);
  };

  useEffect(() => {
    timelineRef.current?.scrollTo({ left: dayOffset(TODAY) * DAY_WIDTH, behavior: 'auto' });
  }, []);

  const handleTimelineScroll = () => {
    if (!timelineRef.current) return;
    const firstVisibleDay = Math.max(0, Math.round(timelineRef.current.scrollLeft / DAY_WIDTH));
    const date = days[Math.min(firstVisibleDay, days.length - 1)];
    if (date) setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };
  return (
    <div className="pf-planner">
      <header className="pf-planner-toolbar">
        <div className="pf-planner-toolbar__primary">
          <h1>Resource Planner</h1>
          <div className="pf-segmented">
            {['Month', 'Week', 'Day'].map((value) => (
              <button
                key={value}
                className={period === value ? 'active' : ''}
                onClick={() => setPeriod(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="pf-segmented">
            {['By Employee', 'By Project', 'Heatmap'].map((value) => (
              <button
                key={value}
                className={group === value ? 'active' : ''}
                onClick={() => setGroup(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div
            className="pf-planner-month"
            onClick={(event) => {
              const button = (event.target as HTMLElement).closest('button');
              if (button?.ariaLabel === 'Previous month') changeMonth(-1);
              if (button?.ariaLabel === 'Next month') changeMonth(1);
              if (button?.textContent?.trim() === 'Today') scrollToDate(TODAY);
            }}
          >
            <span className="pf-planner-month__label" aria-live="polite">
              {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button aria-label="Previous month">‹</button>
            <strong>June – August 2025</strong>
            <button aria-label="Next month">›</button>
            <button>Today</button>
          </div>
        </div>
        <div className="pf-planner-toolbar__filters">
          <select aria-label="Department">
            <option>All Departments</option>
          </select>
          <select aria-label="Skill">
            <option>All Skills</option>
          </select>
          <button className="pf-button" onClick={() => navigate('/allocations/new')}>
            ＋ Add Allocation
          </button>
        </div>
      </header>
      <div className="pf-legend">
        <span className="pf-legend__real-today">
          — Today ({TODAY.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
        </span>
        <strong>Legend:</strong>
        {[
          ['billable', 'Billable'],
          ['non-billable', 'Non-Billable'],
          ['over', 'Overallocated'],
          ['full', 'Fully Allocated'],
          ['releasing', 'Releasing Soon'],
          ['bench', 'Bench'],
        ].map(([tone, label]) => (
          <span key={tone} className={`pf-legend__item pf-legend__item--${tone}`}>
            {label}
          </span>
        ))}
        <span className="pf-legend__today">— Today (Jul 15)</span>
      </div>
      <div
        ref={timelineRef}
        className="pf-timeline"
        role="region"
        aria-label="Scrollable allocation timeline"
        tabIndex={0}
        onScroll={handleTimelineScroll}
      >
        <div className="pf-timeline__inner" style={timelineStyle}>
          <div className="pf-timeline-head">
            <strong>Employee</strong>
            <div className="pf-timeline-days">
              {days.map((day) => (
                <span
                  key={day.toISOString()}
                  className={day.getTime() === TODAY.getTime() ? 'active' : ''}
                >
                  {day.getDate() === 1
                    ? day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : day.getDate()}
                </span>
              ))}
            </div>
          </div>
          {plannerRows.map((row, index) => (
            <div className={`pf-timeline-row${row.danger ? ' danger' : ''}`} key={row.name}>
              <div className="pf-timeline-person">
                <span className={`pf-avatar pf-avatar--${index % 3}`}>{row.initials}</span>
                <span>
                  <b>{row.name}</b>
                  <small>{row.role}</small>
                  <em className={`pf-planner-badge pf-planner-badge--${row.tone}`}>{row.badge}</em>
                </span>
              </div>
              <div className="pf-timeline-track">
                <span className="today" />
                {row.bars.map((bar) => (
                  <i
                    key={bar.label}
                    className={`allocation allocation--${bar.tone}`}
                    style={allocationStyle(bar.start, bar.end)}
                  >
                    <span className="allocation__label">{bar.label}</span>
                  </i>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
