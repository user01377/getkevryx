import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/garment-page.css";

export default function GarmentPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/products/${id}`);
        const json = await res.json();

        const data = json.data ?? json;

        setProduct(data);

        if (data.colors) {
          const firstColor = data.colors.split(",")[0].trim();
          setSelectedColor(firstColor);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="loading">Loading...</p>;

  const colorsArray = product.colors ? product.colors.split(",").map(c => c.trim()) : [];

  // console.log(colorsArray);
  
  return (
    <main className="product-page">
      <div className="product-container">

        {/* Product Image */}
        <div className="product-image-wrapper">
          <img src={product.image_url} alt={product.name} className="product-image" />
        </div>

        <div className="product-details">

           <h1 className="garment-name">{product.name}</h1>

            {/* Selected Color Display */}
            {selectedColor && (
              <p className="selected-color">
                Color: <span className="color-name">{selectedColor}</span>
              </p>
            )}

            <span className="product-price">${product.price}</span>
            <p className="product-description">{product.description}</p>

          {/* Color Buttons */}
          {colorsArray.length > 0 && (
            <div className="colors">
              {colorsArray.map(color => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color ? "✓" : ""}
                </button>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector-row">
            <strong className="selector-label">Quantity:</strong>
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
          <button className="add-to-cart-btn">Add to Cart</button>
          
        </div>

      </div>
    </main>
  );
}
