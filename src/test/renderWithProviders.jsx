import React from "react";
import { render } from "@testing-library/react";
import "../i18n";
import { ThemeProvider } from "../context/ThemeContext";

/**
 * Renders a component inside the providers every page expects (i18n + theme).
 * Individual tests can still wrap the returned element if they need a router.
 */
export const renderWithProviders = (ui, options = {}) =>
  render(<ThemeProvider>{ui}</ThemeProvider>, options);

export { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
