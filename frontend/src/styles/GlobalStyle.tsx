import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Apply a base font and background, consistent with GOV.UK if possible */
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "GDS Transport", arial, sans-serif;
    background-color: #f3f2f1; /* GOV.UK Page background grey */
  }

  #root {
    height: 100%; 
    display: flex; /* Make #root the main flex container */
    flex-direction: column;
  }

  /* Target the main Page wrapper div (direct child of #root) */
  /* Make IT the flex container that allows main content to grow */
  #root > div {
    flex: 1; /* Make the Page wrapper fill #root height */
    display: flex;
    flex-direction: column;
    min-height: 0; /* Prevent content from overflowing container */
  }

  /* Target the width-container within the Page wrapper */
  .width-container__WidthContainer-sc-paw03d-0 {
    /* flex: 1; */
    display: flex;
    flex-direction: column;
    min-height: 0; 
    width: 100%; 
    max-width: 1020px; 
    margin-left: auto !important;  /* Re-added !important */
    margin-right: auto !important; /* Re-added !important */
  }

  /* Target the main content area itself */
  main.main__Main-sc-hiygwk-0 {
    /* flex: 1; */
     /* Let content determine height within centered container */
    padding-top: 30px !important; 
    padding-bottom: 30px !important; 
    /* overflow-y: auto; */
  }
  
  /* Resetting these intermediate containers, as the main targets above should handle layout */
  .src__OuterContainer-sc-1lvyroj-0,
  .src__InnerContainer-sc-1lvyroj-1 {
      flex: initial; 
      display: block; 
      padding-top: 0; 
      padding-bottom: 0; 
  }

  *, *:before, *:after {
    box-sizing: border-box; /* Changed from inherit */
  }
`;

export default GlobalStyle;
