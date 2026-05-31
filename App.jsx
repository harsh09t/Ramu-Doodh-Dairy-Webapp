

// ── FIREBASE SETUP ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAxadt7Kl7pwzfgcEm6G98jvF3Ki-AB34o",
  authDomain: "dairy-manager-6d898.firebaseapp.com",
  projectId: "dairy-manager-6d898",
  storageBucket: "dairy-manager-6d898.firebasestorage.app",
  messagingSenderId: "651048776070",
  appId: "1:651048776070:web:0ca12c6bdff39e2f303c07"
};

// ... iske neeche ka tera poora code 100% same rahega, kuch mat badalna!

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function load(key, def = []) {
  try {
    const snap = await getDoc(doc(db, "dairy", key));
    if (snap.exists()) return snap.data().value ?? def;
    return def;
  } catch { return def; }
}

async function save(key, data) {
  try {
    await setDoc(doc(db, "dairy", key), { value: data });
  } catch (e) { console.error("Save error:", e); }
}

// ── CONSTANTS ───────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "milk",   label: "Milk",   icon: "🥛", unit: "L",  color: "#4a90d9", bg: "#f0f6ff" },
  { id: "dahi",   label: "Dahi",   icon: "🥣", unit: "Kg", color: "#c47d3a", bg: "#fff8ee" },
  { id: "paneer", label: "Paneer", icon: "🧀", unit: "Kg", color: "#8e44ad", bg: "#f8f0ff" },
  { id: "mahi",   label: "Mahi",   icon: "🫙", unit: "L",  color: "#3a7d44", bg: "#f0fbf3" },
];

const TABS = [
  { id: "home",    label: "Home",     icon: "🏠" },
  { id: "quick",   label: "Quick",    icon: "⚡" },
  { id: "stockin", label: "Stock In", icon: "⬇️" },
  { id: "sales",   label: "Sales",    icon: "🛒" },
  { id: "reports", label: "Reports",  icon: "📊" },
];

const REPORT_TABS = ["Summary", "Customers", "Expenses", "Settings"];

const getP     = id => PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate  = d  => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtCur   = n  => "₹" + parseFloat(n || 0).toFixed(0);
const fmtQty   = (q, u) => `${parseFloat(q).toFixed(1)} ${u}`;
const monthOf  = d  => d?.slice(0, 7);
const nowMonth = () => todayStr().slice(0, 7);

