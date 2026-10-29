import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { formatPrice, ProductImage } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { api } from "../services/api";
import type { Product } from "../types/store";

interface LayoutContext { notify: (message: string) => void }

export function ProductPage() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { add } = useCart();
  const { notify } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setProduct(null);
    api.product(slug)
      .then((data) => { setProduct(data.product); setError(""); })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Không tải được sản phẩm."));
  }, [slug]);

  async function addProduct() {
    if (!product) return;
    try {
      await add(product, quantity);
      notify(`${product.name} đã được thêm vào giỏ.`);
    } catch (reason) {
      notify(reason instanceof Error ? reason.message : "Không thể thêm sản phẩm vào giỏ.");
    }
  }

  if (error) return <div className="empty-state page-empty"><span>✳</span><h1>Không tìm thấy sản phẩm</h1><p>{error}</p><Link className="button button-dark" to="/san-pham">Quay lại cửa hàng</Link></div>;
  if (!product) return <div className="loading-panel page-empty">Đang tải sản phẩm…</div>;
  return (
    <section className="product-detail-page">
      <div className="breadcrumbs"><Link to="/">Trang chủ</Link><span>/</span><Link to={`/san-pham?category=${product.category_slug}`}>{product.category_name}</Link><span>/</span><span>{product.name}</span></div>
      <div className="product-detail">
        <div className="detail-image-wrap"><ProductImage src={product.image} alt={product.name} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category_name} · MỘC NHIÊN STUDIO</p>
          <h1>{product.name}</h1>
          <p className="detail-lead">{product.short_description}</p>
          <div className="detail-price">{formatPrice(product.price)} {product.original_price && <del>{formatPrice(product.original_price)}</del>}</div>
          <div className="detail-rule" />
          <p className="detail-description">{product.description}</p>
          <p className="stock-status">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Tạm hết hàng"}</p>
          <div className="purchase-row">
            <div className="quantity-control">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Giảm số lượng">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} aria-label="Tăng số lượng" disabled={quantity >= product.stock}>+</button>
            </div>
            <button className="button button-dark detail-add" onClick={() => void addProduct()} disabled={product.stock < 1}>Thêm vào giỏ hàng</button>
          </div>
          <div className="detail-assurance"><span>✳</span><div><strong>Gói ghém cẩn thận</strong><small>Mỗi đơn hàng được chuẩn bị bằng sự nâng niu.</small></div></div>
          <div className="detail-assurance"><span>↺</span><div><strong>Đổi trả trong 7 ngày</strong><small>Chính sách minh họa cho website demo.</small></div></div>
        </div>
      </div>
    </section>
  );
}
