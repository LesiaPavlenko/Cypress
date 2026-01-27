class GaragePage {
  addCarBtn = () => cy.contains("button", "Add car");

  modalWindow = () => cy.get("ngb-modal-window");

  brandSelect = () => this.modalWindow().find("#addCarBrand");
  modelSelect = () => this.modalWindow().find("#addCarModel");
  mileageInput = () => this.modalWindow().find("#addCarMileage");

  modalAddBtn = () => this.modalWindow().contains("button", "Add");

  openAddCarModal() {
    this.addCarBtn().should("be.visible").click();
    this.modalWindow().should("be.visible");
  }

  addCar(brand, model, mileage) {
    this.openAddCarModal();

    this.brandSelect().select(brand);
    this.modelSelect().select(model);
    this.mileageInput().type(mileage);

    this.modalAddBtn().should("be.enabled").click();
    this.modalWindow().should("not.exist");
  }
}

export default new GaragePage();
