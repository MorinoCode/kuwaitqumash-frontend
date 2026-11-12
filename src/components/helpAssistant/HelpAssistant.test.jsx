import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import HelpAssistant from "./HelpAssistant";
import { renderWithProviders } from "../../test/renderWithProviders";

const setup = (props = {}) => {
  const onClose = vi.fn();
  return renderWithProviders(<HelpAssistant isOpen onClose={onClose} {...props} />);
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("HelpAssistant", () => {
  it("renders nothing when closed", () => {
    const { container } = renderWithProviders(
      <HelpAssistant isOpen={false} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("opens as a dialog with the greeting", () => {
    const { container } = setup();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(container.querySelectorAll(".help-msg").length).toBe(1);
  });

  it("shows suggestion chips before the first question", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".help-chip").length).toBeGreaterThan(0);
  });

  it("answers a question after the thinking delay", () => {
    const { container } = setup();
    const input = container.querySelector(".help-assistant__input");

    fireEvent.change(input, { target: { value: "چطور فروش ثبت کنم؟" } });
    fireEvent.submit(container.querySelector(".help-assistant__form"));

    expect(container.querySelector(".help-msg--typing")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const messages = container.querySelectorAll(".help-msg");
    expect(messages.length).toBe(3);
    expect(container.querySelector(".help-msg--typing")).toBeNull();
  });

  it("sends a quick question from a chip", () => {
    const { container } = setup();
    fireEvent.click(container.querySelectorAll(".help-chip")[0]);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelectorAll(".help-msg").length).toBe(3);
  });

  it("disables send for an empty draft", () => {
    const { container } = setup();
    expect(container.querySelector(".help-assistant__send")).toBeDisabled();
  });

  it("toggles the quick questions list", () => {
    const { container } = setup();
    const toggle = container.querySelectorAll(".help-assistant__tool")[0];
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".help-assistant__suggestions-title")).toBeTruthy();
  });

  it("starts a new chat", () => {
    const { container } = setup();
    const input = container.querySelector(".help-assistant__input");
    fireEvent.change(input, { target: { value: "چطور فروش ثبت کنم؟" } });
    fireEvent.submit(container.querySelector(".help-assistant__form"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelectorAll(".help-msg").length).toBe(3);

    fireEvent.click(container.querySelectorAll(".help-assistant__tool")[1]);
    expect(container.querySelectorAll(".help-msg").length).toBe(1);
  });

  it("closes with the close button", () => {
    const onClose = vi.fn();
    const { container } = setup({ onClose });
    fireEvent.click(container.querySelectorAll(".help-assistant__tool")[2]);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    setup({ onClose });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
