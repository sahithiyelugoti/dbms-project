import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
type Page =
  | 'home'
  | 'student'
  | 'mentor'
  | 'explore'
  | 'profile'
  | 'mentees'
  | 'sessions'
  | 'resources'
  | 'settings'
  | 'login'
  | 'signup'
  | 'forgot';

type Role = 'Student' | 'Mentor';

const API_URL = 'http://localhost:5000/api/auth';

const avatars = [
  'https://images.unsplash.com/photo-1667655861998-46fe4c29a4cf?crop=faces&fit=crop&fm=jpg&q=80&w=240&h=240',
  'https://images.unsplash.com/photo-1604177091072-b7b677a077f6?crop=faces&fit=crop&fm=jpg&q=80&w=240&h=240',
  'https://images.unsplash.com/photo-1632507273499-df468b359d7d?crop=faces&fit=crop&fm=jpg&q=80&w=240&h=240',
  'https://images.unsplash.com/photo-1667655699558-8f1b362a67a8?crop=faces&fit=crop&fm=jpg&q=80&w=240&h=240',
];

const mentors = [
  {
    name: 'GayathriJ',
    dept: 'Computer Engineering',
    year: 'Final year',
    skills: ['DSA', 'C++', 'DBMS'],
    rating: 4.9,
    slots: 3,
    image: avatars[0],
    bio: 'Makes algorithms approachable through patient, practical explanations.',
  },
  {
    name: 'SahithiReddy',
    dept: 'Electronics Engineering',
    year: '3rd year',
    skills: ['Python', 'Mathematics', 'ML'],
    rating: 4.8,
    slots: 2,
    image: avatars[1],
    bio: 'Helps juniors build strong foundations through visual examples.',
  },
  {
    name: 'MahathiSS',
    dept: 'Computer Engineering',
    year: 'Final year',
    skills: ['Web Dev', 'OOP', 'React'],
    rating: 4.9,
    slots: 4,
    image: avatars[2],
    bio: 'Enjoys turning complex development topics into clear next steps.',
  },
];

const resources = [
  {
    type: 'Roadmap',
    title: 'DSA semester roadmap',
    subject: 'Data Structures',
    meta: '12 weeks · Beginner',
    color: 'lime',
  },
  {
    type: 'Notes',
    title: 'DBMS normalization made simple',
    subject: 'DBMS',
    meta: 'PDF · 18 pages',
    color: 'mint',
  },
  {
    type: 'Problems',
    title: '50 essential graph problems',
    subject: 'Algorithms',
    meta: 'Practice set · Intermediate',
    color: 'peach',
  },
  {
    type: 'Reference',
    title: 'Operating Systems quick revision',
    subject: 'Operating Systems',
    meta: 'Cheat sheet · 8 pages',
    color: 'blue',
  },
  {
    type: 'Assignment',
    title: 'Build a REST API with Node',
    subject: 'Web Development',
    meta: 'Project · Intermediate',
    color: 'mint',
  },
  {
    type: 'Notes',
    title: 'Discrete mathematics handbook',
    subject: 'Mathematics',
    meta: 'PDF · 32 pages',
    color: 'lime',
  },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
        <path d="M4 5.5v14" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    upload: (
      <>
        <path d="M12 16V4m0 0-4 4m4-4 4 4" />
        <path d="M4 16v4h16v-4" />
      </>
    ),
    bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.grid}
    </svg>
  );
}

