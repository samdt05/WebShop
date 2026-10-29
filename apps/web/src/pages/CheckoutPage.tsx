import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { formatPrice } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { api } from "../services/api";

interface LayoutContext { notify: (message: string) => void }

export function CheckoutPage() {
  const { items, total, cartId, refresh } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();
  const { notify } = useOutletContext<LayoutContext>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const result = await api.checkout({
        cartId,
        customerName: String(form.get("customerName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? "")
      });
      setOrderId(result.orderId);
      await refresh();
      notify("Đơn hàng demo đã được ghi nhận.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể hoàn tất đơn hàng.");
    } finally {
      setBusy(false);
    }
  }

  if (orderId) return <div className="empty-state page-empty"><span>✓</span><p className="eyebrow">ĐẶT HÀNG THÀNH CÔNG</p><h1>Cảm ơn bạn đã ghé Mộc Nhiên</h1><p>Mã đơn demo: <strong>{orderId.slice(0, 8).toUpperCase()}</strong>. Không có khoản thanh toán nào được thực hiện.</p><Link className="button button-dark" to="/san-pham">Tiếp tục khám phá</Link></div>;
  if (items.length === 0) return <div className="empty-state page-empty"><span>♡</span><h1>Chưa có sản phẩm để đặt hàng</h1><Link className="button button-dark" to="/san-pham">Đến cửa hàng</Link></div>;

  return (
    <section className="checkout-page">
      <div className="page-intro"><div><p className="eyebrow">CHỈ CÒN MỘT BƯỚC</p><h1>Thông tin đặt hàng</h1></div><button className="text-link back-button" onClick={() => navigate("/gio-hang")}>← Quay lại giỏ hàng</button></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(event) => void submit(event)}>
          <p className="eyebrow">THÔNG TIN NHẬN HÀNG</p>
          <label>Họ và tên<input name="customerName" autoComplete="name" minLength={2} maxLength={100} required placeholder="Nguyễn An" /></label>
          <label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" required minLength={8} maxLength={20} pattern=".{8,20}" placeholder="090 000 0000" /></label>
          <label>Địa chỉ nhận hàng<textarea name="address" autoComplete="street-address" minLength={8} maxLength={300} required rows={3} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" /></label>
          {error && <div className="notice notice-error">{error}</div>}
          <button className="button button-dark button-full" type="submit" disabled={busy}>{busy ? "Đang ghi nhận…" : "Xác nhận đơn hàng demo"}</button>
          <p className="form-note">Đây là đơn hàng minh họa. Không thu thập thanh toán, không gửi đơn đến đơn vị vận chuyển.</p>
        </form>
        <aside className="order-summary checkout-summary"><p className="eyebrow">ĐƠN HÀNG CỦA BẠN</p>
          {items.map((item) => <div className="checkout-line" key={item.product.id}><span>{item.product.name} <small>× {item.quantity}</small></span><strong>{formatPrice(item.lineTotal)}</strong></div>)}
          <div className="summary-total"><span>Tổng cộng</span><strong>{formatPrice(total)}</strong></div><small>Thanh toán chưa được tích hợp.</small>
        </aside>
      </div>
    </section>
  );
}
