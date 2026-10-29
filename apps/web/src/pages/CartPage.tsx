import { Link, useOutletContext } from "react-router-dom";
import { formatPrice, ProductImage } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";

interface LayoutContext { notify: (message: string) => void }

export function CartPage() {
  const { items, total, loading, error, setQuantity, remove, dismissError } = useCart();
  const { notify } = useOutletContext<LayoutContext>();
  if (loading) return <div className="loading-panel page-empty">Đang tải giỏ hàng…</div>;
  return (
    <section className="cart-page">
      <div className="page-intro"><div><p className="eyebrow">MÓN BẠN ĐÃ CHỌN</p><h1>Giỏ hàng</h1></div><Link className="text-link" to="/san-pham">← Tiếp tục mua sắm</Link></div>
      {error && <div className="notice notice-error">{error}<button onClick={dismissError} aria-label="Đóng">×</button></div>}
      {items.length === 0 ? <div className="empty-state"><span>♡</span><h2>Giỏ hàng đang trống</h2><p>Chọn một món đồ nhỏ để bắt đầu nhé.</p><Link className="button button-dark" to="/san-pham">Khám phá sản phẩm</Link></div> : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, quantity, lineTotal }) => (
              <article className="cart-item" key={product.id}>
                <Link to={`/san-pham/${product.slug}`} className="cart-item-image"><ProductImage src={product.image} alt={product.name} /></Link>
                <div className="cart-item-info"><p className="eyebrow">{product.category_name}</p><Link to={`/san-pham/${product.slug}`}><h2>{product.name}</h2></Link><span>{formatPrice(product.price)}</span>
                  <button className="remove-link" onClick={() => { void remove(product.id).then(() => notify("Đã xóa sản phẩm khỏi giỏ.")).catch((reason: unknown) => notify(reason instanceof Error ? reason.message : "Không thể xóa sản phẩm.")); }}>Xóa</button></div>
                  <div className="cart-item-actions"><div className="quantity-control"><button onClick={() => void setQuantity(product.id, quantity - 1).catch(() => undefined)} aria-label="Giảm số lượng">−</button><span>{quantity}</span><button onClick={() => void setQuantity(product.id, quantity + 1).catch(() => undefined)} aria-label="Tăng số lượng" disabled={quantity >= product.stock}>+</button></div><strong>{formatPrice(lineTotal)}</strong></div>
              </article>
            ))}
          </div>
          <aside className="order-summary"><p className="eyebrow">TÓM TẮT ĐƠN HÀNG</p><div><span>Tạm tính</span><strong>{formatPrice(total)}</strong></div><div><span>Phí giao hàng</span><span>Tính sau</span></div><div className="summary-total"><span>Tổng cộng</span><strong>{formatPrice(total)}</strong></div><p>Phí giao hàng sẽ được xác nhận trong demo.</p><Link className="button button-dark button-full" to="/dat-hang">Tiến hành đặt hàng <span>↗</span></Link><small>Chưa phát sinh thanh toán thật.</small></aside>
        </div>
      )}
    </section>
  );
}
