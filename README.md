# How to run the project

1. Run `npm install`
2. Run `npm run dev`

## Previewing the build

1. Run `npm run build`
2. Run `npm run preview`

# About the project

This is a React project built using Vite with TypeScript, RTK Toolkit, Ant Design, and TailwindCSS.

After logging in, you will see a LogOut button. Click on this button to remove al tokens and set isAuthenticated to false and to get redirected to the login.

The app remembers your preferred theme (the latest theme set).

The app is completely navigable by keyboard.

The tokens are stored in localStorage and not in the Redux store since they need to be persisted.

# Extras

## End-to-end tests

You can run the e2e test suit following these steps:

1. Run the project: `npm run dev`
2. Run Cypress: `npm run e2e:run`

This way you can see the result of the e2e tests in the terminal

Alternatively, you can open Cypress to actually see the tests running in the Chrome window. For this, do the following:

1. Run the project: `npm run dev`
2. Run Cypress: `npm run e2e:open`
3. Click on the E2E Testing option
4. Choose your browser and click on the Start E2E Testing button
5. Click on the spec.cy.ts file
6. See the tests running

## Path alias

A path alias was added to `src` facilitate the importing of components and files. Instead of importing files like so:

```
import Component from '../../components/Component';
```

You can use this:

```
import Component from '@/components/Component';
```
