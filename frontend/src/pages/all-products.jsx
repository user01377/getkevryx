import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/all-products.css";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        const json = await res.json();

        const list = json.data ?? [];

        const sorted = [...list].sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );

        setProducts(sorted);
      } catch (err) {
        console.error(err);
        setError("Unable to resolve products. Please Try Again Later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
  return (
    <div className="products-container">
      <div className="products-grid">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="product-card skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-line title" />
            <div className="skeleton-line text" />
            <div className="skeleton-line price" />
          </div>
        ))}
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="products-error">
          <h2>Unable to load products</h2>
          <p>Please try refreshing the page.</p>

          <button
            className="products-error-btn"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">

      <div className="products-grid">

        {products.map((p) => (
          <Link
            key={p.id}
            to={`/all-products/${p.id}`}
            className="product-card"
          >
            <img
              src={`https://cataas.com/cat?width=400&height=600&random=${p.id}`}
              alt={p.name}
              className="product-image"
            />

            <h3 className="product-name">{p.name}</h3>
            <p className="product-description">{p.description}</p>

            <span className="product-price">
              ${parseFloat(p.price).toFixed(2)}
            </span>
          </Link>
        ))}

      </div>

    </div>
  );
}
