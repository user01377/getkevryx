import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/garment-page.css";

export default function GarmentPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const [toastLeaving, setToastLeaving] = useState(false);

  const showToast = (toastData) => {
    setToast(toastData);
    setToastLeaving(false);
  
    setTimeout(() => {
      setToastLeaving(true);
    }, 1800);
  
    setTimeout(() => {
      setToast(null);
      setToastLeaving(false);
    }, 2100);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const json = await res.json();

        const data = json.data ?? json;

        setProduct(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [slug]);

  
  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to add item");
      }
      
      showToast({
        type: "success",
        title: "Added to Cart",
        message: product.name,
      });

      window.dispatchEvent(new Event("cart-updated"));
  
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message,
      });
    }
  };

  if (!product) return <p className="loading">Loading...</p>;
  
  return (
    <main className="product-page">
      <div className="product-container">

        {/* Product Image */}
        <div className="product-image-wrapper">
          <img
            src={`https://cataas.com/cat?width=800&height=1200&random=${product.id}`}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-details">
          <h1 className="garment-name">{product.name}</h1>

          <div className="garment-price">
            ${parseFloat(product.price).toFixed(2)}
          </div>

          <p className="garment-description">
            {product.description}
          </p>

          <div className="section">
            <span className="section-label">QUANTITY</span>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="qty-btn"
              >-</button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                className="qty-btn"
              >+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          
        </div>

      </div>

      {toast && (
        <div className={`toast ${toastLeaving ? "toast-hide" : ""} ${toast.type}`}>
          
          {toast.type === "success" && (
            <img
              src={`https://cataas.com/cat?width=800&height=1200&random=${product.id}`}
              className="toast-image"
              alt=""
            />
          )}

          <div className="toast-text">
            <p className="toast-title">
              {toast.title}
            </p>

            <p className="toast-subtitle">
              {toast.message}
            </p>
          </div>
        </div>
      )}
      
    </main>
  );
}
