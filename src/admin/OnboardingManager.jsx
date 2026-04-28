import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const SCREENS = [
  { key: 'screen0', label: 'Screen 0 — Splash' },
  { key: 'screen1', label: 'Screen 1 — Intent' },
  { key: 'screen2', label: 'Screen 2 — Comfort' },
  { key: 'screen3', label: 'Screen 3 — Micro Demo' },
  { key: 'screen4', label: 'Screen 4 — Confirmation' },
  { key: 'screen5', label: 'Screen 5 — Save Progress' },
];

export default function OnboardingManager() {
  const [screens, setScreens] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState('screen0');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('onboarding_content')
      .select('*')
      .order('screen_key');
    if (!error && data) {
      const map = {};
      data.forEach((row) => { map[row.screen_key] = row.content; });
      setScreens(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const updateField = (screenKey, field, value) => {
    setScreens((prev) => ({
      ...prev,
      [screenKey]: { ...prev[screenKey], [field]: value },
    }));
  };

  const updateNestedField = (screenKey, field, index, subfield, value) => {
    setScreens((prev) => {
      const arr = [...(prev[screenKey]?.[field] || [])];
      if (typeof arr[index] === 'object') {
        arr[index] = { ...arr[index], [subfield]: value };
      } else {
        arr[index] = value;
      }
      return { ...prev, [screenKey]: { ...prev[screenKey], [field]: arr } };
    });
  };

  const saveScreen = async (screenKey) => {
    setSaving(true);
    const { error } = await supabase
      .from('onboarding_content')
      .update({ content: screens[screenKey] })
      .eq('screen_key', screenKey);
    if (error) showMsg('Error: ' + error.message);
    else showMsg('Saved!');
    setSaving(false);
  };

  if (loading) return <p style={{ color: '#757575' }}>Loading onboarding content...</p>;

  const content = screens[activeScreen] || {};

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
        Onboarding Content
      </h2>

      {message && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: '#ECFEFF', color: '#0E7490', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          {message}
        </div>
      )}

      {/* Screen tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {SCREENS.map((s) => (
          <button key={s.key} onClick={() => setActiveScreen(s.key)} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            border: activeScreen === s.key ? '2px solid #0891B2' : '1px solid #E0E0E0',
            background: activeScreen === s.key ? '#ECFEFF' : 'white',
            color: activeScreen === s.key ? '#0E7490' : '#757575',
            cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Screen editor */}
      <div style={{ background: 'white', borderRadius: 12, padding: '24px', border: '1px solid #EEEEEE' }}>
        {activeScreen === 'screen0' && (
          <>
            <Field label="Title" value={content.title || ''} onChange={(v) => updateField('screen0', 'title', v)} />
            <Field label="Subtitle" value={content.subtitle || ''} onChange={(v) => updateField('screen0', 'subtitle', v)} />
            <Field label="Button Text" value={content.buttonText || ''} onChange={(v) => updateField('screen0', 'buttonText', v)} />
            <Field label="Footer" value={content.footer || ''} onChange={(v) => updateField('screen0', 'footer', v)} />
          </>
        )}

        {activeScreen === 'screen1' && (
          <>
            <Field label="Question" value={content.question || ''} onChange={(v) => updateField('screen1', 'question', v)} />
            <label style={labelStyle}>Options</label>
            {(content.options || []).map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={opt.text || ''} onChange={(e) => updateNestedField('screen1', 'options', i, 'text', e.target.value)} placeholder="Option text" style={{ ...inputStyle, flex: 1 }} />
                <input value={opt.value || ''} onChange={(e) => updateNestedField('screen1', 'options', i, 'value', e.target.value)} placeholder="Value key" style={{ ...inputStyle, width: 120 }} />
              </div>
            ))}
          </>
        )}

        {activeScreen === 'screen2' && (
          <>
            <Field label="Question" value={content.question || ''} onChange={(v) => updateField('screen2', 'question', v)} />
            <label style={labelStyle}>Options</label>
            {(content.options || []).map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={opt.text || ''} onChange={(e) => updateNestedField('screen2', 'options', i, 'text', e.target.value)} placeholder="Option text" style={{ ...inputStyle, flex: 1 }} />
                <input value={opt.value || ''} onChange={(e) => updateNestedField('screen2', 'options', i, 'value', e.target.value)} placeholder="Value key" style={{ ...inputStyle, width: 120 }} />
              </div>
            ))}
            <Field label="Helper Text" value={content.helperText || ''} onChange={(v) => updateField('screen2', 'helperText', v)} />
          </>
        )}

        {activeScreen === 'screen3' && (
          <>
            <Field label="Label (above prompt)" value={content.label || ''} onChange={(v) => updateField('screen3', 'label', v)} />
            <Field label="Instruction" value={content.instruction || ''} onChange={(v) => updateField('screen3', 'instruction', v)} />
            <Field label="English Prompt" value={content.prompt || ''} onChange={(v) => updateField('screen3', 'prompt', v)} />
            <label style={labelStyle}>Somali Options (first one is correct)</label>
            {(content.options || []).map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === (content.correctIndex || 0) ? '#0891B2' : '#BDBDBD', width: 20 }}>{i === (content.correctIndex || 0) ? 'OK' : i}</span>
                <input value={opt} onChange={(e) => updateNestedField('screen3', 'options', i, null, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Correct Index (0-based)</label>
              <input type="number" value={content.correctIndex ?? 0} onChange={(e) => updateField('screen3', 'correctIndex', parseInt(e.target.value))} style={{ ...inputStyle, width: 80 }} />
            </div>
          </>
        )}

        {activeScreen === 'screen4' && (
          <>
            <Field label="Title" value={content.title || ''} onChange={(v) => updateField('screen4', 'title', v)} />
            <Field label="Line 1" value={content.line1 || ''} onChange={(v) => updateField('screen4', 'line1', v)} />
            <Field label="Line 2" value={content.line2 || ''} onChange={(v) => updateField('screen4', 'line2', v)} />
            <Field label="Button Text" value={content.buttonText || ''} onChange={(v) => updateField('screen4', 'buttonText', v)} />
          </>
        )}

        {activeScreen === 'screen5' && (
          <>
            <Field label="Title" value={content.title || ''} onChange={(v) => updateField('screen5', 'title', v)} />
            <Field label="Subtitle" value={content.subtitle || ''} onChange={(v) => updateField('screen5', 'subtitle', v)} />
            <Field label="Primary Button" value={content.primaryButton || ''} onChange={(v) => updateField('screen5', 'primaryButton', v)} />
            <Field label="Secondary Button" value={content.secondaryButton || ''} onChange={(v) => updateField('screen5', 'secondaryButton', v)} />
          </>
        )}

        {activeScreen === 'screen6' && (
          <>
            <Field label="Lesson Title" value={content.lessonTitle || ''} onChange={(v) => updateField('screen6', 'lessonTitle', v)} />
            <Field label="Lesson Subtitle" value={content.lessonSubtitle || ''} onChange={(v) => updateField('screen6', 'lessonSubtitle', v)} />
            <Field label="Intro Line" value={content.introLine || ''} onChange={(v) => updateField('screen6', 'introLine', v)} />
            <Field label="Button Text" value={content.buttonText || ''} onChange={(v) => updateField('screen6', 'buttonText', v)} />
          </>
        )}

        <div style={{ marginTop: 20 }}>
          <button onClick={() => saveScreen(activeScreen)} disabled={saving} style={greenBtn}>
            {saving ? 'Saving...' : 'SAVE'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

const labelStyle = { fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block', fontFamily: 'Nunito, sans-serif' };
const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #E0E0E0',
  fontSize: 14, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
};
const greenBtn = {
  padding: '10px 20px', borderRadius: 8, border: 'none', background: '#0891B2',
  color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
};
