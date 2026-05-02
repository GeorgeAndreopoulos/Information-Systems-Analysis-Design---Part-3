# Διατριβή Φροντιστήριο — Information Systems Analysis & Design

A web-based management system for the tutoring center **"Διατριβή"**, built as part of the Information Systems Analysis & Design course at AUEB. The system handles user management, teacher availability, student evaluation, institutional constraints, and automated schedule generation — all through a role-based interface.

---

## Features

### Role-based Access Control
Three roles with different permissions:

| Role | Access |
|------|--------|
| **Admin** | Full access — user creation, constraints, schedule generation |
| **Teacher** | Register availability, evaluate students |
| **Student** | Register personal availability constraints |

### Modules

- **Authentication** — Login with role-based session management
- **User Management** — Create student and teacher profiles (Admin only)
- **Constraint Registration** — Set institutional hours and rooms (Admin), weekly availability (Teacher), unavailable slots (Student)
- **Student Evaluation** — Teachers record academic and behavioral profiles per student
- **Schedule Generation** — Automated constraint-based schedule optimization with an interactive weekly view

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript (ES6+)** — no frontend frameworks
- **Bootstrap 5.3** — layout, grid, components
- **Bootstrap Icons** — icon library
- **Web Components** — custom elements for navbar, guardian blocks, action buttons, etc.
- **Fetch API** — async loading from local JSON data files
- **sessionStorage / localStorage** — session auth and theme persistence

---

## Project Structure

```
.
├── index.html                          # Main dashboard
├── README.md                           # Project documentation
│
├── pages/                              # Page modules (each has HTML + JS)
│   ├── Login/
│   │   ├── login.html                  # Login form & authentication UI
│   │   └── login.js                    # Login logic & session handling
│   │
│   ├── CreateUserProfile/
│   │   ├── createUser.html             # User creation form (Admin)
│   │   └── createUser.js               # User profile creation logic
│   │
│   ├── RegisterAvailabilityAndConstraints/
│   │   ├── constraintsDashboard.html   # Constraints management UI
│   │   └── constraintsDashboard.js     # Availability & constraints logic
│   │
│   ├── RecordAcademicProfile/
│   │   ├── academicProfile.html        # Student evaluation form (Teacher)
│   │   └── academicProfile.js          # Academic profile recording logic
│   │
│   └── GenerateSchedule/
│       ├── schedulingDashboard.html    # Schedule generation UI (Admin)
│       └── schedulingDashboard.js      # Schedule display & interaction logic
│
├── components/                         # Reusable Web Components
│   ├── navbar.js                       # Navigation bar component
│   ├── guardianBlock.js                # Guardian/header block component
│   ├── actionButtons.js                # Reusable action buttons
│   ├── commentsBox.js                  # Comments/notes box component
│   └── requiredNote.js                 # Required field indicator component
│
├── utils/                              # Utility & Helper Modules
│   ├── auth.js                         # Login / logout / session management
│   ├── darkMode.js                     # Dark mode toggle & theme handling
│   ├── theme-init.js                   # Prevents theme flash on page load
│   ├── dataLoader.js                   # JSON data fetching utilities
│   ├── scheduleUtils.js                # Schedule generation algorithm
│   ├── scheduleRenderer.js             # Schedule table rendering
│   ├── timeUtils.js                    # Time slot & scheduling utilities
│   ├── validationUtils.js              # Form validation helpers
│   ├── roomUtils.js                    # Room CRUD operations
│   ├── tableUtils.js                   # Table rendering helpers
│   └── index.js                        # Dashboard feature cards logic
│
├── constants/                          # Application Constants
│   ├── constants.js                    # Days, groups, time ranges
│   └── specialties.js                  # Teacher specialties & subjects
│
├── css/                                # Stylesheets
│   ├── styles.css                      # Main stylesheet (imports all partials)
│   ├── base.css                        # Design tokens & global styles
│   ├── components.css                  # Component-specific styles
│   ├── navbar.css                      # Navbar styles
│   ├── login.css                       # Login page styles
│   ├── academic-profile.css            # Academic profile page styles
│   ├── scheduling.css                  # Schedule page styles
│   ├── constraints.css                 # Constraints page styles
│   └── darkmode.css                    # Dark mode theme styles
│
├── data/                               # Static Data Files (JSON)
│   ├── teachers.json                   # Teacher profiles & specialties
│   ├── students.json                   # Student profiles & grades
│   ├── rooms.json                      # Room information & capacity
│   └── subjects.json                   # Subject listings per grade
│
├── images/                             # Image Assets
    ├── favicon.png
    └── diatrivi-logo.png

```

---

## Running the Project

This is a static frontend-only application — no build step or backend required.

**Option 1: Python HTTP server (recommended)**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 2: Node.js**
```bash
npx http-server
# or
npx live-server
```

**Option 3: Visit site**
URL: https://georgeandreopoulos.github.io/

---

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123!` |
| Teacher | `teacher` | `teacher123!` |
| Student | `student` | `student123!` |

---

## Schedule Generation

The schedule algorithm (`utils/scheduleUtils.js`) generates a weekly timetable respecting:

- **Hard constraints** — no teacher or group double-booked, rooms not over capacity
- **Soft constraints** — teacher availability preferences, min/max teaching hours

**Operating hours:**
- Monday–Friday: 14:30 – 22:30 (30-minute slots)
- Saturday: 09:30 – 15:30

The generated schedule is displayed as an interactive matrix (time × room) per day, with color-coded student groups and popovers showing teacher, subject, and enrolled students.

---

## Data

All data is stored as static JSON files under `/data/`:

- `teachers.json` — name, specialty, assigned groups
- `students.json` — name, grade, stream/direction
- `rooms.json` — name, floor, capacity
- `subjects.json` — subject lists per grade level

Teacher specialties: Φιλόλογος, Μαθηματικός, Χημικός, Φυσικός, Πληροφορικός, Οικονομολόγος, Βιολόγος

---

## Theming

The UI supports light and dark modes. The active theme is saved to `localStorage` under the key `diatrivi_theme` and applied immediately on page load (via `theme-init.js`) to prevent flash.

Primary brand colors are defined as CSS variables in `css/base.css`:
- `--brand-green: #7da41b`
- `--brand-grey: #58595b`
