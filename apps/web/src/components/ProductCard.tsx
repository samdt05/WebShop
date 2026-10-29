import { Link } from "react-router-dom";
import type { Product } from "../types/store";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      className="product-image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = "/images/placeholder.svg";
      }}
    />
  );
}

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <article className="product-card">
      <Link to={`/san-pham/${product.slug}`} className="product-card-image" aria-label={`Xem ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} />
        {product.original_price && <span className="product-badge">Ưu đãi</span>}
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.category_name}</p>
        <Link to={`/san-pham/${product.slug}`} className="product-name">{product.name}</Link>
        <p className="product-description">{product.short_description}</p>
        <div className="product-card-bottom">
          <div className="price-stack">
            <strong>{formatPrice(product.price)}</strong>
            {product.original_price && <del>{formatPrice(product.original_price)}</del>}
          </div>
          <button className="icon-button add-button" onClick={() => onAdd(product)} aria-label={`Thêm ${product.name} vào giỏ hàng`}>
            +
          </button>
        </div>
      </div>
    </article>
  );
}
