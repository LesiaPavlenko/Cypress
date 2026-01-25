// Registration tests for QAuto
// Full validation coverage + stable selectors + basic auth via env
// App does NOT trim spaces, so values with spaces are treated as invalid

function generateEmail() {
  return `lesia+${Date.now()}@test.com`;
}

describe("Registration form - validation", () => {
  beforeEach(() => {
    // open app with basic auth from env
    cy.openApp();
    // 
    cy.contains("button", "Sign In").click();
    // open registration modal
    cy.contains("button", "Registration").click();
    // verify modal opened
    cy.get(".modal-title").should("contain", "Registration");
  });

    // Empty form submission
  it("All fields empty - errors and Registration disabled", () => {
    // mark fields as touched
    cy.get("#signupName").click();
    cy.get("#signupLastName").click();
    cy.get("#signupEmail").click();
    cy.get("#signupPassword").click();
    cy.get("#signupRepeatPassword").click();

    // submit empty form
    cy.contains(".modal-footer button", "Register").click({ force: true });

    // verify error messages
    cy.contains("Name required");
    cy.contains("Last name required");
    cy.contains("Email required");
    cy.contains("Password required");
    cy.contains("Re-enter password");

    // verify invalid classes
    cy.get("#signupName").should("have.class", "is-invalid");
    cy.get("#signupLastName").should("have.class", "is-invalid");
    cy.get("#signupEmail").should("have.class", "is-invalid");
    cy.get("#signupPassword").should("have.class", "is-invalid");
    cy.get("#signupRepeatPassword").should("have.class", "is-invalid");

    // Register button disabled
    cy.contains(".modal-footer button", "Register").should("be.disabled");
  });

  // Name field validation

  it("Name invalid symbols", () => {
    cy.get("#signupName").type("12@");
    cy.get("#signupLastName").click();
    cy.contains("Name is invalid");
  });

  it("Name too short", () => {
    cy.get("#signupName").type("A");
    cy.get("#signupLastName").click();
    cy.contains("Name has to be from 2 to 20 characters long");
  });

  it("Name max length = 20 is valid", () => {
    cy.get("#signupName").type("A".repeat(20));
    cy.get("#signupLastName").click();
    cy.get("#signupName").should("not.have.class", "is-invalid");
  });

  it("Name more than 20 characters shows error", () => {
    cy.get("#signupName").type("A".repeat(21));
    cy.get("#signupLastName").click();
    cy.contains("Name has to be from 2 to 20 characters long");
  });

  it("Name with spaces is invalid", () => {
    cy.get("#signupName").type("   Anna   ");
    cy.get("#signupLastName").click();
    cy.get("#signupName").should("have.class", "is-invalid");
  });

  // Last Name field validation

  it("Last name invalid symbols", () => {
    cy.get("#signupLastName").type("123");
    cy.get("#signupName").click();
    cy.contains("Last name is invalid");
  });

  it("Last name too short", () => {
    cy.get("#signupLastName").type("A");
    cy.get("#signupName").click();
    cy.contains("Last name has to be from 2 to 20 characters long");
  });

  it("Last name too long", () => {
    cy.get("#signupLastName").type("B".repeat(21));
    cy.get("#signupName").click();
    cy.contains("Last name has to be from 2 to 20 characters long");
  });

  it("Last name with spaces is invalid", () => {
    cy.get("#signupLastName").type("  Smith  ");
    cy.get("#signupName").click();
    cy.get("#signupLastName").should("have.class", "is-invalid");
  });

  // Email field validation

  it("Email invalid format", () => {
    cy.get("#signupEmail").type("test@@mail");
    cy.get("#signupName").click();
    cy.contains("Email is incorrect");
  });

  it("Email with spaces is invalid", () => {
    cy.get("#signupEmail").type("  test@mail.com  ");
    cy.get("#signupName").click();
    cy.get("#signupEmail").should("have.class", "is-invalid");
  });

  // Password field validation

  it("Password invalid rules", () => {
    cy.get("#signupPassword").type("abcdefg", { sensitive: true });
    cy.get("#signupName").click();
    cy.contains(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
  });

  it("Password min length = 8 is valid", () => {
    cy.get("#signupPassword").type("Qwerty1a", { sensitive: true });
    cy.get("#signupName").click();
    cy.get("#signupPassword").should("not.have.class", "is-invalid");
  });

  it("Password max length = 15 is valid", () => {
    cy.get("#signupPassword").type("Qwerty12345Abcd", { sensitive: true });
    cy.get("#signupName").click();
    cy.get("#signupPassword").should("not.have.class", "is-invalid");
  });

  // Repeat password field validation

  it("Repeat password required when password is filled", () => {
    cy.get("#signupPassword").type("Qwerty1a", { sensitive: true });
    cy.contains(".modal-footer button", "Register").click({ force: true });
    cy.contains("Re-enter password");
  });

  it("Passwords do not match", () => {
    cy.get("#signupPassword").type("Qwerty1a", { sensitive: true });
    cy.get("#signupRepeatPassword").type("Qwerty2a", { sensitive: true });
    cy.get("#signupName").click();
    cy.contains("Passwords do not match");
  });

  // Registration button
  
  it("Register button enabled when form is valid", () => {
    cy.get("#signupName").clear().type("Anna");
    cy.get("#signupLastName").clear().type("Smith");
    cy.get("#signupEmail").clear().type(generateEmail());
    cy.get("#signupPassword").type("Qwerty1a", { sensitive: true });
    cy.get("#signupRepeatPassword").type("Qwerty1a", { sensitive: true });

    // trigger validation
    cy.get(".modal-title").click();
    // verify Register button is enabled
    cy.contains(".modal-footer button", "Register", { timeout: 10000 })
      .should("be.enabled");
  });
});

// Registration with logout and login

describe("Successful registration and login", () => {
  it("User can register, logout and login using custom command", () => {
    const email = generateEmail();
    const password = "Qwerty1a";

    cy.openApp();

    cy.contains("button", "Sign In").click();
    cy.contains("button", "Registration").click();

    cy.get("#signupName").type("Lesia");
    cy.get("#signupLastName").type("Pavlenko");
    cy.get("#signupEmail").type(email);
    cy.get("#signupPassword").type(password, { sensitive: true });
    cy.get("#signupRepeatPassword").type(password, { sensitive: true });

    cy.get(".modal-title").click();

    cy.contains(".modal-footer button", "Register", { timeout: 2000 })
      .should("be.enabled")
      .click();

    cy.url().should("include", "/panel");

    // open user menu
    cy.get("#userNavDropdown").click();

    cy.contains("button", "Logout").should("be.visible").click();

    // login via custom command
    cy.login(email, password);
  });
});
