import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Toast } from "../components/Toast";

export function StoreLayout() {
  const [notice, setNotice] = useState("");
  return (
    <>
      <div className="announcement">Giao hàng miễn phí cho đơn hàng từ 500.000₫ <span>·</span> Tặng một lời chúc trong mỗi hộp quà</div>
      <Header />
      <main><Outlet context={{ notify: setNotice }} /></main>
      <Footer />
      <Toast message={notice} onClose={() => setNotice("")} />
    </>
  );
}