function LearningDoodle() {
  return (
    <div
      className="learning-doodle"
      aria-label="Doodle of books, ideas, and students learning together"
      role="img"
    >
      <svg viewBox="0 0 620 540" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="doodle-orbit" d="M82 298C54 157 163 49 314 52c167 3 273 109 246 254-24 132-137 202-287 184C139 474 103 402 82 298Z" />
        <path className="doodle-squiggle" d="M72 113c34-35 62 24 93-8 30-31 46 18 75-9" />
        <path className="doodle-arrow" d="M469 91c43 14 62 43 55 81m0 0-16-19m16 19 20-17" />
        <rect className="doodle-card" x="116" y="112" width="390" height="310" rx="34" />
        <path className="doodle-page" d="M202 204l111-29 25 184-111 24z" />
        <path className="doodle-book" d="M289 186l118-25 41 181-118 26z" />
        <path className="doodle-book-line" d="m329 225 65-14m-60 36 71-15m-65 39 50-11" />
        <path className="doodle-pencil" d="m176 321 91-105 22 19-93 104-30 12z" />
        <path className="doodle-pencil-tip" d="m176 321-10 30 30-12" />
        <path className="doodle-leaf" d="M421 299c38-58 73-34 63 5-9 37-52 47-63-5Zm0 0c-28-41-57-21-47 12 9 27 42 24 47-12Z" />
        <path className="doodle-stem" d="M421 300v55" />
        <path className="doodle-spark" d="m154 176 8 18 18 8-18 8-8 18-8-18-18-8 18-8z" />
        <path className="doodle-spark small" d="m474 241 5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
        <circle className="doodle-dot" cx="102" cy="389" r="8" />
        <circle className="doodle-dot" cx="534" cy="360" r="12" />
        <text x="338" y="201" className="doodle-text">ABC</text>
        <text x="309" y="461" className="doodle-caption" textAnchor="middle">LEARN · SHARE · GROW</text>
      </svg>
      <div className="doodle-note note-one">
        <span>✦</span>
        <div><strong>Learn together</strong><small>Peer-to-peer support</small></div>
      </div>
      <div className="doodle-note note-two">
        <span>✓</span>
        <div><strong>Student to student</strong><small>Built around campus life</small></div>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Brand({ go }: { go: (p: Page) => void }) {
  return (
    <button className="brand" onClick={() => go('home')} aria-label="Cognitrade home">
      <span className="brand-mark">C</span>
      <span>Cognitrade</span>
    </button>
  );
}

function Avatar({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .replace(/[^a-zA-Z ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return <span className={`avatar avatar-${size}`} aria-label={name}>{initials || 'S'}</span>;
}

function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Progress({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className="progress" role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${safeValue}%` }} />
    </div>
  );
}

function PublicHeader({ go }: { go: (p: Page) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="public-header">
      <Brand go={go} />
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav className={open ? 'public-nav open' : 'public-nav'}>
        <button onClick={() => { go('home'); setOpen(false); }}>Home</button>
        <button onClick={() => { go('explore'); setOpen(false); }}>Explore mentors</button>
        <button onClick={() => {
          go('home');
          setOpen(false);
          window.setTimeout(() => document.querySelector('#how')?.scrollIntoView(), 20);
        }}>
          How it works
        </button>
      </nav>
      <div className="header-actions">
        <Button variant="ghost" onClick={() => go('login')}>Log in</Button>
        <Button onClick={() => go('signup')}>Sign up <span>↗</span></Button>
      </div>
    </header>
  );
}

function Landing({ go }: { go: (p: Page) => void }) {
  return (
    <div>
      <PublicHeader go={go} />
      <main>
        <section className="hero section">
          <div className="hero-copy">
            <Badge tone="lime">Made for the SVNIT community</Badge>
            <h1>Good at something?<br /><em>Share what you know.</em></h1>
            <p>Find a senior who can help you crack a tough concept—or become the mentor you wish you had in your first year.</p>
            <div className="hero-actions">
              <Button onClick={() => go('explore')}>Find a mentor <span>→</span></Button>
              <Button variant="secondary" onClick={() => go('signup')}>Become a mentor</Button>
            </div>
            <div className="trust-row">
              <div className="avatar-stack">
                {mentors.map((mentor) => <Avatar key={mentor.name} src={mentor.image} name={mentor.name} size="sm" />)}
              </div>
              <div><strong>500+ SVNIT learners</strong><span>Learning together across 10+ departments</span></div>
            </div>
          </div>
          <div className="hero-visual"><LearningDoodle /></div>
        </section>

        <section className="role-section section">
          <div className="section-heading centered">
            <span className="eyebrow">Start where you are</span>
            <h2>How would you like to begin?</h2>
            <p>One campus. Many skills. More ways to learn.</p>
          </div>
          <div className="role-grid">
            <button className="role-card student-role" onClick={() => go('student')}>
              <span className="role-number">01</span>
              <span className="role-icon"><Icon name="book" size={28} /></span>
              <span className="eyebrow">I want to learn</span>
              <strong>I'm a Student</strong>
              <p>Find a mentor, book study sessions, and build confidence one concept at a time.</p>
              <span className="text-link">Explore as a student <span>→</span></span>
            </button>
            <button className="role-card mentor-role" onClick={() => go('mentor')}>
              <span className="role-number">02</span>
              <span className="role-icon"><Icon name="people" size={28} /></span>
              <span className="eyebrow">I want to teach</span>
              <strong>I'm a Mentor</strong>
              <p>Guide juniors, share useful resources, and make your campus knowledge count.</p>
              <span className="text-link">Start mentoring <span>→</span></span>
            </button>
          </div>
        </section>

        <section className="featured-section section">
          <div className="section-heading split">
            <div><span className="eyebrow">Meet your peer mentors</span><h2>Help for your next<br />big concept.</h2></div>
            <Button variant="secondary" onClick={() => go('explore')}>View all mentors <span>→</span></Button>
          </div>
          <div className="mentor-grid">{mentors.map((m) => <MentorCard key={m.name} mentor={m} go={go} />)}</div>
        </section>

        <section id="how" className="how-section section">
          <div className="section-heading centered"><span className="eyebrow">Simple by design</span><h2>From “I’m stuck” to “I get it.”</h2></div>
          <div className="steps">
            {[
              ['01', 'Create your profile', 'Tell us your department, year, and what you want to learn.'],
              ['02', 'Find your mentor', 'Search by subject, skill, availability, or department.'],
              ['03', 'Learn every week', 'Book focused sessions, get resources, and practise together.'],
              ['04', 'See your progress', 'Track concepts, attendance, goals, and weekly momentum.'],
            ].map(([n, t, d]) => (
              <div className="step" key={n}><span>{n}</span><div className="step-line" /><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </section>

        <section className="testimonial section">
          <div className="quote-mark">“</div>
          <blockquote>My senior explained recursion with an example from our own lab assignment. In one hour, it finally clicked.</blockquote>
          <div className="quote-person"><Avatar src={avatars[0]} name="GayathriJ" size="sm" /><div><strong>GayathriJ</strong><span>2nd year, Computer Engineering</span></div></div>
        </section>

        <section className="final-cta section">
          <span className="eyebrow">Your campus community</span>
          <h2>Someone on campus can help.<br /><em>Someone on campus is you.</em></h2>
          <p>Learn generously. Teach confidently. Grow together.</p>
          <Button variant="secondary" onClick={() => go('signup')}>Join Cognitrade <span>→</span></Button>
        </section>
      </main>
      <footer>
        <Brand go={go} />
        <p>Learn Together, Grow Together.</p>
        <div><button>About</button><button>Community guidelines</button><button>Contact</button><button>Privacy</button></div>
        <small>© 2025 Cognitrade · Built for SVNIT</small>
      </footer>
    </div>
  );
}

function MentorCard({ mentor: m, go }: { mentor: typeof mentors[0]; go: (p: Page) => void }) {
  return (
    <article className="mentor-card">
      <div className="mentor-top"><Avatar src={m.image} name={m.name} size="lg" /><Badge tone="green"><span className="dot" /> Available</Badge></div>
      <h3>{m.name}</h3>
      <p className="mentor-meta">{m.dept} · {m.year}</p>
      <p className="mentor-bio">{m.bio}</p>
      <div className="skill-list">{m.skills.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}</div>
      <div className="mentor-footer"><div><strong>★ {m.rating}</strong><span> · 28 reviews</span></div><button onClick={() => go('profile')} aria-label={`View ${m.name}'s profile`}><Icon name="arrow" /></button></div>
    </article>
  );
}

const sideItems: { id: Page; label: string; icon: string }[] = [
  { id: 'student', label: 'Overview', icon: 'grid' },
  { id: 'explore', label: 'Explore mentors', icon: 'search' },
  { id: 'mentees', label: 'Mentorship', icon: 'people' },
  { id: 'sessions', label: 'Sessions', icon: 'calendar' },
  { id: 'resources', label: 'Resources', icon: 'book' },
  { id: 'settings', label: 'Profile & settings', icon: 'settings' },
];

function AppShell({
  page,
  go,
  role,
  children,
}: {
  page: Page;
  go: (p: Page) => void;
  role: 'student' | 'mentor';
  children: ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{
    student_id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    bio?: string | null;
  } | null>(null);

  useEffect(() => {
    function loadUser() {
      const savedUser = localStorage.getItem('cognitradeUser');

      if (!savedUser) {
        setLoggedInUser(null);
        return;
      }

      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('cognitradeUser');
        setLoggedInUser(null);
      }
    }

    loadUser();

    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const displayName = loggedInUser
    ? `${loggedInUser.first_name || ''} ${loggedInUser.last_name || ''}`.trim()
    : '';

  const nav =
    role === 'mentor'
      ? sideItems.map((i) =>
          i.id === 'student' ? { ...i, id: 'mentor' as Page } : i,
        )
      : sideItems;

  function handleLogout() {
    localStorage.removeItem('cognitradeUser');
    localStorage.removeItem('cognitradeRole');
    setLoggedInUser(null);
    go('home');
  }

  return (
    <div className="app-shell">
      <aside className={mobile ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-brand">
          <Brand go={go} />
          <button onClick={() => setMobile(false)}>
            <Icon name="close" />
          </button>
        </div>

        <div className="role-switch">
          <span>
            {role === 'mentor' ? 'Mentor workspace' : 'Student workspace'}
          </span>
          <small>SVNIT community</small>
        </div>

        <nav>
          {nav.map((i) => (
            <button
              key={i.id}
              className={page === i.id ? 'active' : ''}
              onClick={() => {
                go(i.id);
                setMobile(false);
              }}
            >
              <Icon name={i.icon} />
              <span>{i.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-help">
          <Icon name="book" />
          <strong>Need a hand?</strong>
          <p>Visit the community guide or send us a message.</p>
          <button>Get support →</button>
        </div>

        <div className="sidebar-user">
          <Avatar
            src={role === 'mentor' ? avatars[1] : avatars[0]}
            name={displayName || 'Student'}
            size="sm"
          />

          <div>
            <strong>{displayName || 'Student'}</strong>
            <span>
              {role === 'mentor' ? 'Mentor' : 'Student'} · SVNIT
            </span>
          </div>

          <button onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <button
            className="mobile-app-menu"
            onClick={() => setMobile(true)}
          >
            <Icon name="menu" />
          </button>

          <div className="app-search">
            <Icon name="search" />
            <input
              aria-label="Search"
              placeholder="Search mentors, sessions, resources..."
            />
          </div>

          <div className="app-actions">
            <button className="icon-btn">
              <Icon name="bell" />
              <span />
            </button>

            <Button
              onClick={() =>
                go(role === 'mentor' ? 'sessions' : 'explore')
              }
            >
              <Icon name="plus" size={17} />
              {role === 'mentor' ? 'Create session' : 'Find a mentor'}
            </Button>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>

        <nav className="mobile-bottom">
          {nav.slice(0, 5).map((i) => (
            <button
              key={i.id}
              className={page === i.id ? 'active' : ''}
              onClick={() => go(i.id)}
            >
              <Icon name={i.icon} />
              <span>{i.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>;
}

function Metric({ icon, label, value, detail, tone = 'mint' }: { icon: string; label: string; value: string; detail: string; tone?: string }) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}><Icon name={icon} /></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>;
}

function StudentDashboard({ go }: { go: (p: Page) => void }) {
  return (
    <AppShell page="student" go={go} role="student">
      <PageIntro eyebrow="Your dashboard" title="Welcome back." text="You’re making steady progress. Keep the momentum going." action={<Button variant="secondary" onClick={() => go('sessions')}><Icon name="calendar" /> View calendar</Button>} />
      <div className="metrics-grid">
        <Metric icon="people" label="Active mentorships" value="2" detail="Your current mentors" />
        <Metric icon="calendar" label="Upcoming sessions" value="3" detail="Check your schedule" tone="lime" />
        <Metric icon="check" label="Completed sessions" value="12" detail="Keep learning" tone="blue" />
        <Metric icon="chart" label="Learning progress" value="68%" detail="On track this week" tone="peach" />
      </div>
      <div className="dashboard-columns">
        <section className="panel span-2">
          <div className="panel-head"><div><span className="eyebrow">Next up</span><h2>Upcoming sessions</h2></div><button className="text-link" onClick={() => go('sessions')}>View calendar →</button></div>
          <div className="session-list">
            <SessionRow date="18" month="FEB" title="Binary trees & traversal" mentor="with your mentor" time="Upcoming" status="Join session" />
            <SessionRow date="20" month="FEB" title="Probability distributions" mentor="with your mentor" time="Upcoming" status="View details" />
            <SessionRow date="22" month="FEB" title="DP problem solving" mentor="with your mentor" time="Upcoming" status="View details" />
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><span className="eyebrow">Weekly goal</span><h2>Your progress</h2></div><span className="round-score">68%</span></div>
          <div className="progress-items"><ProgressItem title="Data Structures" value={74} note="11 of 15 topics" /><ProgressItem title="Mathematics" value={58} note="7 of 12 topics" /><ProgressItem title="Web Development" value={42} note="5 of 12 topics" /></div>
          <button className="full-link">View detailed progress <span>→</span></button>
        </section>
        <section className="panel span-2">
          <div className="panel-head"><div><span className="eyebrow">Your circle</span><h2>Peer mentors</h2></div><button className="text-link" onClick={() => go('explore')}>Find another →</button></div>
          <div className="my-mentors">{mentors.slice(0, 2).map((m) => <div className="mini-mentor" key={m.name}><Avatar src={m.image} name={m.name} /><div><strong>{m.name}</strong><span>{m.skills.slice(0, 2).join(' · ')}</span></div><Badge tone="green">Available</Badge><button onClick={() => go('profile')}><Icon name="arrow" /></button></div>)}</div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><span className="eyebrow">Just shared</span><h2>New resources</h2></div></div>
          {resources.slice(0, 3).map((r) => <button className="resource-mini" key={r.title} onClick={() => go('resources')}><span className={`resource-icon ${r.color}`}><Icon name="book" /></span><span><strong>{r.title}</strong><small>{r.type} · {r.subject}</small></span><Icon name="arrow" /></button>)}
        </section>
      </div>
    </AppShell>
  );
}

function SessionRow({ date, month, title, mentor, time, status }: { date: string; month: string; title: string; mentor: string; time: string; status: string }) {
  return <div className="session-row"><div className="date-block"><strong>{date}</strong><span>{month}</span></div><div className="session-info"><strong>{title}</strong><span>{mentor}</span></div><div className="session-time"><Icon name="clock" size={16} /><span>{time}</span></div><Button variant={status.startsWith('Join') ? 'primary' : 'soft'}>{status}</Button></div>;
}

function ProgressItem({ title, value, note }: { title: string; value: number; note: string }) {
  return <div className="progress-item"><div><strong>{title}</strong><span>{note}</span></div><Progress value={value} /></div>;
}

function Explore({ go }: { go: (p: Page) => void }) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All subjects');
  const filtered = mentors.filter((m) =>
    (m.name + ' ' + m.dept + ' ' + m.skills.join(' ')).toLowerCase().includes(search.toLowerCase()) &&
    (subject === 'All subjects' || m.skills.includes(subject))
  );

  return (
    <AppShell page="explore" go={go} role="student">
      <PageIntro eyebrow="Peer mentor directory" title="Find someone who gets it." text="Connect with experienced SVNIT seniors who have already navigated the subjects you’re tackling." />
      <div className="directory-toolbar"><div className="big-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, skill, subject, or department" />{search && <button onClick={() => setSearch('')}><Icon name="close" size={16} /></button>}</div><Button variant="secondary">Filters <span className="filter-count">2</span></Button></div>
      <div className="filter-chips">{['All subjects', 'DSA', 'Python', 'Mathematics', 'Web Dev', 'DBMS'].map((s) => <button className={subject === s ? 'active' : ''} onClick={() => setSubject(s)} key={s}>{s}</button>)}</div>
      <div className="results-head"><strong>{filtered.length} mentors found</strong><label>Sort by <select><option>Best match</option><option>Highest rated</option><option>Availability</option></select></label></div>
      {filtered.length ? <div className="directory-grid">{filtered.map((m) => <DirectoryCard key={m.name} m={m} go={go} />)}</div> : <div className="empty-state"><span><Icon name="search" size={30} /></span><h2>No mentors found</h2><p>Try a different subject or clear your search to see more peer mentors.</p><Button onClick={() => { setSearch(''); setSubject('All subjects'); }}>Clear all filters</Button></div>}
    </AppShell>
  );
}

function DirectoryCard({ m, go }: { m: typeof mentors[0]; go: (p: Page) => void }) {
  return <article className="directory-card"><div className="directory-person"><Avatar src={m.image} name={m.name} size="lg" /><div><Badge tone="green"><span className="dot" /> Available this week</Badge><h3>{m.name}</h3><p>{m.dept} · {m.year}</p></div></div><p className="mentor-bio">{m.bio}</p><div className="skill-list">{m.skills.map((x) => <Badge key={x} tone="neutral">{x}</Badge>)}</div><div className="rating-line"><span><strong>★ {m.rating}</strong> (28 reviews)</span><span><Icon name="calendar" size={16} /> {m.slots} open slots</span></div><div className="card-actions"><Button variant="secondary" onClick={() => go('profile')}>View profile</Button><Button onClick={() => go('profile')}>Request mentorship</Button></div></article>;
}

function MentorProfile({ go }: { go: (p: Page) => void }) {
  const [book, setBook] = useState(false);

  return (
    <AppShell page="explore" go={go} role="student">
      <button className="back-link" onClick={() => go('explore')}>← Back to mentors</button>
      <section className="profile-hero"><Avatar src={mentors[0].image} name={mentors[0].name} size="lg" /><div className="profile-main"><Badge tone="green"><span className="dot" /> Accepting mentees</Badge><h1>{mentors[0].name}</h1><p>{mentors[0].year} · {mentors[0].dept}</p><div className="profile-rating"><strong>★ {mentors[0].rating}</strong><span>28 reviews</span><span>·</span><span>42 sessions completed</span></div></div><div className="profile-actions"><Button variant="secondary">Message</Button><Button onClick={() => setBook(true)}>Request mentorship</Button></div></section>
      <div className="profile-layout">
        <div className="profile-content">
          <section className="panel"><span className="eyebrow">About me</span><h2>Making problem solving feel approachable.</h2><p>{mentors[0].bio} I enjoy helping juniors build intuition before jumping into code.</p><div className="achievement-grid"><div><strong>Peer mentor</strong><span>Campus learning community</span></div><div><strong>Core CS subjects</strong><span>DSA and programming</span></div></div></section>
          <section className="panel"><div className="panel-head"><div><span className="eyebrow">Student feedback</span><h2>What mentees say</h2></div><strong className="big-rating">{mentors[0].rating} ★</strong></div><blockquote className="review">“My mentor explains concepts patiently and helps me understand the reasoning.”<footer>— A Cognitrade student</footer></blockquote></section>
          <section className="panel"><div className="panel-head"><div><span className="eyebrow">Shared resources</span><h2>Mentor’s library</h2></div></div>{resources.slice(0, 3).map((r) => <button className="resource-mini" key={r.title}><span className={`resource-icon ${r.color}`}><Icon name="book" /></span><span><strong>{r.title}</strong><small>{r.meta}</small></span><Icon name="arrow" /></button>)}</section>
        </div>
        <aside className="availability-card"><span className="eyebrow">Weekly availability</span><h2>Choose a time</h2><p>All times shown in IST</p><div className="week-days">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => <button className={i === 1 ? 'active' : ''} key={d}><span>{d}</span><strong>{18 + i}</strong></button>)}</div><div className="slots"><button>4:00 PM</button><button>5:30 PM</button><button>7:00 PM</button></div><Button className="wide" onClick={() => setBook(true)}>Book selected slot</Button><small className="safe-note">You won’t be charged. Cognitrade is free for SVNIT students.</small></aside>
      </div>
      {book && <Modal onClose={() => setBook(false)}><span className="modal-icon"><Icon name="calendar" /></span><h2>Request mentorship</h2><p>Send your mentor a short note about what you’d like help with.</p><label className="field">Learning goal<textarea defaultValue="I’d like help building confidence with trees and dynamic programming." /></label><label className="field">Preferred slot<select><option>Tuesday · 5:30 PM</option><option>Thursday · 4:00 PM</option></select></label><div className="modal-actions"><Button variant="secondary" onClick={() => setBook(false)}>Cancel</Button><Button onClick={() => setBook(false)}>Send request</Button></div></Modal>}
    </AppShell>
  );
}

function MentorDashboard({ go }: { go: (p: Page) => void }) {
  return (
    <AppShell page="mentor" go={go} role="mentor">
      <PageIntro eyebrow="Mentor workspace" title="Welcome back." text="Here’s what needs your attention this week." action={<Button onClick={() => go('sessions')}><Icon name="plus" /> Create session</Button>} />
      <div className="metrics-grid"><Metric icon="people" label="Assigned juniors" value="6" detail="5 currently active" /><Metric icon="chart" label="Avg. mentee progress" value="72%" detail="+8% this month" tone="lime" /><Metric icon="check" label="Sessions completed" value="42" detail="12 this semester" tone="blue" /><Metric icon="calendar" label="Upcoming sessions" value="4" detail="Check your schedule" tone="peach" /></div>
      <div className="dashboard-columns">
        <section className="panel span-2"><div className="panel-head"><div><span className="eyebrow">Today & upcoming</span><h2>Weekly schedule</h2></div><button className="text-link" onClick={() => go('sessions')}>Open calendar →</button></div><div className="schedule-strip">{['MON 17', 'TUE 18', 'WED 19', 'THU 20', 'FRI 21'].map((d, i) => <div className={i === 1 ? 'day-col today' : 'day-col'} key={d}><strong>{d.split(' ')[1]}</strong><span>{d.split(' ')[0]}</span>{i === 1 && <div className="event-chip"><small>5:30 PM</small><b>Binary trees</b><em>Student session</em></div>}{i === 3 && <div className="event-chip light"><small>4:00 PM</small><b>DP patterns</b><em>Student session</em></div>}</div>)}</div></section>
        <section className="panel"><div className="panel-head"><div><span className="eyebrow">Needs attention</span><h2>Pending requests</h2></div><Badge tone="peach">3 new</Badge></div>{['Student 1', 'Student 2', 'Student 3'].map((n, i) => <div className="request-row" key={n}><Avatar src={avatars[(i + 1) % 4]} name={n} size="sm" /><div><strong>{n}</strong><span>{['Wants help with DSA', 'Needs DBMS guidance', 'Learning React'][i]}</span></div><button>Review</button></div>)}</section>
        <section className="panel span-2"><div className="panel-head"><div><span className="eyebrow">Your mentees</span><h2>Progress at a glance</h2></div><button className="text-link" onClick={() => go('mentees')}>Manage all →</button></div><div className="mentee-table"><div className="table-head"><span>Student</span><span>Current focus</span><span>Progress</span><span>Next session</span></div>{['Student 1', 'Student 2', 'Student 3'].map((n, i) => <button className="table-row" onClick={() => go('mentees')} key={n}><span className="person-cell"><Avatar src={avatars[(i + 1) % 4]} name={n} size="sm" /><span><strong>{n}</strong><small>SVNIT student</small></span></span><span>{['Binary Trees', 'Dynamic Programming', 'C++ Foundations'][i]}</span><span><Progress value={[74, 62, 48][i]} /><small>{[74, 62, 48][i]}%</small></span><span>Upcoming <Icon name="arrow" /></span></button>)}</div></section>
        <section className="panel quick-panel"><div className="panel-head"><div><span className="eyebrow">Quick actions</span><h2>Get things done</h2></div></div>{[['calendar', 'Create a session', 'sessions'], ['chart', 'Update progress', 'mentees'], ['upload', 'Upload a resource', 'resources']].map(([i, t, p]) => <button onClick={() => go(p as Page)} key={t}><span><Icon name={i} /></span>{t}<Icon name="arrow" /></button>)}</section>
      </div>
    </AppShell>
  );
}

function Mentees({ go }: { go: (p: Page) => void }) {
  const [selected, setSelected] = useState('Student 1');
  const students = ['Student 1', 'Student 2', 'Student 3'];

  return (
    <AppShell page="mentees" go={go} role="mentor">
      <PageIntro eyebrow="Mentorship management" title="Your mentees" text="Track goals, document sessions, and help every junior move forward." action={<Button><Icon name="plus" /> Add session note</Button>} />
      <div className="management-layout">
        <aside className="mentee-list panel"><div className="small-search"><Icon name="search" /><input placeholder="Search mentees" /></div>{students.map((n, i) => <button className={selected === n ? 'active' : ''} onClick={() => setSelected(n)} key={n}><Avatar src={avatars[(i + 1) % 4]} name={n} /><span><strong>{n}</strong><small>{['DSA · 74%', 'Algorithms · 62%', 'C++ · 48%'][i]}</small></span><Icon name="arrow" /></button>)}</aside>
        <div className="mentee-detail">
          <section className="panel mentee-summary"><div className="summary-person"><Avatar src={avatars[1]} name={selected} size="lg" /><div><Badge tone="green">Active mentorship</Badge><h2>{selected}</h2><p>SVNIT student</p></div></div><Button variant="secondary">Message student</Button><div className="summary-stats"><div><strong>8</strong><span>Sessions</span></div><div><strong>92%</strong><span>Attendance</span></div><div><strong>74%</strong><span>Progress</span></div><div><strong>3</strong><span>Assignments</span></div></div></section>
          <section className="panel"><div className="panel-head"><div><span className="eyebrow">Current learning plan</span><h2>Goals & progress</h2></div><Button variant="soft">Update progress</Button></div><ProgressItem title="Binary trees & BST" value={82} note="Strong understanding" /><ProgressItem title="Graph algorithms" value={58} note="Needs more practice" /><ProgressItem title="Dynamic programming" value={35} note="Just started" /><div className="improvement-note"><span><Icon name="chart" /></span><div><strong>Area to focus</strong><p>Help your mentee practise translating recursive ideas into code.</p></div></div></section>
          <section className="panel"><div className="panel-head"><div><span className="eyebrow">Mentorship history</span><h2>Recent timeline</h2></div><select><option>This month</option></select></div><div className="timeline">{[['18 Feb', 'Session scheduled', 'Binary trees & traversal'], ['15 Feb', 'Assignment submitted', 'Tree traversal practice set'], ['11 Feb', 'Session completed', 'Recursion patterns'], ['04 Feb', 'Goal updated', 'Foundational trees module']].map((x, i) => <div className="timeline-row" key={x[0]}><span className={i === 0 ? 'timeline-dot active' : 'timeline-dot'} /><time>{x[0]}</time><div><strong>{x[1]}</strong><p>{x[2]}</p></div>{i === 0 && <Badge tone="green">Upcoming</Badge>}</div>)}</div></section>
        </div>
      </div>
    </AppShell>
  );
}

function Sessions({ go }: { go: (p: Page) => void }) {
  const [view, setView] = useState<'Week' | 'Month'>('Week');
  const [modal, setModal] = useState(false);
  const days = ['Mon 17', 'Tue 18', 'Wed 19', 'Thu 20', 'Fri 21', 'Sat 22', 'Sun 23'];
  const hours = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM'];

  return (
    <AppShell page="sessions" go={go} role="mentor">
      <PageIntro eyebrow="Sessions & calendar" title="Plan the week." text="Keep mentorship consistent with focused, well-prepared sessions." action={<Button onClick={() => setModal(true)}><Icon name="plus" /> Schedule session</Button>} />
      <section className="panel calendar-panel">
        <div className="calendar-toolbar"><div><button>←</button><h2>February 17–23, 2025</h2><button>→</button></div><div className="view-toggle">{(['Week', 'Month'] as const).map((v) => <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>{v}</button>)}</div></div>
        {view === 'Week' ? (
          <div className="calendar-grid">
            <div className="time-column"><span />{hours.map((h) => <span key={h}>{h}</span>)}</div>
            {days.map((d, di) => <div className={di === 1 ? 'calendar-day today' : 'calendar-day'} key={d}><strong>{d}</strong>{hours.map((h, hi) => <div className="calendar-cell" key={h}>{((di === 1 && hi === 4) || (di === 3 && hi === 3) || (di === 5 && hi === 1)) && <button className={`cal-event e${di}`} onClick={() => setModal(true)}><b>{di === 1 ? 'Binary trees' : di === 3 ? 'DP patterns' : 'Graph practice'}</b><span>Student session · 60 min</span></button>}</div>)}</div>)}
          </div>
        ) : (
          <div className="month-grid">{Array.from({ length: 35 }, (_, i) => <div className={i === 17 ? 'current' : ''} key={i}><span>{i < 2 ? 27 + i : i - 1}</span>{[5, 10, 17, 19, 22].includes(i) && <i />}</div>)}</div>
        )}
      </section>
      <div className="status-legend"><span><i className="scheduled" /> Scheduled</span><span><i className="completed" /> Completed</span><span><i className="cancelled" /> Cancelled</span></div>
      {modal && <Modal onClose={() => setModal(false)}><span className="modal-icon"><Icon name="calendar" /></span><h2>Schedule a session</h2><p>Create a focused learning session for your mentee.</p><label className="field">Session topic<input defaultValue="Binary trees & traversal" /></label><label className="field">Mentee<select><option>Student 1</option><option>Student 2</option><option>Student 3</option></select></label><div className="field-row"><label className="field">Date<input type="date" defaultValue="2025-02-20" /></label><label className="field">Time<input type="time" defaultValue="17:30" /></label></div><label className="field">Learning objective<textarea placeholder="What should the student understand by the end?" /></label><div className="modal-actions"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => setModal(false)}>Schedule session</Button></div></Modal>}
    </AppShell>
  );
}

function Resources({ go }: { go: (p: Page) => void }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => resources.filter((r) => (r.title + r.subject + r.type).toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <AppShell page="resources" go={go} role="student">
      <PageIntro eyebrow="Community library" title="Resources that actually help." text="Notes, roadmaps, and practice material shared by SVNIT students who took the same courses." action={<Button><Icon name="upload" /> Upload resource</Button>} />
      <div className="directory-toolbar"><div className="big-search"><Icon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes, problems, roadmaps..." /></div><Button variant="secondary">Subject: All</Button><Button variant="secondary">Type: All</Button></div>
      <div className="category-row">{['All resources', 'DSA', 'DBMS', 'OOP', 'Mathematics', 'Operating Systems', 'Web Dev'].map((c, i) => <button className={i === 0 ? 'active' : ''} key={c}>{c}</button>)}</div>
      <div className="resource-grid">{filtered.map((r, i) => <article className="resource-card" key={r.title}><div className={`resource-cover ${r.color}`}><span>{r.type}</span><Icon name={r.type === 'Roadmap' ? 'chart' : 'book'} size={38} /><small>COGNITRADE · SVNIT</small></div><div className="resource-body"><div><Badge tone="neutral">{r.subject}</Badge><button aria-label="Bookmark"><Icon name="bookmark" /></button></div><h3>{r.title}</h3><p>{r.meta}</p><div className="resource-owner"><Avatar src={avatars[i % 3]} name={mentors[i % 3].name} size="sm" /><span>Shared by <strong>{mentors[i % 3].name}</strong></span></div><Button variant="soft" className="wide">Open resource <span>↗</span></Button></div></article>)}</div>
    </AppShell>
  );
}

function Settings({ go }: { go: (p: Page) => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <AppShell page="settings" go={go} role="student">
      <PageIntro eyebrow="Profile & settings" title="Make Cognitrade yours." text="Keep your academic profile, interests, and preferences up to date." />
      {saved && <div className="success-banner"><Icon name="check" /> Your profile has been updated successfully.</div>}
      <div className="settings-layout">
        <aside className="settings-nav panel">{['Personal profile', 'Academic details', 'Skills & interests', 'Notifications', 'Account security'].map((x, i) => <button className={i === 0 ? 'active' : ''} key={x}>{x}<Icon name="arrow" /></button>)}</aside>
        <section className="panel settings-form">
          <div className="settings-photo"><Avatar src={avatars[0]} name="Student" size="lg" /><div><strong>Initials icon</strong><p>Your profile is represented without a photo.</p></div></div>
          <div className="form-grid">
            <label className="field">Full name<input defaultValue="Student" /></label>
            <label className="field">College email<input defaultValue="" disabled /></label>
            <label className="field">Roll number<input defaultValue="" /></label>
            <label className="field">Department<select defaultValue="Computer Engineering"><option>Computer Engineering</option><option>Electronics Engineering</option><option>Electrical Engineering</option><option>Mechanical Engineering</option><option>Civil Engineering</option></select></label>
            <label className="field">Year of study<select defaultValue="2nd year"><option>1st year</option><option>2nd year</option><option>3rd year</option><option>Final year</option></select></label>
            <label className="field full">Bio<textarea defaultValue="" /></label>
            <label className="field full">Learning goals<input defaultValue="" /></label>
          </div>
          <div className="form-actions"><Button variant="secondary" onClick={() => setSaved(false)}>Cancel</Button><Button onClick={() => { setSaved(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Save changes</Button></div>
        </section>
      </div>
    </AppShell>
  );
}

/* ---------------- AUTHENTICATION ---------------- */

function Auth({ page, go }: { page: 'login' | 'signup' | 'forgot'; go: (p: Page) => void }) {
  const [role, setRole] = useState<Role>('Student');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess('');

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    if (page === 'forgot') {
      setError('Password reset is not configured on the backend yet.');
      return;
    }

    if (!email.endsWith('@svnit.ac.in')) {
      setError('Please use your official SVNIT email address ending in @svnit.ac.in.');
      return;
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const isSignup = page === 'signup';
      const endpoint = `${API_URL}/${isSignup ? 'register' : 'login'}`;

      let body: Record<string, string>;

      if (isSignup) {
        const fullName = String(form.get('fullName') || '').trim();
        const nameParts = fullName.split(/\s+/).filter(Boolean);

        if (nameParts.length === 0) {
          throw new Error('Please enter your full name.');
        }

        body = {
          first_name: nameParts[0],
          last_name: nameParts.slice(1).join(' '),
          email,
          password,
          bio: `Cognitrade ${role.toLowerCase()}`,
        };
      } else {
        body = { email, password };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

     
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `Request failed (${response.status}).`,
        );
      }

      if (isSignup) {
        setSuccess('Account created successfully! Redirecting to login...');
        window.setTimeout(() => go('login'), 1200);
        return;
      }

      if (!data.user) {
        throw new Error(
          'The server did not return user details. Please check your login API.',
        );
      }

      const user = data.user;
      const role = user.role;

      localStorage.setItem('cognitradeUser', JSON.stringify(user));
      localStorage.setItem('cognitradeRole', role.toLowerCase());

      go(role.toLowerCase() === 'mentor' ? 'mentor' : 'student');

    } catch (err) {
      if (err instanceof TypeError) {
        setError('Cannot connect to the backend. Start your backend server on port 5000 and check CORS configuration.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const title =
    page === 'login'
      ? 'Welcome back.'
      : page === 'signup'
        ? 'Join your campus community.'
        : 'Reset your password.';

  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <Brand go={go} />
        <div>
          <Badge tone="lime">SVNIT students only</Badge>
          <h1>Learn from people who know your campus.</h1>
          <p>Build skills, find your people, and make every semester count.</p>
        </div>
        <div className="auth-quote">“The best explanations often come from someone who learned it last semester.”</div>
      </div>

      <main className="auth-main">
        <button className="auth-back" type="button" onClick={() => go('home')}>← Back to home</button>

        <div className="auth-card">
          <span className="eyebrow">
            {page === 'signup' ? 'Create an account' : page === 'login' ? 'Sign in to Cognitrade' : 'Account recovery'}
          </span>
          <h2>{title}</h2>
          <p>{page === 'forgot' ? 'Enter your SVNIT email to begin account recovery.' : 'Use your SVNIT credentials to continue.'}</p>

          {error && <div className="error-banner" role="alert">{error}</div>}
          {success && <div className="success-banner" role="status"><Icon name="check" /> {success}</div>}

          <form onSubmit={submit}>
            {page === 'signup' && (
              <>
                <div className="role-picker">
                  <button type="button" className={role === 'Student' ? 'active' : ''} onClick={() => setRole('Student')}>
                    <Icon name="book" /><span><strong>Student</strong><small>I want to learn</small></span>
                  </button>
                  <button type="button" className={role === 'Mentor' ? 'active' : ''} onClick={() => setRole('Mentor')}>
                    <Icon name="people" /><span><strong>Mentor</strong><small>I want to teach</small></span>
                  </button>
                </div>

                <label className="field">Full name<input name="fullName" required autoComplete="name" placeholder="Your full name" /></label>

                <div className="field-row">
                  <label className="field">Roll number<input name="rollNumber" required placeholder="Your roll number" /></label>
                  <label className="field">Year<select name="year" defaultValue="1st year"><option>1st year</option><option>2nd year</option><option>3rd year</option><option>Final year</option></select></label>
                </div>

                <label className="field">Department
                  <select name="department" defaultValue="Computer Engineering">
                    <option>Computer Engineering</option>
                    <option>Electronics Engineering</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                  </select>
                </label>
              </>
            )}

            <label className="field">College email
              <input name="email" required type="email" autoComplete="email" placeholder="your-email@svnit.ac.in" />
            </label>

            {page !== 'forgot' && (
              <label className="field">Password
                <div className="password-field">
                  <input name="password" required minLength={8} autoComplete={page === 'login' ? 'current-password' : 'new-password'} type={show ? 'text' : 'password'} placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
                </div>
              </label>
            )}

            {page === 'login' && (
              <>
                <div className="role-picker">
                  <button type="button" className={role === 'Student' ? 'active' : ''} onClick={() => setRole('Student')}><Icon name="book" /><span><strong>Student</strong></span></button>
                  <button type="button" className={role === 'Mentor' ? 'active' : ''} onClick={() => setRole('Mentor')}><Icon name="people" /><span><strong>Mentor</strong></span></button>
                </div>
                <div className="form-options">
                  <label><input type="checkbox" /> Remember me</label>
                  <button type="button" onClick={() => go('forgot')}>Forgot password?</button>
                </div>
              </>
            )}

            <Button type="submit" className="wide" disabled={loading}>
              {loading ? 'Please wait...' : page === 'login' ? 'Log in' : page === 'signup' ? 'Create account' : 'Send reset link'}
              {!loading && <span> →</span>}
            </Button>
          </form>

          {page !== 'forgot' && (
            <p className="auth-switch">
              {page === 'login' ? 'New to Cognitrade? ' : 'Already have an account? '}
              <button type="button" onClick={() => go(page === 'login' ? 'signup' : 'login')}>
                {page === 'login' ? 'Create an account' : 'Log in'}
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'home') return <Landing go={go} />;
  if (page === 'login' || page === 'signup' || page === 'forgot') return <Auth page={page} go={go} />;
  if (page === 'student') return <StudentDashboard go={go} />;
  if (page === 'mentor') return <MentorDashboard go={go} />;
  if (page === 'explore') return <Explore go={go} />;
  if (page === 'profile') return <MentorProfile go={go} />;
  if (page === 'mentees') return <Mentees go={go} />;
  if (page === 'sessions') return <Sessions go={go} />;
  if (page === 'resources') return <Resources go={go} />;

  return <Settings go={go} />;
}
