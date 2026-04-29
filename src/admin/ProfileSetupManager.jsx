import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Edits the visible content of the 4 profile-setup screens.
 * Structural fields (step number, field_key, validation rules) are
 * locked — those are tied to columns in the profiles table and
 * changing them would break the saved-profile path.
 */
export default function ProfileSetupManager() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile_setup_content')
      .select('*')
      .order('step', { ascending: true });
    if (!error && data) setSteps(data);
    setLoading(false);
  };

  const showMsg = (text) => { setMessage(text); setTimeout(() => setMessage(''), 2500); };

  const updateField = (id, field, value) => {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveStep = async (stepRow) => {
    setSavingId(stepRow.id);
    const { error } = await supabase
      .from('profile_setup_content')
      .update({
        title_so: stepRow.title_so || '',
        title_en: stepRow.title_en || '',
        subtitle_so: stepRow.subtitle_so || '',
        subtitle_en: stepRow.subtitle_en || '',
        placeholder_so: stepRow.placeholder_so || '',
        placeholder_en: stepRow.placeholder_en || '',
      })
      .eq('id', stepRow.id);
    setSavingId(null);
    if (error) showMsg('Error: ' + error.message);
    else showMsg('Saved');
  };

  if (loading) return <p style={{ color: '#757575', fontFamily: 'Nunito, sans-serif' }}>Loading profile setup...</p>;
  if (steps.length === 0) return <p style={{ color: '#999', fontFamily: 'Nunito, sans-serif' }}>No profile setup rows found. Run the migration to seed the table.</p>;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>
        Profile Setup
      </h2>
      <p style={{ fontSize: 12, color: '#999', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
        Edit the question, subtitle, and placeholder shown on each profile-setup screen.
        Step number, field key, and icon are structural and not editable.
      </p>

      {message && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#ECFEFF', color: '#0E7490', fontSize: 13, fontWeight: 700, marginBottom: 12, fontFamily: 'Nunito, sans-serif' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((s) => (
          <div key={s.id} style={{
            background: 'white', borderRadius: 12, padding: 16,
            border: '1px solid #E5E5E5', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>
                  Step {s.step} — <span style={{ color: '#666' }}>{s.field_key}</span>
                </p>
                <p style={{ fontSize: 11, color: '#999', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                  Writes to <code>profiles.{s.field_key}</code>
                </p>
              </div>
            </div>

            <Row>
              <Field label="TITLE (Somali)" value={s.title_so || ''} onChange={(v) => updateField(s.id, 'title_so', v)} placeholder="Magacaad ku yaqaanaan?" />
              <Field label="TITLE (English)" value={s.title_en || ''} onChange={(v) => updateField(s.id, 'title_en', v)} placeholder="What should we call you?" />
            </Row>
            <Row>
              <Field label="SUBTITLE (Somali)" value={s.subtitle_so || ''} onChange={(v) => updateField(s.id, 'subtitle_so', v)} placeholder="Username-kaaga" />
              <Field label="SUBTITLE (English)" value={s.subtitle_en || ''} onChange={(v) => updateField(s.id, 'subtitle_en', v)} placeholder="Your username" />
            </Row>
            <Row>
              <Field label="PLACEHOLDER (Somali)" value={s.placeholder_so || ''} onChange={(v) => updateField(s.id, 'placeholder_so', v)} placeholder="tusaale: ahmed_99" />
              <Field label="PLACEHOLDER (English)" value={s.placeholder_en || ''} onChange={(v) => updateField(s.id, 'placeholder_en', v)} placeholder="e.g. ahmed_99" />
            </Row>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => saveStep(s)} disabled={savingId === s.id} style={{
                background: '#0891B2', color: 'white', border: 'none', borderRadius: 8,
                padding: '8px 18px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', opacity: savingId === s.id ? 0.6 : 1,
              }}>
                {savingId === s.id ? 'SAVING...' : 'SAVE STEP'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>{children}</div>;
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 4, display: 'block', letterSpacing: 0.5 }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E0E0E0',
          fontSize: 13, fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
