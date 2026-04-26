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
├── .env.example                # Environment variable template (safe to commit)
├── .gitignore                  # Excludes .env and build artifacts
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
USEREMAIL=your-email@example.com
PASSWORD=your-password
```

> ⚠️ Never commit the `.env` file. It is listed in `.gitignore`.

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests across all browsers |
| `npm run test:chromium` | Run on Chromium only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:webkit` | Run on WebKit (Safari) only |
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

### Login (`login.spec.ts`) — 1 test

| Test | Type |
|---|---|
| Valid credentials login | ✅ Positive |

### Registration (`register.spec.ts`) — 6 tests

| Test | Type |
|---|---|
| Full happy path — register then login | ✅ Positive |
| Step 1 empty — all required field errors | ❌ Negative |
| Step 2 empty — all required field errors + password mismatch | ❌ Negative |
| No organization selected | ❌ Negative |
| Invalid mobile number — less than 11 digits | ❌ Negative |

---

## Configuration Notes

- **`headless: false`** — tests run in a visible browser window by default. To run headlessly, set `headless: true` in `playwright.config.ts` or pass `--headed=false` on the CLI.
- **`baseURL`** is set directly in `playwright.config.ts` to `https://scriptassist-uat-patient.scriptassist.co.uk/login`.
- **`retries: 2`** — failed tests automatically retry twice.
- **`workers: 1`** — tests run sequentially to avoid conflicts on the shared UAT environment.
- **Video recording** is enabled for all tests (`video: 'on'`).
- **Trace** is captured on first retry for debugging (`trace: 'on-first-retry'`).

---

## Key Features

- **Page Object Model (POM)** — all locators and actions encapsulated in page classes
- **Faker-powered test data** — randomised names, emails, phone numbers, and dates of birth on every run
- **Dynamic DOB generation** — uses `faker.date.birthdate` with age range (18–65) and zero-padded day
- **Soft assertions** — validation error tests collect all failures before reporting
- **Retry on failure** — tests auto-retry twice
- **Video recording** — every test run captures video for debugging
- **Trace on retry** — Playwright trace viewer enabled on first retry
- **Cross-browser** — Chromium, Firefox, and WebKit supported via individual npm scripts

---

## Assumptions

- The UAT environment (`scriptassist-uat-patient.scriptassist.co.uk`) is available and stable during test runs.
- A pre-existing account is required for login tests — credentials are supplied via `.env`.
- The registration flow creates real accounts on the UAT database; each test run generates new users with randomised Faker data.
- The organization `Ilan Lieberman` is assumed to exist in the UAT environment. If the data changes, update `DEFAULT_ORGANIZATION` in `signupData.ts`.
- Phone numbers are validated as 11 digits by the application. The invalid phone test uses a 9-digit number (`712345678`) to trigger the validation error.
- The `baseURL` is hardcoded in `playwright.config.ts`. If the environment URL changes, update it there.
