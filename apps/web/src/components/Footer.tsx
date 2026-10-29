import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand brand-light" to="/"><span className="brand-mark">m</span><span>MỘC NHIÊN<small>ĐỒ DÙNG SỐNG LÀNH</small></span></Link>
          <p>Chọn điều giản dị. Sống một ngày thật lành.</p>
        </div>
        <div><h3>Khám phá</h3><Link to="/san-pham">Tất cả sản phẩm</Link><Link to="/san-pham?category=qua-tang">Quà tặng</Link></div>
        <div><h3>Hỗ trợ</h3><a href="mailto:hello@mocnhien.demo">hello@mocnhien.demo</a><p>Thứ 2 – Thứ 7, 9:00 – 17:00</p></div>
        <div className="footer-note"><span>Đồ án cửa hàng minh họa</span><p>Website demo, chưa nhận thanh toán và chưa xử lý vận chuyển thực tế.</p></div>
      </div>
      <div className="copyright">© 2026 Mộc Nhiên · Sản phẩm và nội dung được tạo riêng cho bản demo.</div>
    </footer>
  );
}
