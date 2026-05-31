import { useState, useEffect } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];

const PLANS = [
  { label: "Monthly – $30", value: "monthly", fee: 30 },
  { label: "Quarterly – $80", value: "quarterly", fee: 80 },
  { label: "Annual – $280", value: "annual", fee: 280 },
];

function getPlanFee(value) {
  return PLANS.find((p) => p.value === value)?.fee ?? 0;
}

function useLocalState(key, init) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0f1117;
    --surface:  #181b25;
    --card:     #1e2230;
    --border:   #2a2f42;
    --accent:   #c8f135;
    --accent2:  #5b8df6;
    --red:      #ff5f5f;
    --green:    #4ddb8e;
    --text:     #e8ecf4;
    --muted:    #7a8299;
    --radius:   14px;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); }

  body {
    font-family: 'Barlow', sans-serif;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }

  #root { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Layout ── */
  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 480px; margin: 0 auto; }

  /* ── Header ── */
  .header {
    padding: 20px 20px 0;
    display: flex; align-items: center; gap: 10px;
  }
  .header-logo {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--accent); display: grid; place-items: center;
    font-size: 18px;
  }
  .header h1 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px; font-weight: 800; letter-spacing: .5px;
    color: var(--text);
  }
  .header h1 span { color: var(--accent); }

  /* ── Nav ── */
  .nav {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 6px; padding: 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 10;
  }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 4px; border-radius: 10px;
    color: var(--muted); font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: .5px;
    text-transform: uppercase; transition: all .2s;
  }
  .nav-btn .nav-icon { font-size: 20px; }
  .nav-btn.active {
    background: var(--card); color: var(--accent);
    box-shadow: 0 0 0 1px var(--border);
  }
  .nav-btn:not(.active):hover { color: var(--text); background: var(--card); }

  /* ── Page ── */
  .page { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Page title ── */
  .page-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px; font-weight: 800; letter-spacing: .5px;
    line-height: 1;
  }
  .page-title span { color: var(--accent); }

  /* ── Card ── */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px;
    animation: fadeUp .25s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Stat grid ── */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px;
    display: flex; flex-direction: column; gap: 4px;
    animation: fadeUp .25s ease both;
  }
  .stat-card:nth-child(2) { animation-delay: .05s; }
  .stat-card:nth-child(3) { animation-delay: .10s; }
  .stat-card:nth-child(4) { animation-delay: .15s; }
  .stat-icon { font-size: 22px; }
  .stat-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 30px; font-weight: 800; line-height: 1;
    color: var(--text);
  }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: .4px; }
  .stat-card.accent { border-color: var(--accent); }
  .stat-card.accent .stat-value { color: var(--accent); }
  .stat-card.blue { border-color: var(--accent2); }
  .stat-card.blue .stat-value { color: var(--accent2); }
  .stat-card.red { border-color: var(--red); }
  .stat-card.red .stat-value { color: var(--red); }
  .stat-card.green { border-color: var(--green); }
  .stat-card.green .stat-value { color: var(--green); }

  /* ── Form ── */
  .form-group { display: flex; flex-direction: column; gap: 10px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .4px; display: block; margin-bottom: 4px; }
  input, select {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 9px; padding: 11px 13px; color: var(--text);
    font-family: 'Barlow', sans-serif; font-size: 14px;
    outline: none; transition: border-color .2s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus { border-color: var(--accent); }
  input::placeholder { color: var(--muted); }

  /* ── Buttons ── */
  .btn {
    border: none; cursor: pointer; border-radius: 9px;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    letter-spacing: .5px; font-size: 15px; transition: all .18s;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-primary {
    background: var(--accent); color: #0f1117;
    padding: 12px 20px; width: 100%;
  }
  .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); filter: brightness(.95); }

  .btn-sm {
    padding: 7px 13px; font-size: 13px; border-radius: 7px;
  }
  .btn-present { background: var(--green); color: #0f1117; }
  .btn-present:hover { filter: brightness(1.1); }
  .btn-paid { background: var(--accent2); color: #fff; }
  .btn-paid:hover { filter: brightness(1.1); }
  .btn-delete { background: transparent; color: var(--red); border: 1px solid var(--red); }
  .btn-delete:hover { background: var(--red); color: #fff; }

  /* ── Member list ── */
  .member-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
    animation: fadeUp .2s ease both;
  }
  .member-item:last-child { border-bottom: none; }
  .member-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--surface); border: 1px solid var(--border);
    display: grid; place-items: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 16px; color: var(--accent);
    flex-shrink: 0;
  }
  .member-info { flex: 1; min-width: 0; }
  .member-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .member-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .plan-badge {
    display: inline-block; padding: 2px 7px; border-radius: 5px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px;
    background: var(--surface); border: 1px solid var(--border); color: var(--muted);
  }
  .plan-badge.monthly { color: var(--accent); border-color: var(--accent); }
  .plan-badge.quarterly { color: var(--accent2); border-color: var(--accent2); }
  .plan-badge.annual { color: var(--green); border-color: var(--green); }

  /* ── Attendance item ── */
  .att-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid var(--border);
    animation: fadeUp .2s ease both;
  }
  .att-item:last-child { border-bottom: none; }
  .att-name { font-weight: 600; font-size: 14px; }
  .att-time { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .badge-present {
    background: rgba(77,219,142,.15); color: var(--green);
    border: 1px solid rgba(77,219,142,.3);
    border-radius: 6px; padding: 3px 9px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px;
  }

  /* ── Payment item ── */
  .pay-item {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
    animation: fadeUp .2s ease both;
  }
  .pay-item:last-child { border-bottom: none; }
  .pay-info { flex: 1; min-width: 0; }
  .pay-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pay-amount { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .badge-paid {
    background: rgba(77,219,142,.15); color: var(--green);
    border: 1px solid rgba(77,219,142,.3);
    border-radius: 6px; padding: 3px 9px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px;
  }
  .badge-due {
    background: rgba(255,95,95,.12); color: var(--red);
    border: 1px solid rgba(255,95,95,.3);
    border-radius: 6px; padding: 3px 9px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px;
  }

  /* ── Section header ── */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 2px;
  }
  .section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: .6px;
  }
  .count-bubble {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 9px;
    font-size: 12px; font-weight: 600; color: var(--muted);
  }

  /* ── Empty state ── */
  .empty {
    text-align: center; padding: 28px 0;
    color: var(--muted); font-size: 14px;
  }
  .empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: #0f1117;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 15px; letter-spacing: .3px;
    padding: 11px 22px; border-radius: 30px;
    box-shadow: 0 6px 24px rgba(200,241,53,.35);
    animation: toastIn .3s ease, toastOut .3s ease 1.8s both;
    z-index: 999; white-space: nowrap;
  }
  @keyframes toastIn  { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  @keyframes toastOut { from { opacity:1; } to { opacity:0; } }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

// ─── Component ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useLocalState("gym_members", []);
  const [attendance, setAttendance] = useLocalState("gym_attendance", []);
  const [payments, setPayments] = useLocalState("gym_payments", []);
  const [toast, setToast] = useState(null);

  // sync payments when members change
  useEffect(() => {
    setPayments((prev) => {
      const existing = prev.map((p) => p.id);
      const added = members
        .filter((m) => !existing.includes(m.id))
        .map((m) => ({ id: m.id, paid: false, paidDate: null }));
      const filtered = prev.filter((p) => members.find((m) => m.id === p.id));
      return [...filtered, ...added];
    });
  }, [members]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  const todayAtt = attendance.filter((a) => a.date === TODAY);
  const totalEarnings = payments
    .filter((p) => p.paid)
    .reduce((sum, p) => {
      const m = members.find((x) => x.id === p.id);
      return sum + (m ? getPlanFee(m.plan) : 0);
    }, 0);
  const pendingDues = payments.filter((p) => !p.paid).length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-logo">💪</div>
          <h1>Iron<span>Club</span></h1>
        </div>

        {/* Nav */}
        <nav className="nav">
          {[
            { id: "home",       icon: "🏠", label: "Home" },
            { id: "members",    icon: "👥", label: "Members" },
            { id: "attendance", icon: "✅", label: "Attend" },
            { id: "payments",   icon: "💳", label: "Payments" },
          ].map((t) => (
            <button
              key={t.id}
              className={`nav-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Pages */}
        {tab === "home" && (
          <HomePage
            members={members}
            todayAtt={todayAtt}
            totalEarnings={totalEarnings}
            pendingDues={pendingDues}
          />
        )}
        {tab === "members" && (
          <MembersPage
            members={members}
            setMembers={setMembers}
            showToast={showToast}
          />
        )}
        {tab === "attendance" && (
          <AttendancePage
            members={members}
            attendance={attendance}
            setAttendance={setAttendance}
            todayAtt={todayAtt}
            showToast={showToast}
          />
        )}
        {tab === "payments" && (
          <PaymentsPage
            members={members}
            payments={payments}
            setPayments={setPayments}
            totalEarnings={totalEarnings}
            showToast={showToast}
          />
        )}
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}

// ─── Home ────────────────────────────────────────────────────────────────────
function HomePage({ members, todayAtt, totalEarnings, pendingDues }) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const today = new Date();

  return (
    <div className="page">
      <div>
        <div className="page-title">Dashboard <span>↗</span></div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card accent">
          <span className="stat-icon">🏋️</span>
          <div className="stat-value">{members.length}</div>
          <div className="stat-label">Total Members</div>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">📋</span>
          <div className="stat-value">{todayAtt.length}</div>
          <div className="stat-label">Today's Attendance</div>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">💰</span>
          <div className="stat-value">${totalEarnings}</div>
          <div className="stat-label">Total Earnings</div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">⚠️</span>
          <div className="stat-value">{pendingDues}</div>
          <div className="stat-label">Pending Dues</div>
        </div>
      </div>

      {/* Quick summary card */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 12 }}>
          <span className="section-title">Week at a glance</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {days.map((d, i) => {
            const isToday = i === today.getDay();
            return (
              <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 10, color: isToday ? "var(--accent)" : "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{d}</span>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: isToday ? "var(--accent)" : "var(--surface)",
                  border: `1px solid ${isToday ? "var(--accent)" : "var(--border)"}`,
                  display: "grid", placeItems: "center",
                  fontSize: 12, fontWeight: 700,
                  color: isToday ? "#0f1117" : "var(--muted)"
                }}>
                  {new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + i).getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {members.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 36 }}>🚀</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, marginTop: 8 }}>Get Started!</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Add your first member from the Members tab.</div>
        </div>
      )}
    </div>
  );
}

// ─── Members ─────────────────────────────────────────────────────────────────
function MembersPage({ members, setMembers, showToast }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [search, setSearch] = useState("");

  function addMember() {
    if (!name.trim()) return;
    const member = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      plan,
      joined: TODAY,
    };
    setMembers((prev) => [member, ...prev]);
    setName(""); setPhone(""); setPlan("monthly");
    showToast(`${member.name} added!`);
  }

  function deleteMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast("Member removed");
  }

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  return (
    <div className="page">
      <div className="page-title">Members</div>

      {/* Add form */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 12 }}>➕ New Member</div>
        <div className="form-group">
          <div>
            <label>Full Name</label>
            <input placeholder="e.g. Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div>
              <label>Phone</label>
              <input placeholder="555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label>Plan</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={addMember}>Add Member 💪</button>
        </div>
      </div>

      {/* Search */}
      {members.length > 0 && (
        <div>
          <input
            placeholder="🔍 Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          />
        </div>
      )}

      {/* List */}
      <div className="card" style={{ padding: "4px 16px" }}>
        <div className="section-header" style={{ padding: "12px 0" }}>
          <span className="section-title">All Members</span>
          <span className="count-bubble">{filtered.length}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">👤</span>
            {members.length === 0 ? "No members yet. Add your first one!" : "No results found."}
          </div>
        ) : (
          filtered.map((m, i) => (
            <div key={m.id} className="member-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="member-avatar">{m.name[0].toUpperCase()}</div>
              <div className="member-info">
                <div className="member-name">{m.name}</div>
                <div className="member-meta">
                  {m.phone && <span>{m.phone} · </span>}
                  <span className={`plan-badge ${m.plan}`}>
                    {PLANS.find((p) => p.value === m.plan)?.label}
                  </span>
                </div>
              </div>
              <button className="btn btn-sm btn-delete" onClick={() => deleteMember(m.id)}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Attendance ───────────────────────────────────────────────────────────────
function AttendancePage({ members, attendance, setAttendance, todayAtt, showToast }) {
  function markPresent(memberId, memberName) {
    const already = todayAtt.find((a) => a.memberId === memberId);
    if (already) { showToast("Already marked!"); return; }
    const record = {
      id: Date.now().toString(),
      memberId,
      memberName,
      date: TODAY,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setAttendance((prev) => [record, ...prev]);
    showToast(`${memberName} marked present!`);
  }

  const markedIds = new Set(todayAtt.map((a) => a.memberId));

  return (
    <div className="page">
      <div className="page-title">Attendance</div>

      {/* Mark attendance */}
      <div className="card" style={{ padding: "4px 16px" }}>
        <div className="section-header" style={{ padding: "12px 0" }}>
          <span className="section-title">Mark Today</span>
          <span className="count-bubble">{members.length} members</span>
        </div>
        {members.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">👥</span>
            Add members first to mark attendance.
          </div>
        ) : (
          members.map((m, i) => {
            const present = markedIds.has(m.id);
            return (
              <div key={m.id} className="att-item" style={{ animationDelay: `${i * 0.04}s` }}>
                <div>
                  <div className="att-name">{m.name}</div>
                  <div className="att-time">{m.phone || "No phone"}</div>
                </div>
                {present ? (
                  <span className="badge-present">✓ Present</span>
                ) : (
                  <button
                    className="btn btn-sm btn-present"
                    onClick={() => markPresent(m.id, m.name)}
                  >
                    Mark ✓
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Today's list */}
      <div className="card" style={{ padding: "4px 16px" }}>
        <div className="section-header" style={{ padding: "12px 0" }}>
          <span className="section-title">Today's Log</span>
          <span className="count-bubble">{todayAtt.length}</span>
        </div>
        {todayAtt.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">📋</span>
            No one marked present yet.
          </div>
        ) : (
          todayAtt.map((a, i) => (
            <div key={a.id} className="att-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <div>
                <div className="att-name">{a.memberName}</div>
                <div className="att-time">⏱ {a.time}</div>
              </div>
              <span className="badge-present">✓ Present</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Payments ────────────────────────────────────────────────────────────────
function PaymentsPage({ members, payments, setPayments, totalEarnings, showToast }) {
  function markPaid(id, memberName) {
    setPayments((prev) =>
      prev.map((p) => p.id === id ? { ...p, paid: true, paidDate: TODAY } : p)
    );
    showToast(`${memberName} payment confirmed!`);
  }

  const paid = payments.filter((p) => p.paid);
  const due  = payments.filter((p) => !p.paid);

  function getMember(id) { return members.find((m) => m.id === id); }

  return (
    <div className="page">
      <div className="page-title">Payments</div>

      <div className="stat-grid">
        <div className="stat-card green">
          <span className="stat-icon">💰</span>
          <div className="stat-value">${totalEarnings}</div>
          <div className="stat-label">Total Collected</div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">📬</span>
          <div className="stat-value">{due.length}</div>
          <div className="stat-label">Dues Pending</div>
        </div>
      </div>

      {/* Dues */}
      <div className="card" style={{ padding: "4px 16px" }}>
        <div className="section-header" style={{ padding: "12px 0" }}>
          <span className="section-title">⚠️ Dues</span>
          <span className="count-bubble">{due.length}</span>
        </div>
        {due.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">🎉</span>
            All caught up! No pending dues.
          </div>
        ) : (
          due.map((p, i) => {
            const m = getMember(p.id);
            if (!m) return null;
            return (
              <div key={p.id} className="pay-item" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="member-avatar">{m.name[0].toUpperCase()}</div>
                <div className="pay-info">
                  <div className="pay-name">{m.name}</div>
                  <div className="pay-amount">
                    ${getPlanFee(m.plan)} · <span className={`plan-badge ${m.plan}`}>{m.plan}</span>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-paid"
                  onClick={() => markPaid(p.id, m.name)}
                >
                  Mark Paid
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Paid */}
      <div className="card" style={{ padding: "4px 16px" }}>
        <div className="section-header" style={{ padding: "12px 0" }}>
          <span className="section-title">✅ Paid</span>
          <span className="count-bubble">{paid.length}</span>
        </div>
        {paid.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">💳</span>
            No payments recorded yet.
          </div>
        ) : (
          paid.map((p, i) => {
            const m = getMember(p.id);
            if (!m) return null;
            return (
              <div key={p.id} className="pay-item" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="member-avatar" style={{ color: "var(--green)" }}>{m.name[0].toUpperCase()}</div>
                <div className="pay-info">
                  <div className="pay-name">{m.name}</div>
                  <div className="pay-amount">
                    ${getPlanFee(m.plan)} · Paid {p.paidDate ?? ""}
                  </div>
                </div>
                <span className="badge-paid">✓ Paid</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