// ── UI ATOMS ────────────────────────────────────────────────────────
function Lbl({ children }) {
  return <div style={{ fontSize: 11, color: "#6b7c93", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{children}</div>;
}
function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: 18, padding: "15px", marginBottom: 12, boxShadow: "0 2px 16px rgba(74,144,217,0.07)", border: "1px solid #e8f0fb", ...style }}>{children}</div>;
}
function SecTitle({ children, color = "#4a90d9" }) {
  return <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 12 }}>{children}</div>;
}
function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Lbl>{label}</Lbl>}
      <input {...props} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #dce4ef", fontSize: 15, background: "#f8fbff", color: "#1a2a3a", fontFamily: "inherit", outline: "none", ...(props.style || {}) }} />
    </div>
  );
}
function Btn({ children, onClick, color = "#4a90d9", style = {}, small }) {
  return (
    <button onClick={onClick} style={{ background: color, color: "#fff", border: "none", borderRadius: small ? 8 : 14, padding: small ? "6px 12px" : "14px", fontSize: small ? 12 : 15, fontWeight: 700, cursor: "pointer", width: small ? "auto" : "100%", fontFamily: "inherit", ...style }}>{children}</button>
  );
}
function StatBox({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "12px 8px", textAlign: "center", border: `1.5px solid ${color}22` }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color, marginTop: 3 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#7a90aa", marginTop: 2, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
function ProductPicker({ value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Lbl>Product</Lbl>
      <div style={{ display: "flex", gap: 7 }}>
        {PRODUCTS.map(p => (
          <button key={p.id} onClick={() => onChange(p.id)} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "2px solid", borderColor: value === p.id ? p.color : "#dce4ef", background: value === p.id ? p.bg : "#f8fbff", color: value === p.id ? p.color : "#9aafcc", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{p.icon}</span><span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9aafcc" }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 34px", borderRadius: 12, border: "1.5px solid #dce4ef", fontSize: 14, background: "#f8fbff", color: "#1a2a3a", fontFamily: "inherit", outline: "none" }} />
      {value && <span onClick={() => onChange("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#9aafcc", fontSize: 16 }}>✕</span>}
    </div>
  );
}

function EditModal({ entry, type, onSave, onClose }) {
  const p = getP(entry.product || "milk");
  const [form, setForm] = useState({ ...entry });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "20px 16px 32px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a2a3a" }}>✏️ Edit Entry</div>
          <button onClick={onClose} style={{ background: "#f0f4fa", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <Input label="Date" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
        <Input label={type === "stockin" ? "Supplier" : "Customer"} value={form[type === "stockin" ? "supplier" : "customer"] || ""} onChange={e => set(type === "stockin" ? "supplier" : "customer", e.target.value)} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Input label={`Qty (${p.unit})`} type="number" value={form.qty} onChange={e => set("qty", parseFloat(e.target.value) || 0)} /></div>
          <div style={{ flex: 1 }}><Input label={`Rate ₹/${p.unit}`} type="number" value={form.rate} onChange={e => set("rate", parseFloat(e.target.value) || 0)} /></div>
        </div>
        <Input label="Notes (optional)" placeholder="Any remarks…" value={form.notes || ""} onChange={e => set("notes", e.target.value)} />
        <Btn onClick={() => onSave(form)} color="#4a90d9">Save Changes</Btn>
      </div>
    </div>
  );
}

function EntryCard({ e, type, onDelete, onEdit, onMarkPaid }) {
  const pr = getP(e.product);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ background: pr.bg, color: pr.color, borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{pr.icon} {pr.label}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2a3a" }}>{type === "stockin" ? e.supplier : e.customer}</div>
          <div style={{ fontSize: 11, color: "#7a90aa", marginTop: 2 }}>{fmtDate(e.date)} · {fmtQty(e.qty, pr.unit)} @ {fmtCur(e.rate)}/{pr.unit}</div>
          {type === "sales" && <div style={{ fontSize: 15, fontWeight: 800, color: e.paid ? "#3a7d44" : "#e53935", marginTop: 3 }}>{fmtCur(e.qty * e.rate)} <span style={{ fontSize: 11, fontWeight: 500 }}>{e.paid ? "✓ Paid" : "⏳ Due"}</span></div>}
          {e.notes && <div style={{ fontSize: 11, color: "#8a9ab0", marginTop: 3, fontStyle: "italic" }}>📝 {e.notes}</div>}
        </div>
        <div style={{ display: "flex", gap: 5, marginLeft: 8, flexDirection: "column", alignItems: "flex-end" }}>
          {type === "sales" && !e.paid && <Btn onClick={() => onMarkPaid(e.id)} color="#3a7d44" small>✓ Paid</Btn>}
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => onEdit(e)} style={{ background: "#f0f6ff", border: "none", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13 }}>✏️</button>
            <button onClick={() => onDelete(e.id)} style={{ background: "#fff0ee", border: "none", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── ⚡ QUICK TAB ─────────────────────────────────────────────────────
function QuickTab({ sales, setSales, dailyCustomers, setDailyCustomers }) {
  const [activeCard, setActiveCard] = useState(null);
  const [qty, setQty] = useState("");
  const [paid, setPaid] = useState(true);
  const [flash, setFlash] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProduct, setNewProduct] = useState("milk");
  const [newRate, setNewRate] = useState("");
  const [newPaidDefault, setNewPaidDefault] = useState(true);

  async function saveDC(updated) { setDailyCustomers(updated); await save("dairy-daily-customers", updated); }

  async function addDailyCustomer() {
    if (!newName.trim() || !newRate) return;
    await saveDC([...dailyCustomers, { name: newName.trim(), product: newProduct, rate: parseFloat(newRate), paidDefault: newPaidDefault }]);
    setNewName(""); setNewRate(""); setShowAdd(false);
  }

  async function removeCustomer(idx) {
    await saveDC(dailyCustomers.filter((_, i) => i !== idx));
    if (activeCard === idx) setActiveCard(null);
  }

  async function submitQuickSale() {
    if (activeCard === null || !qty) return;
    const c = dailyCustomers[activeCard];
    const e = { id: Date.now(), product: c.product, date: todayStr(), customer: c.name, qty: parseFloat(qty), rate: c.rate, paid, notes: "" };
    const u = [e, ...sales]; setSales(u); await save("dairy-sales", u);
    setFlash(activeCard); setQty(""); setActiveCard(null);
    setTimeout(() => setFlash(null), 2000);
  }

  const todaySales = sales.filter(e => e.date === todayStr());
  const todayRev = todaySales.filter(e => e.paid).reduce((s, e) => s + e.qty * e.rate, 0);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#4a90d9,#357abd)", borderRadius: 18, padding: "14px 18px", marginBottom: 16, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 13, opacity: 0.85 }}>Today's Sales</div><div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>{fmtCur(todayRev)}</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, opacity: 0.85 }}>Entries</div><div style={{ fontSize: 24, fontWeight: 900 }}>{todaySales.length}</div></div>
      </div>

      <SecTitle>⚡ Daily Customers — One Tap Entry</SecTitle>

      {dailyCustomers.length === 0 && !showAdd && (
        <Card style={{ textAlign: "center", padding: 28 }}>
          <div style={{ fontSize: 36 }}>👥</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#4a90d9", marginTop: 8 }}>No daily customers yet!</div>
          <div style={{ color: "#7a90aa", fontSize: 13, marginTop: 4 }}>Add your regular customers below.</div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {dailyCustomers.map((c, idx) => {
          const pp = getP(c.product);
          const isActive = activeCard === idx;
          const didFlash = flash === idx;
          const alreadyDone = todaySales.some(e => e.customer === c.name && e.product === c.product);
          return (
            <button key={idx} onClick={() => { setActiveCard(isActive ? null : idx); setQty(""); setPaid(c.paidDefault ?? true); }}
              style={{ background: didFlash ? "#f0fbf3" : isActive ? pp.bg : "#fff", borderRadius: 16, padding: "14px 10px", border: `2px solid ${didFlash ? "#3a7d44" : isActive ? pp.color : "#e8f0fb"}`, cursor: "pointer", fontFamily: "inherit", textAlign: "center", position: "relative", boxShadow: isActive ? "0 4px 20px rgba(74,144,217,0.15)" : "0 2px 8px rgba(0,0,0,0.05)" }}>
              {alreadyDone && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 12 }}>✅</div>}
              <button onClick={e => { e.stopPropagation(); removeCustomer(idx); }} style={{ position: "absolute", top: 5, left: 7, background: "#fff0ee", border: "none", borderRadius: 6, padding: "2px 5px", cursor: "pointer", fontSize: 11, color: "#e53935" }}>✕</button>
              <div style={{ fontSize: 26, marginTop: 4 }}>{pp.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1a2a3a", marginTop: 4 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: pp.color, fontWeight: 700, marginTop: 2 }}>{pp.label} · {fmtCur(c.rate)}/{pp.unit}</div>
              {didFlash && <div style={{ fontSize: 11, color: "#3a7d44", fontWeight: 700, marginTop: 3 }}>✓ Saved!</div>}
            </button>
          );
        })}
      </div>

      {activeCard !== null && dailyCustomers[activeCard] && (() => {
        const c = dailyCustomers[activeCard];
        const pp = getP(c.product);
        return (
          <Card style={{ border: `2px solid ${pp.color}`, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{pp.icon}</span>
              <div><div style={{ fontSize: 16, fontWeight: 800, color: "#1a2a3a" }}>{c.name}</div><div style={{ fontSize: 12, color: pp.color, fontWeight: 600 }}>{pp.label} · {fmtCur(c.rate)}/{pp.unit}</div></div>
            </div>
            <Input label={`Quantity (${pp.unit})`} type="number" placeholder={`How much ${pp.label}?`} value={qty} onChange={e => setQty(e.target.value)} style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }} />
            {qty && !isNaN(qty) && (
              <div style={{ background: pp.bg, borderRadius: 12, padding: "10px", marginBottom: 12, textAlign: "center", border: `1px dashed ${pp.color}` }}>
                <span style={{ fontSize: 13, color: "#5a6a7a" }}>Total: </span>
                <span style={{ fontSize: 22, fontWeight: 900, color: pp.color }}>{fmtCur(parseFloat(qty) * c.rate)}</span>
              </div>
            )}
            <Lbl>Payment</Lbl>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[true, false].map(p => (
                <button key={p} onClick={() => setPaid(p)} style={{ flex: 1, padding: "10px", borderRadius: 12, fontFamily: "inherit", border: "2px solid", cursor: "pointer", fontSize: 13, fontWeight: 700, borderColor: paid === p ? (p ? "#3a7d44" : "#e53935") : "#dce4ef", background: paid === p ? (p ? "#f0fbf3" : "#fff0ee") : "#f8fbff", color: paid === p ? (p ? "#3a7d44" : "#e53935") : "#7a90aa" }}>{p ? "✅ Paid" : "📒 Credit"}</button>
              ))}
            </div>
            <Btn onClick={submitQuickSale} color={pp.color}>⚡ Save Entry</Btn>
          </Card>
        );
      })()}

      {todaySales.length > 0 && (
        <Card>
          <SecTitle>📋 Today's Entries</SecTitle>
          {[...todaySales].sort((a, b) => b.id - a.id).map(e => {
            const pp = getP(e.product);
            return (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f4fa" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2a3a" }}>{pp.icon} {e.customer}</div>
                  <div style={{ fontSize: 11, color: "#7a90aa" }}>{fmtQty(e.qty, pp.unit)} @ {fmtCur(e.rate)}/{pp.unit}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: e.paid ? "#3a7d44" : "#e53935" }}>{fmtCur(e.qty * e.rate)}</div>
                  <div style={{ fontSize: 10, color: e.paid ? "#3a7d44" : "#e53935" }}>{e.paid ? "✓ Paid" : "Due"}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "2px dashed #4a90d9", background: "#f0f6ff", color: "#4a90d9", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Daily Customer
        </button>
      ) : (
        <Card style={{ border: "2px solid #4a90d9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SecTitle>➕ New Daily Customer</SecTitle>
            <button onClick={() => setShowAdd(false)} style={{ background: "#f0f4fa", border: "none", borderRadius: 8, padding: "5px 9px", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <Input label="Customer Name" placeholder="e.g. Ramesh, Hotel Shanti…" value={newName} onChange={e => setNewName(e.target.value)} />
          <ProductPicker value={newProduct} onChange={setNewProduct} />
          <Input label={`Default Rate ₹/${getP(newProduct).unit}`} type="number" placeholder="60" value={newRate} onChange={e => setNewRate(e.target.value)} />
          <Lbl>Default Payment</Lbl>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[true, false].map(p => (
              <button key={p} onClick={() => setNewPaidDefault(p)} style={{ flex: 1, padding: "10px", borderRadius: 12, fontFamily: "inherit", border: "2px solid", cursor: "pointer", fontSize: 13, fontWeight: 700, borderColor: newPaidDefault === p ? (p ? "#3a7d44" : "#e53935") : "#dce4ef", background: newPaidDefault === p ? (p ? "#f0fbf3" : "#fff0ee") : "#f8fbff", color: newPaidDefault === p ? (p ? "#3a7d44" : "#e53935") : "#7a90aa" }}>{p ? "✅ Paid" : "📒 Credit"}</button>
            ))}
          </div>
          <Btn onClick={addDailyCustomer} color="#4a90d9">Save Customer</Btn>
        </Card>
      )}
    </div>
  );
}

// ── HOME ────────────────────────────────────────────────────────────
function HomeTab({ stockIn, sales, settings }) {
  const t = todayStr();
  const todayIn = stockIn.filter(e => e.date === t).reduce((s, e) => s + e.qty, 0);
  const todaySold = sales.filter(e => e.date === t).reduce((s, e) => s + e.qty, 0);
  const todayRev = sales.filter(e => e.date === t && e.paid).reduce((s, e) => s + e.qty * e.rate, 0);
  const totalDues = sales.filter(e => !e.paid).reduce((s, e) => s + e.qty * e.rate, 0);
  const totalEarned = sales.filter(e => e.paid).reduce((s, e) => s + e.qty * e.rate, 0);

  const stockMap = {};
  PRODUCTS.forEach(p => { stockMap[p.id] = 0; });
  stockIn.forEach(e => { stockMap[e.product] = (stockMap[e.product] || 0) + e.qty; });
  sales.forEac
// Apne App.jsx ke sabse end mein yeh line likh do taaki index.html isko pehchan sake:
window.DairyApp = DairyApp; 

// Agar aapne niche export default kiya hai, toh woh bhi rehne de sakte hain:
export default DairyApp;