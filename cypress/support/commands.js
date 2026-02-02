// Custom Cypress commands and command overwrites

// Overwrite type to hide sensitive data in logs
Cypress.Commands.overwrite("type", (originalFn, element, text, options = {}) => {
  if (options.sensitive) {
    options.log = false;

    Cypress.log({
      $el: element,
      name: "type",
      message: "*".repeat(text.length),
    });
  }

  return originalFn(element, text, options);
});

// Custom login command (UI login)
Cypress.Commands.add("login", (email, password) => {
  cy.visit("https://qauto.forstudy.space/", {
    auth: {
      username: "guest",
      password: "welcome2qauto",
    },
  });

  cy.contains("button", "Sign In").click();

  cy.get("#signinEmail").type(email);
  cy.get("#signinPassword").type(password, { sensitive: true });

  cy.contains("button", "Login").click();

  cy.url().should("include", "/panel");
});

// Custom command to open app with basic auth
Cypress.Commands.add("openApp", () => {
  cy.visit(Cypress.env("baseUrl"), {
    auth: {
      username: Cypress.env("basicAuthUser"),
      password: Cypress.env("basicAuthPassword"),
    },
  });
});

// Open QAuto app using env config
Cypress.Commands.add("qautoOpenApp", () => {
  cy.visit(Cypress.env("baseUrl"), {
    auth: {
      username: Cypress.env("basicAuthUser"),
      password: Cypress.env("basicAuthPassword"),
    },
  });
});

// Login using users from env config
Cypress.Commands.add("qautoLogin", () => {
  cy.qautoOpenApp();

  cy.contains("button", "Sign In").click();

  cy.get("#signinEmail").type(Cypress.env("userEmail"));
  cy.get("#signinPassword").type(Cypress.env("userPassword"), { sensitive: true });

  cy.contains("button", "Login").click();
  cy.url().should("include", "/panel");
});

// API command to create a car expense
Cypress.Commands.add(
  "createExpenseApi",
  (carId, mileage, liters, totalCost) => {
    return cy.request({
      method: "POST",
      url: "/api/expenses",

      auth: {
        username: "guest",
        password: "welcome2qauto"
      },

      body: {
        carId,
        mileage,
        liters,
        totalCost,
        reportedAt: Date.now()
      }
    });
  });



