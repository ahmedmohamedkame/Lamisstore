import { useMemo, useState } from "react";
import { ShoppingCart, Heart, Search, BookOpen, UserCircle2, Trash2, Plus, Minus, LayoutDashboard, Package, ClipboardList, Settings, LogOut, Edit, X } from "lucide-react";

const initialProducts = [
  { id: 1, title: "قصص الأطفال المصورة", category: "قصص", price: 75, stock: 12, image: "📚", description: "مجموعة قصص ممتعة ومناسبة للأطفال لتنمية الخيال وحب القراءة.", featured: true },
  { id: 2, title: "حروف وأرقام", category: "تعليمي", price: 60, stock: 9, image: "🔤", description: "كتاب مبسط لتعليم الحروف العربية والأرقام بطريقة جذابة.", featured: true },
  { id: 3, title: "مغامرات لميس الصغيرة", category: "روايات أطفال", price: 90, stock: 7, image: "🌈", description: "قصة شيقة مليانة مغامرات وقيم جميلة للأطفال.", featured: false },
  { id: 4, title: "ألواني الجميلة", category: "تلوين", price: 50, stock: 15, image: "🎨", description: "كتاب تلوين ممتع يساعد الطفل على الإبداع والتركيز.", featured: true },
  { id: 5, title: "تعلم الإنجليزية للأطفال", category: "تعليمي", price: 110, stock: 6, image: "🇬🇧", description: "كتاب تأسيسي مبسط لتعليم الكلمات الأساسية للأطفال.", featured: false },
  { id: 6, title: "حكايات قبل النوم", category: "قصص", price: 85, stock: 10, image: "🌙", description: "مجموعة حكايات هادئة وجميلة قبل النوم للأطفال.", featured: true },
];

const initialOrders = [
  { id: "ORD-1001", customer: "سارة محمد", phone: "01001234567", total: 150, status: "جديد", items: 2 },
  { id: "ORD-1002", customer: "منى أحمد", phone: "01009876543", total: 90, status: "تم التأكيد", items: 1 },
  { id: "ORD-1003", customer: "ريم خالد", phone: "01112223334", total: 220, status: "قيد الشحن", items: 3 },
];

const categories = ["الكل", "قصص", "تعليمي", "روايات أطفال", "تلوين"];

function formatPrice(price) {
  return `${price} جنيه`;
}

