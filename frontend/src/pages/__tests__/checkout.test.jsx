import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../checkout";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Checkout page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();

    globalThis.fetch = vi.fn();
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockSummary = {
    items: [
      { product: "Shirt", quantity: 2, price: "10.00" },
      { product: "Pants", quantity: 1, price: "20.00" },
    ],
    subtotal: "40.00",
    shipping: "5.00",
    tax: "4.00",
    total: "49.00",
  };

  it("shows loading first", async () => {
    globalThis.fetch.mockImplementation(
      () =>
        new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading checkout/i)).toBeInTheDocument();
  });

  it("renders summary after fetch", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => mockSummary,
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(await screen.findByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Shirt")).toBeInTheDocument();
    expect(screen.getByText("Pants")).toBeInTheDocument();
    expect(screen.getByText("$40.00")).toBeInTheDocument();
  });

  it("updates form fields", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => mockSummary,
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const firstName = await screen.findByPlaceholderText("First Name");
    await user.type(firstName, "John");

    expect(firstName.value).toBe("John");
  });

  it("submits checkout and navigates on success", async () => {
    globalThis.fetch
      .mockResolvedValueOnce({
        json: async () => mockSummary,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ order_id: 123 }),
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    await screen.findByText("Checkout");

    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Address"), "123 St");
    await user.type(screen.getByPlaceholderText("City"), "Dallas");
    await user.type(screen.getByPlaceholderText("State"), "TX");
    await user.type(screen.getByPlaceholderText("ZIP"), "75001");

    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/order/123");
    });
  });

  it("shows alert on checkout failure", async () => {
    globalThis.fetch
      .mockResolvedValueOnce({
        json: async () => mockSummary,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: "Checkout failed" }),
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    await screen.findByText("Checkout");

    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Address"), "123 St");
    await user.type(screen.getByPlaceholderText("City"), "Dallas");
    await user.type(screen.getByPlaceholderText("State"), "TX");
    await user.type(screen.getByPlaceholderText("ZIP"), "75001");

    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Checkout failed");
    });
  });
});