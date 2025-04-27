import { GlobalStyle as GovUKGlobalStyle } from "govuk-react";

// Extend the base GovUKGlobalStyle if needed, or just export it directly
// If you have custom global overrides, you can create a new style:
/*
const CustomGlobalStyle = createGlobalStyle`
  // Import base styles first
  ${GovUKGlobalStyle}

  // Your custom overrides/additions
  body {
     background-color: #f3f2f1; // Example override
  }
`;
export default CustomGlobalStyle;
*/

// If no overrides are needed for now, just export the base style directly
export default GovUKGlobalStyle;
