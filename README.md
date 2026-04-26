# ScriptAssist – Patient Registration Test Suite

Automated end-to-end test suite for the ScriptAssist Patient Portal, built with **Playwright** and **TypeScript**. Covers the full Patient Registration and Login workflows with positive, negative, and data-driven test cases.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| TypeScript | Strongly-typed test authoring |
| [@faker-js/faker](https://fakerjs.dev/) | Dynamic, randomised test data |
| dotenv | Environment variable management |

---

## Project Structure

```
scriptassistAssignment/
├── Src/
│   ├── Pages/
│   │   ├── loginPage.ts        # Login page object
│   │   └── signupPage.ts       # Registration page object
│   ├── test-data/
│   │   └── signupData.ts       # Faker-based data factories
│   └── tests/
│       ├── login.spec.ts       # Login test cases
│       └── register.spec.ts    # Registration test cases
├── .env.example                # Environment variable template
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Setup

**1. Clone the repository**
```bash
git clone https://github.com/syedjawad123/scriptassistAssignment.git
cd scriptassistAssignment
```

**2. Install dependencies**
```bash
npm install
```

**3. Install Playwright browsers**
```bash
npx playwright install
```

**4. Configure environment variables**

Copy the example env file and fill in your credentials:
```bash
cp .env.example .env
```

```env
BASE_URL=https://scriptassist-uat-patient.scriptassist.co.uk/login
USEREMAIL=your-email@example.com
PASSWORD=your-password
```

> ⚠️ Never commit the `.env` file. It is listed in `.gitignore`.

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests on Chromium (default) |
| `npm run test:cross-browser` | Run on Chromium, Firefox, and WebKit |
| `npx playwright test --headed` | Run in headed (visible browser) mode |
| `npx playwright test login.spec.ts` | Run login tests only |
| `npx playwright test register.spec.ts` | Run registration tests only |
| `npx playwright test --ui` | Open Playwright UI mode |

---

## Viewing the HTML Report

After any test run, open the report with:
```bash
npx playwright show-report
```

The report includes test results, screenshots on failure, and video recordings for every test.

---

## Test Coverage

### Login (`login.spec.ts`) — 10 tests

| Test | Type |
|---|---|
| Valid credentials login | ✅ Positive |
| Wrong password | ❌ Negative |
| Unregistered email | ❌ Negative |
| Invalid email format | ❌ Negative |
| Empty email field | ❌ Negative |
| Empty password field | ❌ Negative |
| Both fields empty | ❌ Negative |
| Data-driven: 3 invalid credential combinations | ❌ Negative |

### Registration (`register.spec.ts`) — 19 tests

| Test | Type |
|---|---|
| Full happy path — register then login | ✅ Positive |
| Register with Male gender | ✅ Positive |
| Register with Female gender | ✅ Positive |
| Step 1 empty — all required field errors | ❌ Negative |
| Invalid email format in step 1 | ❌ Negative |
| No organization selected | ❌ Negative |
| Duplicate/already registered email | ❌ Negative |
| Step 2 empty — all required field errors | ❌ Negative |
| Password mismatch | ❌ Negative |
| Weak password: too short | ❌ Negative |
| Weak password: no uppercase | ❌ Negative |
| Weak password: no special character | ❌ Negative |
| Weak password: no number | ❌ Negative |
| Terms & conditions not accepted | ❌ Negative |
| Data-driven: 5 weak password variants | ❌ Negative |

---

## Key Features

- **Page Object Model (POM)** — all locators and actions encapsulated in page classes
- **Faker-powered test data** — randomised names, emails, phone numbers, and dates of birth on every run
- **Data-driven tests** — `test.each`-style loops for password validation and invalid login scenarios
- **Soft assertions** — validation error tests collect all failures before reporting
- **Retry on failure** — tests auto-retry twice on CI (`retries: 2`)
- **Video recording** — every test run captures video for debugging
- **Trace on retry** — Playwright trace viewer enabled on first retry
- **Cross-browser** — Chromium, Firefox, and WebKit configured

---

## Assumptions

- The UAT environment (`scriptassist-uat-patient.scriptassist.co.uk`) is available and stable during test runs.
- A pre-existing account is required for login tests — credentials are supplied via `.env`.
- The registration flow creates real accounts on the UAT database; each test run will generate new users.
- Organization dropdown options (`Ilan Lieberman`) are assumed to be present in the UAT environment. If the data changes, update `DEFAULT_ORGANIZATION` in `signupData.ts`.
- Phone numbers are generated in UK mobile format (`07XXXXXXXXX`). If the app enforces a different format, update the `phoneNumber` factory in `signupData.ts`.
- The duplicate email test uses the `USEREMAIL` from `.env` as a known-existing account.
