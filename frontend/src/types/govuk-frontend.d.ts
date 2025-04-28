// Tell TypeScript that the govuk-frontend module exists
// and exports an initAll function.
declare module "govuk-frontend" {
  /**
   * Initialise GOV.UK Frontend components
   *
   * @param {NodeListOf<Element> | HTMLElement} [$scope] Scope DOM node or NodeList to initialse components in
   */
  export function initAll($scope?: NodeListOf<Element> | HTMLElement): void;
}
