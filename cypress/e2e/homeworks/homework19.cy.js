describe('QAuto landing page tests', () => {
  beforeEach(() => {
    // Automatic basic authentication 
    cy.visit('https://qauto.forstudy.space/', {
      auth: {
        username: 'guest',
        password: 'welcome2qauto',
      },
    });
  });

  it('should open Sign up modal and display all registration fields', () => {
    // Open registration modal
    cy.contains('Sign up').should('be.visible').click();

    // Waiting until modal becomes visible (after animation)
    cy.get('ngb-modal-window')
      .should('be.visible')
      .within(() => {
        cy.contains('Registration').should('be.visible');

        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="lastName"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="repeatPassword"]').should('be.visible');

        cy.contains('Register').should('be.visible');
      });
  });

  it('should display all footer contact links', () => {
    // Social media links
    cy.get('.contacts_socials')
      .should('be.visible')
      .within(() => {
        cy.get('a.socials_link').should('have.length', 5); // Verify there are 5 social media links
    // Verify each social media link
        cy.get('a.socials_link[href*="facebook"]').should('exist');
        cy.get('a.socials_link[href*="t.me"]').should('exist');
        cy.get('a.socials_link[href*="youtube"]').should('exist');
        cy.get('a.socials_link[href*="instagram"]').should('exist');
        cy.get('a.socials_link[href*="linkedin"]').should('exist');
      });

    // Website link
    cy.get('a.contacts_link')
      .contains('ithillel.ua')
      .should('be.visible')
      .and('have.attr', 'href', 'https://ithillel.ua')
      .and('have.attr', 'target', '_blank');

    // Email link
    cy.get('a.contacts_link')
      .contains('support@ithillel.ua')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', 'mailto:');
  });
});