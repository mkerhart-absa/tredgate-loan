# Test Documentation

## Overview

This document describes the test suite for the Tredgate Loan application. The tests ensure all features work correctly and maintain high code quality.

## Technology Stack

### Unit Testing
- **Vitest** - Fast unit testing framework
- **@vue/test-utils** - Official testing utilities for Vue components
- **jsdom** - Browser environment simulation
- **@vitest/ui** - Interactive UI for test results
- **@vitest/coverage-v8** - Code coverage reporting

### E2E Testing
- **Playwright** - Modern end-to-end testing framework
- **Page Object Model** - Structured test organization pattern
- Supports Chromium, Firefox, and WebKit browsers

## Test Coverage

### Service Layer Tests (`tests/loanService.test.ts`)

Tests for business logic in `src/services/loanService.ts`:

- **getLoans()** - Retrieve loans from localStorage
  - Returns empty array when no data stored
  - Returns stored loans correctly

- **saveLoans()** - Save loans to localStorage
  - Persists loan data correctly

- **createLoanApplication()** - Create new loan applications
  - Creates loan with valid data
  - Validates applicant name (required, non-empty)
  - Validates amount (must be > 0)
  - Validates term months (must be > 0)
  - Validates interest rate (cannot be negative)
  - Trims whitespace from applicant name

- **updateLoanStatus()** - Update loan status
  - Updates status correctly
  - Throws error for non-existent loans

- **calculateMonthlyPayment()** - Calculate monthly payments
  - Calculates correctly for various scenarios
  - Handles 0% interest rate
  - Works with large loan amounts

- **autoDecideLoan()** - Automated loan decision
  - Approves loans ≤ $100,000 and ≤ 60 months
  - Rejects loans exceeding limits
  - Handles edge cases correctly

### Component Tests

#### LoanForm Component (`tests/LoanForm.test.ts`)

Tests for the loan application form:

- Renders all form fields correctly
- Validates empty applicant name
- Validates amount > 0
- Validates term months > 0
- Validates interest rate ≥ 0
- Creates loan application with valid data
- Emits 'created' event after successful submission
- Resets form fields after submission
- Displays error messages from service exceptions
- Trims whitespace from inputs

#### LoanList Component (`tests/LoanList.test.ts`)

Tests for the loan list table:

- Renders component header
- Displays empty state with no loans
- Shows table with loan data
- Formats currency correctly ($50,000.00)
- Formats percentages correctly (8.0%)
- Calculates and displays monthly payments
- Shows correct status badges (pending/approved/rejected)
- Shows action buttons for pending loans only
- Emits approve/reject/autoDecide events
- Formats dates correctly
- Displays all table headers

#### LoanSummary Component (`tests/LoanSummary.test.ts`)

Tests for statistics summary:

- Renders all summary cards
- Displays total application count
- Displays pending count
- Displays approved count
- Displays rejected count
- Calculates total approved amount
- Shows zero values for empty list
- Applies correct CSS classes
- Formats currency without decimals ($175,000)
- Updates statistics reactively
- Excludes non-approved loans from total amount

## Running Tests

### Run All Tests

```bash
npm test
```

This runs all tests in run mode (non-watch) with HTML report generation.

### Watch Mode

```bash
npm run test:watch
```

Tests automatically re-run when files change.

### Coverage Report

```bash
npm run test:coverage
```

Generates detailed code coverage reports in:
- `coverage/` - HTML coverage report
- Console - Text summary

### Interactive UI

```bash
npx vitest --ui
```

Opens an interactive browser UI to explore test results.

## HTML Test Report

After running tests, an HTML report is generated in the `html/` directory.

**View the report:**
```bash
npx vite preview --outDir html
```

Then open your browser to the displayed URL (typically http://localhost:4173).

The HTML report includes:
- Test execution summary
- Pass/fail status for each test
- Execution times
- Detailed test results
- Visual indicators for test status

## Test Structure

All tests follow this structure:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('ComponentOrService', () => {
  beforeEach(() => {
    // Setup before each test
  })

  describe('featureName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = ...
      
      // Act
      const result = functionUnderTest(input)
      
      // Assert
      expect(result).toBe(expected)
    })
  })
})
```

## Mocking

### localStorage Mock

Tests mock localStorage to isolate tests from browser storage:

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn()
}
```

### Service Mocks

Component tests mock service functions when needed:

```typescript
vi.spyOn(loanService, 'createLoanApplication')
```

## Best Practices

1. **Isolation** - Each test is independent and can run in any order
2. **Mocking** - External dependencies are mocked (localStorage, services)
3. **Clear naming** - Test descriptions clearly state what they verify
4. **Arrange-Act-Assert** - Tests follow AAA pattern
5. **Coverage** - All functions and methods are tested
6. **Edge cases** - Tests cover edge cases and error conditions

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Pull requests to main branch
- Pushes to main branch

The CI workflow:
1. Installs dependencies
2. Runs linter
3. Runs all tests
4. Generates HTML report
5. Uploads report as artifact
6. Creates workflow summary

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure dependencies are up to date: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Coverage not generated
- Ensure `@vitest/coverage-v8` is installed: `npm install --save-dev @vitest/coverage-v8`
- Check `vitest.config.ts` has coverage configuration

### HTML report not generated
- Check `html/` directory exists after test run
- Verify reporters are configured in `vitest.config.ts`

