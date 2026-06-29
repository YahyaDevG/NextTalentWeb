import React from 'react';

/* ── Spinner ───────────────────────────────────────────────────────────────── */
export function Spinner({ size = 20, color = 'var(--indigo)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid var(--border)`,
      borderTopColor: color,
      animation: 'spin .7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

/* ── Button ────────────────────────────────────────────────────────────────── */
export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style, type = 'button', loading }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    fontFamily: 'var(--font-body)', fontWeight: 600, cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--radius)', transition: 'all .15s',
    opacity: disabled || loading ? .6 : 1,
    ...({
      primary: { background: 'linear-gradient(135deg, var(--indigo), var(--violet))', color: '#fff', fontSize: 14 },
      secondary: { background: 'var(--indigo-50)', color: 'var(--indigo-dark)', fontSize: 14 },
      outline: { background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)', fontSize: 14 },
      danger: { background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 14 },
      ghost: { background: 'transparent', color: 'var(--text-2)', fontSize: 14 },
    }[variant]),
    ...({
      sm: { padding: '6px 14px', fontSize: 13 },
      md: { padding: '9px 20px' },
      lg: { padding: '12px 28px', fontSize: 15 },
    }[size]),
    ...style,
  };
  return (
    <button type={type} style={base} onClick={onClick} disabled={disabled || loading}>
      {loading ? <Spinner size={15} color={variant === 'primary' ? '#fff' : 'var(--indigo)'} /> : null}
      {children}
    </button>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────────── */
export function Card({ children, style, className }) {
  return (
    <div className={className} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)', ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Input ─────────────────────────────────────────────────────────────────── */
export function Input({ label, value, onChange, type = 'text', placeholder, style, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '.03em', textTransform: 'uppercase' }}>{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{
          padding: '9px 13px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: 14, color: 'var(--text)', background: 'var(--surface)', outline: 'none',
          transition: 'border-color .15s', ...style,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

/* ── Select ────────────────────────────────────────────────────────────────── */
export function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '.03em', textTransform: 'uppercase' }}>{label}</label>}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          padding: '9px 13px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: 14, color: 'var(--text)', background: 'var(--surface)', outline: 'none',
          cursor: 'pointer', ...style,
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ── Alert ─────────────────────────────────────────────────────────────────── */
export function Alert({ type = 'info', children }) {
  const styles = {
    info:    { bg: 'var(--indigo-50)',  border: 'var(--indigo)',  color: 'var(--indigo-dark)' },
    success: { bg: 'var(--success-bg)', border: 'var(--success)', color: '#065f46' },
    warning: { bg: 'var(--warning-bg)', border: 'var(--warning)', color: '#92400e' },
    danger:  { bg: 'var(--danger-bg)',  border: 'var(--danger)',  color: '#991b1b' },
  }[type];
  return (
    <div style={{
      background: styles.bg, borderLeft: `3px solid ${styles.border}`,
      color: styles.color, padding: '11px 15px',
      borderRadius: `0 var(--radius) var(--radius) 0`, fontSize: 13,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
    </div>
  );
}

/* ── Badge ──────────────────────────────────────────────────────────────────── */
export function Badge({ children, color = 'indigo' }) {
  const map = {
    indigo: { bg: 'var(--indigo-100)', color: 'var(--indigo-dark)' },
    green:  { bg: '#DCFCE7', color: '#166534' },
    yellow: { bg: '#FEF9C3', color: '#854D0E' },
    red:    { bg: '#FEE2E2', color: '#991B1B' },
    gray:   { bg: 'var(--surface-2)', color: 'var(--text-2)' },
  };
  const s = map[color] || map.indigo;
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 99, padding: '2px 10px',
      fontSize: 12, fontWeight: 700, display: 'inline-block',
    }}>
      {children}
    </span>
  );
}

/* ── SkillTag ─────────────────────────────────────────────────────────────── */
export function SkillTag({ children }) {
  return (
    <span style={{
      display: 'inline-block', background: 'var(--indigo-50)', color: 'var(--indigo-dark)',
      borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 500, margin: '2px',
    }}>
      {children}
    </span>
  );
}

/* ── ScoreBadge ────────────────────────────────────────────────────────────── */
export function ScoreBadge({ score }) {
  const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon match' : 'Faible';
  return <Badge color={color}>{label} · {score}%</Badge>;
}

/* ── Avatar ─────────────────────────────────────────────────────────────────── */
export function Avatar({ name = '', size = 36 }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * .36,
    }}>
      {initials}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, delta, icon, color = 'var(--indigo)' }) {
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', lineHeight: 1 }}>{value}</div>
          {delta && <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>{delta}</div>}
        </div>
        {icon && (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className={`ti ${icon}`} style={{ fontSize: 20, color }} />
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── PageHeader ─────────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────────── */
export function Empty({ icon = 'ti-inbox', message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
      <i className={`ti ${icon}`} style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
      <p style={{ fontSize: 14 }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/* ── Table ──────────────────────────────────────────────────────────────────── */
export function Table({ columns, rows, emptyMessage = 'Aucune donnée' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
                letterSpacing: '.07em', textTransform: 'uppercase',
                padding: '8px 12px', borderBottom: '2px solid var(--border)',
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)', fontSize: 13 }}>{emptyMessage}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {columns.map(c => (
                <td key={c.key} style={{ padding: '11px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, verticalAlign: 'middle' }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = {
    success: { bg: 'var(--success)', icon: 'ti-circle-check' },
    danger:  { bg: 'var(--danger)',  icon: 'ti-circle-x' },
    info:    { bg: 'var(--indigo)',  icon: 'ti-info-circle' },
  }[type];
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: colors.bg, color: '#fff', padding: '12px 18px',
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500,
      animation: 'pop .3s ease',
    }}>
      <i className={`ti ${colors.icon}`} style={{ fontSize: 18 }} />
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', cursor: 'pointer', marginLeft: 8 }}>
        <i className="ti ti-x" />
      </button>
    </div>
  );
}
