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
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="products-container">Loading...</div>;
  if (error) return <div className="products-container">{error}</div>;

  return (
    <div className="products-container">

      <div className="products-grid">

        {products.map((p) => (
          <Link
            key={p.id}
            to={`/all-products/${p.id}`}
            className="product-card"
          >
            <div className="product-image-placeholder" />

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
