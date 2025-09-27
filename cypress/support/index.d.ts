declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string, ...args): Chainable<JQuery<HTMLElement>>
  }
}


