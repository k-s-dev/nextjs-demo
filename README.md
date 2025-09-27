# Nextjs auth template

## Stack & Features

- Framework: [Nextjs - app router](https://nextjs.org/)
- Styling
  - vanilla css and sass (without css/sass modules)
  - styled components: [mantine](https://mantine.dev/)
  - icons: [react-icons](https://react-icons.github.io/react-icons/)
- Data backend
  - [Prisma ORM](https://www.prisma.io/)
  - Database: sqlite (can be configured with `.env*`)
  - Data access and control layer
  - Admin template

- File uploads: [Vercel blob](https://vercel.com/docs/vercel-blob)

- Auth: [Authjs](https://authjs.dev/)
  - providers (github, google, ...) can be configured
  - encryption/session management: [jose](https://github.com/panva/jose)
  - Authorization: simple role based checks
- Emails: [nodemailer]()
- Testing
  - Unit and component testing: [jest](https://nextjs.org/docs/app/guides/testing/jest)
  - end2end: [cypress](https://nextjs.org/docs/app/guides/testing/cypress)
- Forms
  - client and server actions
  - validation (client and server): using [valibot](https://valibot.dev/)

## Dev workflow

### Setup env variables

Sample environment files provided below and in git repo.

Refer to below links for more details.

- [Nextjs environment setup](https://nextjs.org/docs/app/guides/environment-variables)
- [Authjs environment setup](https://authjs.dev/getting-started/installation#setup-environment)
- Gmail account details for verification emails.
- Prisma database setup configuration
- [Vercel blob store key](https://vercel.com/docs/vercel-blob)

#### Generic (`.env`)

```bash
# .env
AUTH_SECRET=
SALT=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_EMAIL_ID=
AUTH_EMAIL_PASSWORD=
```

```bash
# .env.local
BLOB_READ_WRITE_TOKEN=
```

#### Production

```bash
# .env.development.local

PORT=3000
HOST=http://localhost:${PORT}
DATABASE_URL="file:../../dev.db"
```

#### Development

```bash
# .env.production.local

PORT=3000
HOST=http://localhost:${PORT}
DATABASE_URL="file:../../prod.db"
```

#### Test

```bash
# .env.test.local

CYPRESS_NODE_ENV=test
NODE_ENV=test
PORT=3000
HOST=http://localhost:${PORT}
DATABASE_URL="file:../../test.db"
```

### Install node modules

```bash
npm install
```

- Note: with `package-lock.json`, `npm install` should work fine. Without it there might be [issue  while installing cypress.](https://github.com/cypress-io/cypress/issues/29204)
- Solution: If you are installing latest versions without `package-lock.json` then
  - install `cypress` first: `npm install cypress@latest --save-dev --ignore-scripts`
  - then `npm i` as usual

### Run server

Refer to `package.json` for npm scripts to run for dev, test and production. e.g. 

```bash
npm run dev
```

### Run tests

Refer to `package.json` for npm scripts to run tests. Currently e2e tests are setup to run auth and admin user flows.

```bash
npm run test
```

Then in separate terminal

```bash
npm run test:cypress:e2e
```

## Project structure

- `<project root>`
- `cypress`: tests
- `src`: all code related to server
  - `app`: app router with layouts and pages
  - `database`: prisma/database setup
    - `models`: table schema definitions
    - `utils`: server functions for prisma/db management
    - `schema.prisma`: main prisma setup
  - `lib`: supporting logic for the app
    - `components`: ui generic react components
    - `dataModels`: for each db model/table
      - data access control
      - ui: form fields, crud forms
      - definitions: validation schemas, types for typescript
    - `features`: app feature specific ui components, actions, definitions
    - `utils`: miscellaneous helper functions, e.g. mail, encryption etc.
  - `styles`: sass abstract definitions and base styles
  - `middleware.ts`
