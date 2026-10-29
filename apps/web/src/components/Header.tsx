import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export function Header() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(query.trim() ? `/san-pham?q=${encodeURIComponent(query.trim())}` : "/san-pham");
    setSearchOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Mộc Nhiên - Trang chủ">
          <span className="brand-mark">m</span>
          <span>MỘC NHIÊN<small>ĐỒ DÙNG SỐNG LÀNH</small></span>
        </Link>
        <form className={`search-form${searchOpen ? " search-open" : ""}`} onSubmit={search}>
          <span aria-hidden="true">⌕</span>
          <input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món đồ bạn cần..." aria-label="Tìm sản phẩm" />
          <button type="submit">Tìm kiếm</button>
        </form>
        <button className="mobile-search-toggle" onClick={() => setSearchOpen((open) => !open)} aria-label={searchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"} aria-expanded={searchOpen}>⌕</button>
        <Link className="cart-link" to="/gio-hang" aria-label={`Giỏ hàng, ${count} sản phẩm`}>
          <svg className="cart-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.2" fill="currentColor" />
            <circle cx="18" cy="20" r="1.2" fill="currentColor" />
          </svg>
          <span className="cart-label">Giỏ hàng</span><b>{count}</b>
        </Link>
      </div>
      <nav className="main-nav" aria-label="Điều hướng chính">
        <div className="nav-inner">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/san-pham">Tất cả sản phẩm</NavLink>
          <NavLink to="/san-pham?category=nha-cua">Nhà cửa</NavLink>
          <NavLink to="/san-pham?category=song-xanh">Sống xanh</NavLink>
          <NavLink to="/san-pham?category=van-phong-pham">Văn phòng phẩm</NavLink>
          <NavLink to="/san-pham?category=qua-tang">Quà tặng</NavLink>
        </div>
      </nav>
    </header>
  );
}