## Test Maintenance

When adding new features:

1. **Write tests first** (TDD approach) or immediately after
2. **Test public APIs** - Focus on component props, events, and service functions
3. **Mock dependencies** - Don't test external code
4. **Update this documentation** - Keep test docs current
5. **Maintain high coverage** - Aim for >80% coverage

## Test Statistics

Current test suite:
- **Total unit test files**: 4
- **Total unit tests**: 56
- **Service tests**: 19
- **Component tests**: 37
  - LoanForm: 10
  - LoanList: 15
  - LoanSummary: 12

All tests should pass with 0 failures.

## End-to-End (E2E) Testing with Playwright

### Overview

Playwright tests provide comprehensive end-to-end testing of the entire application workflow, simulating real user interactions in a browser environment.

### Test Structure

Playwright tests follow the Page Object Model (POM) pattern:

```
e2e-tests/
├── pages/               # Page Object classes
│   ├── BasePage.ts         # Base class with common methods
│   ├── AppPage.ts          # Main application page
│   ├── LoanFormPage.ts     # Loan form component
│   ├── LoanListPage.ts     # Loan list component
│   └── LoanSummaryPage.ts  # Loan summary component
├── helpers/             # Test utilities and helpers
│   └── testHelpers.ts      # Common functions and test data
├── texts/               # Centralized text constants
│   └── texts.ts            # Text values, selectors, and messages
├── form-validation.spec.ts # Form validation tests
├── loan-creation.spec.ts   # Loan creation tests
└── loan-decisions.spec.ts  # Loan decision workflow tests
```

### Test Coverage

#### Form Validation Tests (`form-validation.spec.ts`)
- Empty applicant name validation
- Whitespace-only name validation
- Zero interest rate acceptance
- Very small amounts (boundary test)
- Very large amounts (boundary test)
- Whitespace trimming
- Required field validation

#### Loan Creation Tests (`loan-creation.spec.ts`)
- Application loads correctly
- Create new loan application successfully
- Create multiple loan applications
- Monthly payment calculation for zero interest
- Boundary value handling ($100k, 60 months)

#### Loan Decision Tests (`loan-decisions.spec.ts`)
- Manual loan approval
- Manual loan rejection
- Auto-approve loans meeting criteria (≤$100k and ≤60 months)
- Auto-reject loans exceeding amount limit (>$100k)
- Auto-reject loans exceeding term limit (>60 months)
- Auto-approve at exact boundary
- Handle multiple loan decisions
- Calculate total approved amount correctly

### Running Playwright Tests

#### Run All E2E Tests
```bash
npm run test:e2e
```

#### Run Tests with UI Mode
```bash
npm run test:e2e:ui
```

This opens an interactive UI to watch tests run and explore results.

#### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```

Shows the browser window while tests run.

#### Debug Tests
```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Playwright Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test execution summary
- Pass/fail status for each test
- Screenshots on failures
- Videos of failed tests
- Trace files for debugging
- Execution times

### Page Object Model Best Practices

The tests follow QA engineer best practices:

1. **Clear Structure**: Tests use test.step() for readable test scenarios
2. **Reusable Components**: Page Objects encapsulate UI interactions
3. **Atomic Methods**: Small, focused methods for individual actions
4. **Grouped Actions**: Higher-level methods combining multiple steps
5. **Custom Assertions**: Expect methods in Page Objects with meaningful messages
6. **Text Library**: Centralized text constants for maintainability
7. **No Logic in Tests**: Business logic in Page Objects, not tests
8. **Unique Locators**: Uses IDs and data-testid attributes where possible

### CI/CD Integration

Playwright tests run in GitHub Actions via manual trigger:

**Workflow**: `.github/workflows/playwright.yml`
- Trigger: Manual (`workflow_dispatch`)
- Runs on: Ubuntu latest
- Browser: Chromium (configurable)
- Artifacts: Test reports and videos uploaded automatically

To manually trigger the workflow:
1. Go to Actions tab in GitHub
2. Select "Playwright Tests" workflow
3. Click "Run workflow"
4. Choose browser (default: chromium)

### Troubleshooting E2E Tests

#### Tests fail with browser not found
```bash
npx playwright install chromium
```

#### Tests fail locally but pass in CI
- Clear test results: `rm -rf test-results playwright-report`
- Ensure dev server isn't already running on port 5173
- Check localStorage is cleared between tests

#### Need to update Page Objects after UI changes
- Locate the affected Page Object file
- Update selectors if IDs or data-testid attributes changed
- Update expectations if text or behavior changed
- Run tests to verify changes

### Test Data

Test data is centralized in `e2e-tests/helpers/testHelpers.ts`:
- `TestData.approvedLoan` - Should be auto-approved
- `TestData.rejectedLoanHighAmount` - Rejected for high amount
- `TestData.rejectedLoanLongTerm` - Rejected for long term
- `TestData.smallLoan` - Edge case: minimal amount
- `TestData.zeroInterestLoan` - Edge case: 0% interest
- `TestData.boundaryLoan` - Boundary: exactly at limits

### E2E Test Statistics

Current E2E test suite:
- **Total E2E test files**: 3
- **Total E2E tests**: 20
- **Form validation tests**: 7
- **Loan creation tests**: 5
- **Loan decision tests**: 8

All E2E tests pass successfully.
