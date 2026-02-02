import GaragePage from "../pages/GaragePage";

describe("UI + API: car creation and expense validation", () => {
  const carData = {
    brand: "Porsche",
    model: "Cayenne",
    mileage: 10000
  };

  const expenseData = {
    mileage: 10100,
    liters: 20,
    totalCost: 800
  };

  it("Full flow: UI create car -> API validate -> API create expense -> UI validate", () => {
    let carId;

    // login
    cy.qautoLogin();

    // intercept car creation
    cy.intercept("POST", "**/api/cars").as("createCar");

    // create car via UI
    GaragePage.addCar(
      carData.brand,
      carData.model,
      carData.mileage.toString()
    );

    // get carId from intercept
    cy.wait("@createCar").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      carId = interception.response.body.data.id;
      expect(carId).to.exist;

      // validate car via API
      cy.request("GET", "/api/cars").then((response) => {
        expect(response.status).to.eq(200);

        const createdCar = response.body.data.find(
          (car) => car.id === carId
        );

        expect(createdCar).to.exist;
        expect(createdCar.brand).to.eq(carData.brand);
        expect(createdCar.model).to.eq(carData.model);
        expect(createdCar.mileage).to.eq(carData.mileage);
      });

      // create expense via API
      cy.createExpenseApi(
        carId,
        expenseData.mileage,
        expenseData.liters,
        expenseData.totalCost
      ).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body.data).to.include({
          mileage: expenseData.mileage,
          liters: expenseData.liters,
          totalCost: expenseData.totalCost
        });
      });


// UI validation: expense is visible on Fuel expenses page
const carName = `${carData.brand} ${carData.model}`;

// go to Fuel expenses page
cy.contains("a", "Fuel expenses", { timeout: 10000 })
  .should("be.visible")
  .click();

// ensure correct page
cy.url().should("include", "/panel/expenses");

// open car dropdown
cy.get("#carSelectDropdown", { timeout: 10000 })
  .should("be.visible")
  .click();

// select needed car (not disabled one)
cy.contains(
  ".car-select-dropdown_item:not(.disabled)",
  carName
).click();

// validate expense row in table
cy.get(".expenses_table", { timeout: 15000 })
  .should("be.visible")
  .within(() => {
    cy.contains(expenseData.mileage.toString()).should("be.visible");
    cy.contains(`${expenseData.liters}L`).should("be.visible");
    cy.contains(`${expenseData.totalCost}.00 USD`).should("be.visible");
  });


 });
 });
});
