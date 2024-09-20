# How to run the project

1. Run `npm install`
2. Run `npm run dev`

# About the project

This is a React project built using Vite with TypeScript, RTK Toolkit, Ant Design, and TailwindCSS.

After logging in, you will see a LogOut button. Click on this button to remove al tokens and set isAuthenticated to false and to get redirected to the login.

The app remembers your preferred theme (the latest theme set).

The tokens are stored in localStorage and not in the Redux store since they need to be persisted.
