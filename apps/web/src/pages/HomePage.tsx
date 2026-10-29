import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { api } from "../services/api";
import type { Category, Product } from "../types/store";

interface LayoutContext { notify: (message: string) => void }

const categoryArt: Record<string, string> = {
  "nha-cua": "⌂",
  "song-xanh": "♧",
  "van-phong-pham": "✎",
  "qua-tang": "✿"
};

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const { add } = useCart();
  const { notify } = useOutletContext<LayoutContext>();

  useEffect(() => {
    Promise.all([api.products("featured=true"), api.categories()])
      .then(([productData, categoryData]) => {
        setProducts(productData.products);
        setCategories(categoryData.categories);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Không tải được dữ liệu."));
  }, []);

  async function addProduct(product: Product) {
    try {
      await add(product);
      notify(`${product.name} đã được thêm vào giỏ.`);
    } catch (reason) {
      notify(reason instanceof Error ? reason.message : "Không thể thêm sản phẩm vào giỏ.");
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">MÓN ĐỒ NHỎ, NIỀM VUI LÂU</p>
          <h1>Sống chậm,<br /><em>chọn điều lành.</em></h1>
          <p className="hero-intro">Những món đồ hữu ích, được chọn bằng sự dịu dàng — để mỗi ngày ở nhà đều thêm một chút an yên.</p>
          <Link className="button button-dark" to="/san-pham">Khám phá bộ sưu tập <span>↗</span></Link>
          <div className="hero-proof"><span>✳</span> Thiết kế có chủ đích <i /> Gói ghém đầy yêu thương</div>
        </div>
        <div className="hero-art" aria-label="Minh họa góc nhà ấm áp">
          <div className="sun-disc" />
          <div className="arch arch-one" />
          <div className="arch arch-two" />
          <div className="hero-vase"><i /><b /></div>
          <div className="hero-leaf leaf-one" /><div className="hero-leaf leaf-two" /><div className="hero-leaf leaf-three" />
          <div className="hero-book" />
          <span className="art-caption">một nhịp sống<br />dịu dàng</span>
        </div>
      </section>

      <section className="section category-section">
        <div className="section-heading">
          <div><p className="eyebrow">GÓC NHỎ CỦA BẠN</p><h2>Chọn theo cảm hứng</h2></div>
          <Link className="text-link" to="/san-pham">Xem tất cả <span>↗</span></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link to={`/san-pham?category=${category.slug}`} className={`category-tile category-tone-${index + 1}`} key={category.id}>
              <span className="category-symbol">{categoryArt[category.slug] ?? "✳"}</span>
              <span><strong>{category.name}</strong><small>{category.product_count} món đồ</small></span>
              <span className="category-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading">
          <div><p className="eyebrow">ĐƯỢC YÊU THÍCH</p><h2>Món nhỏ được chọn nhiều</h2></div>
          <Link className="text-link" to="/san-pham">Khám phá cửa hàng <span>↗</span></Link>
        </div>
        {error ? <div className="notice notice-error">{error}</div> : products.length === 0 ? <div className="loading-panel">Đang tải những món đồ xinh xắn…</div> : (
          <div className="product-grid">
            {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAdd={addProduct} />)}
          </div>
        )}
      </section>

      <section className="story-banner">
        <div className="story-seal">MN<br /><span>TỪ NĂM 2026</span></div>
        <div><p className="eyebrow">SỐNG LÀNH TỪ ĐIỀU NHỎ</p><h2>Không cần nhiều hơn.<br /><em>Chỉ cần vừa đủ.</em></h2></div>
        <p>Mỗi món đồ trong cửa hàng là một lời nhắc dịu dàng: hãy dành thời gian cho những điều khiến mình thấy bình yên.</p>
        <Link className="button button-outline" to="/san-pham">Tìm món đồ của bạn <span>↗</span></Link>
      </section>
    </>
  );
}
