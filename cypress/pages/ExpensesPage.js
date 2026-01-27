class ExpensesPage {
  modalWindow = () => cy.get("ngb-modal-window");

  mileageInput = () => this.modalWindow().find("#addExpenseMileage");
  litersInput = () => this.modalWindow().find("#addExpenseLiters");
  totalCostInput = () => this.modalWindow().find("#addExpenseTotalCost");

  modalAddBtn = () => this.modalWindow().contains("button", "Add");

  // find Add fuel expense button inside specific car card
  addFuelExpenseForCar(carName) {
    cy.contains(".car-item", carName)
      .should("be.visible")
      .within(() => {
        cy.get("button.car_add-expense").click();
      });

    this.modalWindow().should("be.visible");
  }

  addExpense(carName, mileage, liters, cost) {
    this.addFuelExpenseForCar(carName);

    this.mileageInput().clear().type(mileage);
    this.litersInput().type(liters);
    this.totalCostInput().type(cost);

    this.modalAddBtn().should("be.enabled").click();
    this.modalWindow().should("not.exist");
  }
}

export default new ExpensesPage();
