import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ShoppingCart from "../shopping-cart";

describe("ShoppingCart", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("shows loading while fetching", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading cart/i)).toBeInTheDocument();
  });

  test("shows empty cart message", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
      }),
    });

    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/your cart is empty/i)
    ).toBeInTheDocument();
  });

  test("renders items returned from the API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 1,
            quantity: 2,
            product: {
              id: 1,
              name: "Classic Tee",
              price: "30.00",
            },
          },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );

    expect(await screen.findByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();
    expect(screen.getByText("$60.00")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /checkout/i })
    ).toBeInTheDocument();
  });

  test("updates quantity when + is clicked", async () => {
    globalThis.fetch = vi
      .fn()
      // Initial GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 1,
              quantity: 2,
              product: {
                id: 1,
                name: "Classic Tee",
                price: "30.00",
              },
            },
          ],
        }),
      })
      // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      // GET after PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 1,
              quantity: 3,
              product: {
                id: 1,
                name: "Classic Tee",
                price: "30.00",
              },
            },
          ],
        }),
      });

    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );

    const plusButton = (
      await screen.findAllByRole("button", { name: "+" })
    )[0];

    await userEvent.click(plusButton);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/cart/item/1",
      expect.objectContaining({
        method: "PATCH",
      })
    );

    expect(await screen.findByText("$90.00")).toBeInTheDocument();
  });

  test("removes an item", async () => {
    globalThis.fetch = vi
      .fn()
      // initial GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 1,
              quantity: 2,
              product: {
                id: 1,
                name: "Classic Tee",
                price: "30.00",
              },
            },
          ],
        }),
      })
      // DELETE
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      // refetch after delete
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [],
        }),
      });
  
    const user = userEvent.setup();
  
    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );
  
    const removeBtn = await screen.findByRole("button", {
      name: /remove/i,
    });
  
    await user.click(removeBtn);
  
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/cart/item/1",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
  });
});