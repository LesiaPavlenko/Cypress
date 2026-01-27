import GaragePage from "../pages/GaragePage";
import ExpensesPage from "../pages/ExpensesPage";

describe("QAuto: add car and fuel expense", () => {
  beforeEach(() => {
    cy.qautoLogin();
  });

  it("User can add Porsche Cayenne and add fuel expense", () => {
    const carName = "Porsche Cayenne";

    // ----- ADD CAR -----
    GaragePage.addCar("Porsche", "Cayenne", "10000");
    cy.contains(carName).should("be.visible");

    // ----- ADD EXPENSE -----
    ExpensesPage.addExpense(carName, "10100", "20", "800");

    // verify expense appears
    cy.contains("800").should("be.visible");
  });
});