export default function App() {
  const [mode, setMode] = useState("store");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showCart, setShowCart] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: "admin", password: "1234" });
  const [newProduct, setNewProduct] = useState({ title: "", category: "قصص", price: "", stock: "", image: "📘", description: "" });
  const [editingId, setEditingId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
      const q = search.trim();
      const matchesSearch = !q || product.title.includes(q) || product.description.includes(q) || product.category.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const featuredProducts = products.filter((p) => p.featured);
  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...product, quantity: item.quantity };
  });
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(productId) {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === productId);
      if (exists) return prev.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: productId, quantity: 1 }];
    });
  }

  function updateCartQuantity(productId, change) {
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0));
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function toggleFavorite(productId) {
    setFavorites((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    if (adminForm.username === "admin" && adminForm.password === "1234") setAdminLoggedIn(true);
    else alert("بيانات الدخول غير صحيحة. جرب admin / 1234");
  }

  function resetProductForm() {
    setNewProduct({ title: "", category: "قصص", price: "", stock: "", image: "📘", description: "" });
    setEditingId(null);
  }

  function handleAddOrUpdateProduct(e) {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.stock || !newProduct.description) return;

    const prepared = {
      id: editingId ?? Date.now(),
      title: newProduct.title,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      image: newProduct.image || "📘",
      description: newProduct.description,
      featured: false,
    };

    if (editingId) setProducts((prev) => prev.map((item) => item.id === editingId ? { ...item, ...prepared } : item));
    else setProducts((prev) => [prepared, ...prev]);

    resetProductForm();
  }

  function handleEditProduct(product) {
    setEditingId(product.id);
    setNewProduct({
      title: product.title,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    });
  }

  function handleDeleteProduct(id) {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  }

  function updateOrderStatus(orderId, status) {
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status } : order));
  }

  function StatCard({ icon, label, value }) {
    return (
      <div className="card stat-card">
        <div className="stat-head">
          <div className="brand-text">{icon}</div>
          <span className="muted small">{label}</span>
        </div>
        <div className="stat-value">{value}</div>
      </div>
    );
  }

  if (mode === "admin") {
    return (
      <div className="page admin-page" dir="rtl">
        <header className="topbar solid">
          <div>
            <h1 className="brand">لوحة تحكم لميس ستور</h1>
            <p className="muted small">إدارة المنتجات والطلبات والمكتبة</p>
          </div>
          <div className="row gap">
            <button onClick={() => setMode("store")} className="btn btn-light">عرض المتجر</button>
            {adminLoggedIn && (
              <button onClick={() => setAdminLoggedIn(false)} className="btn btn-dark"><LogOut size={16} /> تسجيل خروج</button>
            )}
          </div>
        </header>

        {!adminLoggedIn ? (
          <div className="center-box">
            <div className="card login-card">
              <div className="center">
                <div className="avatar-badge"><UserCircle2 className="brand-text" /></div>
                <h2>دخول الأدمن</h2>
                <p className="muted small">اسم المستخدم: admin - كلمة المرور: 1234</p>
              </div>
              <form onSubmit={handleAdminLogin} className="stack">
                <input value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} className="input" placeholder="اسم المستخدم" />
                <input type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="input" placeholder="كلمة المرور" />
                <button className="btn btn-primary full">دخول</button>
              </form>
            </div>
          </div>
        ) : (
          <main className="container">
            <div className="grid stats">
              <StatCard icon={<Package />} label="عدد المنتجات" value={products.length} />
              <StatCard icon={<ClipboardList />} label="عدد الطلبات" value={orders.length} />
              <StatCard icon={<ShoppingCart />} label="عناصر في السلة" value={cartCount} />
              <StatCard icon={<Heart />} label="المفضلة" value={favorites.length} />
            </div>

            <div className="grid admin-grid">
              <section className="card section">
                <div className="section-title"><Settings className="brand-text" /> <h3>{editingId ? "تعديل كتاب" : "إضافة كتاب جديد"}</h3></div>
                <form onSubmit={handleAddOrUpdateProduct} className="stack">
                  <input value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="input" placeholder="اسم الكتاب" />
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="input">
                    {categories.filter((c) => c !== "الكل").map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                  <div className="grid two">
                    <input value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="input" placeholder="السعر" />
                    <input value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="input" placeholder="المخزون" />
                  </div>
                  <input value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="input" placeholder="إيموجي أو رمز للكتاب" />
                  <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="input textarea" placeholder="وصف الكتاب" />
                  <div className="row gap">
                    <button className="btn btn-primary grow">{editingId ? "حفظ التعديلات" : "إضافة المنتج"}</button>
                    {editingId && <button type="button" onClick={resetProductForm} className="btn btn-light">إلغاء</button>}
                  </div>
                </form>
              </section>

              <section className="stack big-gap">
                <div className="card section">
                  <div className="section-title"><LayoutDashboard className="brand-text" /> <h3>إدارة المنتجات</h3></div>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr><th>المنتج</th><th>القسم</th><th>السعر</th><th>المخزون</th><th>إجراءات</th></tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-row">
                                <div className="emoji-box">{product.image}</div>
                                <div>
                                  <div className="bold">{product.title}</div>
                                  <div className="muted xsmall">{product.description}</div>
                                </div>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td>{formatPrice(product.price)}</td>
                            <td>{product.stock}</td>
                            <td>
                              <div className="row gap">
                                <button onClick={() => handleEditProduct(product)} className="icon-btn"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="icon-btn danger"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card section">
                  <div className="section-title"><ClipboardList className="brand-text" /> <h3>إدارة الطلبات</h3></div>
                  <div className="stack">
                    {orders.map((order) => (
                      <div key={order.id} className="order-box">
                        <div className="order-grid">
                          <div>
                            <div className="bold">{order.id}</div>
                            <div className="muted small">{order.customer} - {order.phone}</div>
                          </div>
                          <div className="small">عدد المنتجات: {order.items}</div>
                          <div className="bold">الإجمالي: {formatPrice(order.total)}</div>
                          <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="input compact">
                            <option>جديد</option>
                            <option>تم التأكيد</option>
                            <option>قيد الشحن</option>
                            <option>تم التسليم</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="page store-page" dir="rtl">
      <header className="topbar">
        <div>
          <h1 className="brand">لميس ستور</h1>
          <p className="muted small">متجر متكامل لبيع كتب وقصص الأطفال أونلاين</p>
        </div>

        <div className="search-box desktop-only">
          <Search className="search-icon" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" placeholder="ابحثي عن كتاب أو قسم..." />
        </div>

        <div className="row gap">
          <button onClick={() => setMode("admin")} className="btn btn-light">دخول الأدمن</button>
          <button onClick={() => setShowCart(true)} className="btn btn-primary cart-btn">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <section className="hero container">
        <div>
          <span className="pill">مكتبة أونلاين كاملة</span>
          <h2 className="hero-title">خلي كتب الأطفال أقرب لكل بيت مع <span className="brand-text">لميس ستور</span></h2>
          <p className="hero-text">متجر إلكتروني متكامل فيه عرض كتب، سلة شراء، مفضلة، بحث، ولوحة تحكم للأدمن لإدارة المنتجات والطلبات.</p>
          <div className="row gap wrap">
            <a href="#products" className="btn btn-primary">ابدئي التسوق</a>
            <button onClick={() => setMode("admin")} className="btn btn-light">لوحة التحكم</button>
          </div>
        </div>

        <div className="card feature-grid">
          <div className="mini-card pink"><div className="emoji">🛒</div><h3>سلة شراء</h3><p>إضافة وتعديل الكميات</p></div>
          <div className="mini-card purple"><div className="emoji">🔐</div><h3>دخول أدمن</h3><p>إدارة كاملة للمتجر</p></div>
          <div className="mini-card rose"><div className="emoji">📦</div><h3>إدارة الطلبات</h3><p>متابعة حالة كل طلب</p></div>
          <div className="mini-card yellow"><div className="emoji">📚</div><h3>إدارة الكتب</h3><p>إضافة وحذف وتعديل</p></div>
        </div>
      </section>

      <section className="container categories">
        <div className="row gap wrap center">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`chip ${selectedCategory === category ? "active" : ""}`}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="container">
        <h3 className="section-heading">مختارات مميزة</h3>
        <div className="grid featured-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card feature-item">
              <div className="big-emoji">{product.image}</div>
              <h4>{product.title}</h4>
              <p className="muted small">{product.category}</p>
              <div className="price">{formatPrice(product.price)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="container section-space">
        <div className="products-head">
          <h3 className="section-heading">كل الكتب</h3>
          <div className="search-box mobile-only">
            <Search className="search-icon" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" placeholder="ابحثي..." />
          </div>
        </div>

        <div className="grid products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card product-card">
              <div className="product-image">
                {product.image}
                <button onClick={() => toggleFavorite(product.id)} className="fav-btn">
                  <Heart size={18} className={favorites.includes(product.id) ? "fav active-fav" : "fav"} />
                </button>
              </div>
              <div className="product-body">
                <div className="row between">
                  <span className="tag">{product.category}</span>
                  <span className="price">{formatPrice(product.price)}</span>
                </div>
                <h4>{product.title}</h4>
                <p className="muted small line">{product.description}</p>
                <div className="muted xsmall">المتوفر في المخزون: {product.stock}</div>
                <div className="row gap top-gap">
                  <button onClick={() => addToCart(product.id)} className="btn btn-primary grow">أضيفي للسلة</button>
                  <button className="btn btn-icon"><BookOpen size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-space">
        <div className="grid benefits-grid">
          <div className="card benefit"><div className="emoji">🚚</div><h4>شحن سريع</h4><p className="muted small">استلام الطلبات في أسرع وقت ممكن داخل مصر.</p></div>
          <div className="card benefit"><div className="emoji">💳</div><h4>طرق دفع متعددة</h4><p className="muted small">عند الاستلام أو تحويل أو دفع إلكتروني لاحقًا.</p></div>
          <div className="card benefit"><div className="emoji">📞</div><h4>خدمة عملاء</h4><p className="muted small">سهولة في التواصل والرد على الاستفسارات والطلبات.</p></div>
        </div>
      </section>

      {showCart && (
        <div className="overlay">
          <div className="cart-panel">
            <div className="row between">
              <h3>سلة الشراء</h3>
              <button onClick={() => setShowCart(false)} className="icon-btn"><X size={18} /></button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty">السلة فارغة حاليًا</div>
            ) : (
              <div className="stack">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-box">
                    <div className="row between start">
                      <div className="product-row">
                        <div className="emoji-box">{item.image}</div>
                        <div>
                          <div className="bold">{item.title}</div>
                          <div className="muted small">{formatPrice(item.price)}</div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="danger-text"><Trash2 size={18} /></button>
                    </div>
                    <div className="row between top-gap">
                      <div className="row gap">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="icon-btn"><Minus size={16} /></button>
                        <span className="qty">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="icon-btn"><Plus size={16} /></button>
                      </div>
                      <div className="price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}

                <div className="summary">
                  <div className="row between bold"><span>الإجمالي</span><span>{formatPrice(cartTotal)}</span></div>
                  <button className="btn btn-primary full">إتمام الطلب</button>
                  <button className="btn btn-light full">متابعة التسوق</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="footer">© 2026 لميس ستور - جميع الحقوق محفوظة</footer>
    </div>
  );
}
