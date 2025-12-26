
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/garment-page.css";

export default function GarmentPage() {
  const { slug } = useParams();   // get slug from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${slug}/`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(console.error);
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  return (
    <main className="product-page">
      <img src={product.image_url} alt={product.name} className="product-image" />

      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <span className="product-price">${product.price}</span>
        <p>Colors: {product.colors}</p>
        <p>Category: {product.category}</p>
        <p>Stock: {product.stock}</p>
      </div>
    </main>
  );
}
