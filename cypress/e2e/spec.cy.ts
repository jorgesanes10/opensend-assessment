describe('Tests login and navigation', () => {
  it('Shows an error when the credentials are not valid', () => {
    cy.visit('/');

    // Types in incorrect email and password
    cy.get('#login_username').type('fake.email@mail.com');
    cy.get('#login_password').type('fakepassword');

    // Clicks on the Log in button
    cy.get('[data-testid="login-btn"]').click();

    // Asserts that the correct error message appears
    cy.get('[data-testid="login-error-message"]').should(
      'have.text',
      `User with email fake.email@mail.com doesn't exist`,
    );
  });

  it('Shows an error when the password is not correct', () => {
    cy.visit('/');

    // Types in incorrect password
    cy.get('#login_username').type('test+admin@yopmail.com');
    cy.get('#login_password').type('fakepassword');

    // Clicks on the Log in button
    cy.get('[data-testid="login-btn"]').click();

    // Asserts that the correct error message appears
    cy.get('[data-testid="login-error-message"]').should(
      'have.text',
      `Password is not correct`,
    );
  });

  it('Navigates to the admin page', () => {
    cy.visit('/');

    // Types in the email and password
    cy.get('#login_username').type('test+admin@yopmail.com');
    cy.get('#login_password').type('12345678');

    // Clicks on the Log in button
    cy.get('[data-testid="login-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Admin page');

    // Clicks on the log out button
    cy.get('[data-testid="logout-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Welcome back!');
  });

  it('Navigates to the dashboard page', () => {
    cy.visit('/');

    // Types in the email and password
    cy.get('#login_username').type('test+member@yopmail.com');
    cy.get('#login_password').type('12345678');

    // Clicks on the Log in button
    cy.get('[data-testid="login-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Dashboard');

    // Clicks on the log out button
    cy.get('[data-testid="logout-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Welcome back!');
  });

  it('Navigates to the onboarding page', () => {
    cy.visit('/');

    // Types in the email and password
    cy.get('#login_username').type('test+onboarding@yopmail.com');
    cy.get('#login_password').type('12345678');

    // Clicks on the Log in button
    cy.get('[data-testid="login-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Onboarding page');

    // Clicks on the log out button
    cy.get('[data-testid="logout-btn"]').click();

    // Asserts that the heading has the correct text
    cy.get('h1').should('have.text', 'Welcome back!');
  });
});

describe('tests theming', () => {
  it('toggles between light and dark mode', () => {
    cy.visit('/');

    // Asserts that the body has the light theme class
    cy.get('body').should('have.class', 'light');

    // Clicks on the toggle theme button
    cy.get('[data-testid="theme-toggle-btn"]').click();

    // Asserts that the body has the dark theme class
    cy.get('body').should('have.class', 'dark');

    // Clicks on the toggle theme button
    cy.get('[data-testid="theme-toggle-btn"]').click();

    // Asserts that the body has the light theme class
    cy.get('body').should('have.class', 'light');
  });
});
