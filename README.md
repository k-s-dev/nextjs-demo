# Nextjs starter template

## Stack & Features

- Framework: [Nextjs - app router](https://nextjs.org/)
- Styling
  - vanilla css and sass
  - styled components: [mantine](https://mantine.dev/)
  - icons: [react-icons](https://react-icons.github.io/react-icons/)
- Data backend
  - Database: `postgresql` (can be configured with `.env*`)
  - [Prisma ORM](https://www.prisma.io/)
  - Data access and control layer
  - Admin template

- File uploads: [Vercel blob](https://vercel.com/docs/vercel-blob)

- Auth: [Better-Auth](www.better-auth.com)
  - providers (github, google, ...) can be configured
  - Authorization: simple role based checks
- Emails: [nodemailer]()
- Testing
  - Unit and component testing: [jest](https://nextjs.org/docs/app/guides/testing/jest)
  - end2end: [cypress](https://nextjs.org/docs/app/guides/testing/cypress)
- Forms
  - `formData` parser
  - client and server actions
  - validation (client and server): using [valibot](https://valibot.dev/)

## Dev setup

### Setup env variables

Sample environment files provided below and in git repo.

Refer to below links for more details.

- [Nextjs environment setup](https://nextjs.org/docs/app/guides/environment-variables)
- [Better-Auth environment setup](https://www.better-auth.com/docs/installation#set-environment-variables)
  - `BETTER_AUTH_HASH_COST` is configuration for how slow/fast password hash/verify functions work depending on the environment

#### Checklist

- **Database**: Prisma database setup configuration

- **File uploads**:
  - env variable `UPLOAD_METHOD` decides where to upload files
    - options
      - `local`: local `public` folder is used
      - `vercel-blob`: [Vercel blob store key is needed](https://vercel.com/docs/vercel-blob)

- **Emails**: Gmail account details for verification emails.

#### Samples

- provided in `/env_samples/` directory

### Install node modules

```bash
npm install
```

- Note: with `package-lock.json`, `npm install` should work fine. Without it there might be [issue  while installing cypress.](https://github.com/cypress-io/cypress/issues/29204)
- Solution: If you are installing latest versions without `package-lock.json` then
  - install `cypress` first: `npm install cypress@latest --save-dev --ignore-scripts`
  - then `npm i` as usual

### Setup database

- Check prisma configuration
- Check npm scripts in `package.json` based on workflow choices
- Generate initial migrations.

```bash
npm run dev:db:migrate
```

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
