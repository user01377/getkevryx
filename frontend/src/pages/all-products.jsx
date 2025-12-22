import { React, useState, useEffect } from "react";
import "../styles/all-products.css"

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="products-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <img src={p.image_url} alt={p.name} />
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span>${p.price}</span>
        </div>
      ))}
    </div>
  );
}
