declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string, ...args): Chainable<JQuery<HTMLElement>>
    confirmSignIn(email: string, password: string): Chainable<JQuery<HTMLElement>>
  }
}


