import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrackOrder from "../track-order";

const mockFetch = (data) => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      })
    );
  };

describe("TrackOrder", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.restoreAllMocks();
    globalThis.fetch = undefined;
  });

  test("shows empty state initially", () => {
    render(<TrackOrder />);

    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  test("updates input value", async () => {
    const user = userEvent.setup();
    render(<TrackOrder />);

    const input = screen.getByPlaceholderText(/enter your email/i);

    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  });

  test("submits form and fetches orders", async () => {
    const user = userEvent.setup();
  
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              status: "shipped",
              total: 42.5,
              items: [
                { product: "Shirt", quantity: 2 },
                { product: "Hat", quantity: 1 },
              ],
            },
          ]),
      })
    );
  
    render(<TrackOrder />);
  
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "test@example.com"
    );
  
    await user.click(
      screen.getByRole("button", { name: /track order/i })
    );
  
    expect(await screen.findByText(/order #1/i)).toBeInTheDocument();
    expect(screen.getByText(/shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/hat/i)).toBeInTheDocument();
  });

  test("handles empty response correctly", async () => {
    const user = userEvent.setup();

    mockFetch([]);

    render(<TrackOrder />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /track order/i });

    await user.type(input, "example123@test.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/No orders found./i)).toBeInTheDocument();
    });
  });
});