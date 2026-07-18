import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductsGrid from "../all-products";

describe("ProductsGrid", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    vi.clearAllMocks();
  });

  test("shows loading skeleton initially", () => {
    globalThis.fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ProductsGrid />
      </MemoryRouter>
    );

    const skeletons = screen.getAllByText("", {
      selector: ".skeleton-card",
    });

    expect(skeletons.length).toBe(9);
  });


  test("renders products sorted by price (low to high)", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, name: "Expensive", price: "120", description: "x" },
          { id: 2, name: "Cheap", price: "10", description: "x" },
          { id: 3, name: "Medium", price: "50", description: "x" },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ProductsGrid />
      </MemoryRouter>
    );

    const names = await screen.findAllByRole("heading", { level: 3 });

    expect(names.map((n) => n.textContent)).toEqual([
      "Cheap",
      "Medium",
      "Expensive",
    ]);
  });

  test("shows error message when fetch fails", async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error("API failure"));

    render(
      <MemoryRouter>
        <ProductsGrid />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/unable to load products/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/please try refreshing the page/i)
    ).toBeInTheDocument();
  });

  test("renders product links correctly", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 7, name: "Test Product", slug: "test-product" ,price: "10", description: "desc" },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ProductsGrid />
      </MemoryRouter>
    );

    const link = await screen.findByRole("link");

    expect(link).toHaveAttribute("href", "/all-products/test-product");
  });

  test("formats price correctly", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, name: "Item", slug: "item", price: "5", description: "desc" },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ProductsGrid />
      </MemoryRouter>
    );

    expect(await screen.findByText("$5.00")).toBeInTheDocument();
  });
});