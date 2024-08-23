import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'I verify the downloaded file {string} has the contents {string}',
  (fileName: string, fileContent: string) => {
    const downloadsFolder = Cypress.config('downloadsFolder');

    const filePath = `cypress/downloads/${fileName}`;

    cy.readFile(filePath, { timeout: 5000 }).then((content) => {
      expect(content).to.include(fileContent);
    });
  }
);
