import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";
import ContactInboxPage from "./ContactInboxPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), patch: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { useAuth } from "../../context/AuthContext";

const messages = [
  {
    id: 1,
    name: "Sara",
    contact: "sara@example.com",
    message: "Need a demo",
    status: "new",
    created_at: "2026-11-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Ali",
    contact: "9651234567",
    message: "Pricing question",
    status: "read",
    created_at: "2026-10-30T10:00:00Z",
  },
];

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/admin/messages"]}>
      <ContactInboxPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({
    user: { id: 1, role: "store_owner" },
    loading: false,
  });
  api.get.mockResolvedValue({ data: { success: true, data: messages } });
  api.patch.mockResolvedValue({ data: { success: true } });
});

describe("ContactInboxPage", () => {
  it("loads the messages", async () => {
    const { container } = setup();
    await waitFor(() => expect(container.textContent).toContain("Sara"));
    expect(api.get).toHaveBeenCalledWith("/platform/contact");
  });

  it("shows the unread badge", async () => {
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".contact-inbox__badge").textContent).toBe("1"),
    );
  });

  it("marks a message as read", async () => {
    const { container } = setup();
    await waitFor(() => expect(container.textContent).toContain("Sara"));

    fireEvent.click(container.querySelector(".contact-inbox__action"));

    await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/platform/contact/1/read"));
    await waitFor(() =>
      expect(container.querySelector(".contact-inbox__badge")).toBeNull(),
    );
  });

  it("shows the empty state", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });
    const { container } = setup();
    await waitFor(() =>
      expect(container.textContent).toContain("هنوز پیامی نرسیده است"),
    );
  });

  it("denies access to non-owners without fetching", async () => {
    useAuth.mockReturnValue({
      user: { id: 2, role: "sales_man" },
      loading: false,
    });
    const { container } = setup();
    await waitFor(() =>
      expect(container.textContent).toContain("فقط مالک فروشگاه"),
    );
    expect(api.get).not.toHaveBeenCalled();
  });
});
