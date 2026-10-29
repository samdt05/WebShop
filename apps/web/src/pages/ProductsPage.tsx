import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { api } from "../services/api";
import type { Category, Product } from "../types/store";

interface LayoutContext { notify: (message: string) => void }

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") ?? "";
  const query = params.get("q") ?? "";
  const { add } = useCart();
  const { notify } = useOutletContext<LayoutContext>();
  const selectedCategory = categories.find((item) => item.slug === category);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.products(new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}) }).toString()),
      api.categories()
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData.products);
        setCategories(categoryData.categories);
        setError("");
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Không tải được sản phẩm."))
      .finally(() => setLoading(false));
  }, [category, query]);

  async function addProduct(product: Product) {
    try {
      await add(product);
      notify(`${product.name} đã được thêm vào giỏ.`);
    } catch (reason) {
      notify(reason instanceof Error ? reason.message : "Không thể thêm sản phẩm vào giỏ.");
    }
  }

  return (
    <section className="catalog-page">
      <div className="page-intro">
        <div><p className="eyebrow">CỬA HÀNG MỘC NHIÊN</p><h1>{selectedCategory?.name ?? (query ? "Kết quả tìm kiếm" : "Tất cả sản phẩm")}</h1>
          <p>{query ? `Những món đồ phù hợp với “${query}”.` : "Những món đồ giản dị cho nhịp sống an yên."}</p></div>
        <span className="page-intro-count">{products.length} sản phẩm</span>
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <h2>Danh mục</h2>
          <Link className={!category ? "filter-active" : ""} to="/san-pham">Tất cả sản phẩm</Link>
          {categories.map((item) => <Link className={category === item.slug ? "filter-active" : ""} to={`/san-pham?category=${item.slug}`} key={item.id}>{item.name}<span>{item.product_count}</span></Link>)}
          {(query || category) && <Link className="clear-filter" to="/san-pham">Xóa bộ lọc ×</Link>}
        </aside>
        <div className="catalog-results">
          {error && <div className="notice notice-error">{error}</div>}
          {loading ? <div className="loading-panel">Đang tìm sản phẩm…</div> : products.length === 0 ? (
            <div className="empty-state"><span>⌕</span><h2>Chưa tìm thấy món phù hợp</h2><p>Thử từ khóa khác hoặc xem toàn bộ bộ sưu tập nhé.</p><Link className="button button-dark" to="/san-pham">Xem tất cả sản phẩm</Link></div>
          ) : <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={addProduct} />)}</div>}
        </div>
      </div>
    </section>
  );
}
