import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/all-products.css";

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        // sorting cards by their prices, can change/adjust
        const sorted = data.sort((a, b) => a.price - b.price);
        setProducts(sorted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="products-container">

      <div className="products-grid">

        {products.map((p) => (
          <Link
            key={p.id}
            to={`/all-products/${p.slug}`} // link to the product page for that specific garment
            className="product-card"
          >
            <img src={p.image_url} alt={p.name} className="product-image" />
            <h3 className="product-name">{p.name}</h3>
            <p className="product-description">{p.description}</p>
            <span className="product-price">${p.price}</span>
          </Link>
        ))}

      </div>

    </div>
  );
}
