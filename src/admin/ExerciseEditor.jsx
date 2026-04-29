import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function ExerciseEditor({ lessonId }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true });
    if (!error) setExercises(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExercises(); }, [lessonId]);

  const handleSave = async (exercise) => {
    const payload = {
      lesson_id: lessonId,
      type: exercise.type,
      instruction: exercise.instruction,
      prompt: exercise.prompt || null,
      options: exercise.options || null,
      correct_index: exercise.correct_index ?? null,
      sentence: exercise.sentence || null,
      blank_index: exercise.blank_index ?? null,
      correct_sentence: exercise.correct_sentence || null,
      words: exercise.words || null,
      scenario: exercise.scenario || null,
      // Educational metadata (read by dailyMix, ListenChooseExercise, PremiumChooseExercise)
      chunk_id: exercise.chunk_id || null,
      direction: exercise.direction || null,
      hint: exercise.hint || null,
      audio_text: exercise.audio_text || null,
      sort_order: exercise.sort_order,
      is_active: exercise.is_active,
    };

    if (exercise.id) {
      await supabase.from('exercises').update(payload).eq('id', exercise.id);
    } else {
      await supabase.from('exercises').insert({ ...payload, sort_order: exercises.length + 1 });
    }
    setEditing(null);
    fetchExercises();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this exercise?')) return;
    await supabase.from('exercises').delete().eq('id', id);
    fetchExercises();
  };

  const toggleActive = async (ex) => {
    await supabase.from('exercises').update({ is_active: !ex.is_active }).eq('id', ex.id);
    fetchExercises();
  };

  if (loading) return <p style={{ fontSize: 12, color: '#999', fontFamily: 'Nunito, sans-serif' }}>Loading exercises...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif' }}>
          Exercises ({exercises.length})
        </span>
        <button type="button" onClick={() => setEditing({
          type: 'choose', instruction: '', prompt: '', options: [], correct_index: 0,
          sentence: null, blank_index: null, correct_sentence: null, words: null, scenario: null,
          sort_order: exercises.length + 1, is_active: true,
        })} style={{
          background: '#1E88E5', border: 'none', borderRadius: 6, padding: '4px 12px',
          fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
        }}>
          + Add
        </button>
      </div>

      {exercises.map((ex) => (
        <div key={ex.id} style={{
          background: '#FAFAFA', borderRadius: 8, padding: '8px 10px', marginBottom: 6,
          border: '1px solid #EEE', opacity: ex.is_active ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            background: typeColor(ex.type), borderRadius: 4, padding: '2px 6px',
          }}>
            {ex.type}
          </span>
          <span style={{ flex: 1, fontSize: 12, color: '#666', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ex.instruction}
          </span>
          <button type="button" onClick={() => setEditing({ ...ex })} style={miniBtn('#1E88E5')}>Edit</button>
          <button type="button" onClick={() => toggleActive(ex)} style={miniBtn(ex.is_active ? '#FF9800' : '#0891B2')}>
            {ex.is_active ? 'Hide' : 'Show'}
          </button>
          <button type="button" onClick={() => handleDelete(ex.id)} style={miniBtn('#E53935')}>Del</button>
        </div>
      ))}

      {editing && (
        <ExerciseEditModal exercise={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function typeColor(type) {
  const colors = { choose: '#1E88E5', fillgap: '#8E24AA', order: '#FF9800', listen: '#00897B', scenario: '#E53935' };
  return colors[type] || '#666';
}

function miniBtn(color) {
  return {
    background: 'none', border: `1px solid ${color}`, borderRadius: 4, padding: '2px 6px',
    fontSize: 10, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
  };
}

function ExerciseEditModal({ exercise, onSave, onClose }) {
  const [form, setForm] = useState({
    ...exercise,
    options: Array.isArray(exercise.options) ? JSON.stringify(exercise.options) : (exercise.options || '[]'),
    words: Array.isArray(exercise.words) ? JSON.stringify(exercise.words) : (exercise.words || '[]'),
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    let parsedOptions, parsedWords;
    try {
      if (form.type === 'choose' || form.type === 'listen' || form.type === 'fillgap' || form.type === 'scenario') {
        parsedOptions = parseStringArray(form.options, 'Options');
      }
      if (form.type === 'order') {
        parsedWords = parseStringArray(form.words, 'Words');
      }
    } catch (err) {
      setFormError(err.message);
      return;
    }

    const result = {
      ...exercise,
      type: form.type,
      instruction: form.instruction,
      sort_order: form.sort_order,
      is_active: form.is_active,
      // Educational metadata — empty strings normalize to null in handleSave
      chunk_id: form.chunk_id || null,
      direction: form.direction || null,
      hint: form.hint || null,
      audio_text: form.audio_text || null,
    };

    if (form.type === 'choose' || form.type === 'listen') {
      result.prompt = form.prompt;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = parsedOptions;
    } else if (form.type === 'fillgap') {
      result.sentence = form.sentence;
      result.blank_index = parseInt(form.blank_index) || 0;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = parsedOptions;
    } else if (form.type === 'order') {
      result.correct_sentence = form.correct_sentence;
      result.words = parsedWords;
    } else if (form.type === 'scenario') {
      result.scenario = form.scenario;
      result.correct_index = parseInt(form.correct_index) || 0;
      result.options = parsedOptions;
    }

    onSave(result);
  };

  const fieldStyle = {
    width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #E0E0E0',
    fontSize: 13, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 460,
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          {exercise.id ? 'Edit Exercise' : 'New Exercise'}
        </h3>
        {formError && (
          <div role="alert" style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Label text="Type" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }}>
            <option value="choose">Choose</option>
            <option value="fillgap">Fill Gap</option>
            <option value="order">Order</option>
            <option value="listen">Listen</option>
            <option value="scenario">Scenario</option>
          </select>

          <Label text="Instruction" />
          <input value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />

          {(form.type === 'choose' || form.type === 'listen') && (
            <>
              <Label text="Prompt" />
              <input value={form.prompt || ''} onChange={(e) => setForm({ ...form, prompt: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          {form.type === 'fillgap' && (
            <>
              <Label text="Sentence (JSON array)" />
              <input value={form.sentence || ''} onChange={(e) => setForm({ ...form, sentence: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Blank Index" />
              <input type="number" value={form.blank_index ?? 0} onChange={(e) => setForm({ ...form, blank_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          {form.type === 'order' && (
            <>
              <Label text="Correct Sentence" />
              <input value={form.correct_sentence || ''} onChange={(e) => setForm({ ...form, correct_sentence: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Words (JSON array)" />
              <textarea value={form.words} onChange={(e) => setForm({ ...form, words: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
            </>
          )}

          {form.type === 'scenario' && (
            <>
              <Label text="Scenario" />
              <input value={form.scenario || ''} onChange={(e) => setForm({ ...form, scenario: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
              <Label text="Options (JSON array)" />
              <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={2} style={{ ...fieldStyle, marginBottom: 10, resize: 'vertical' }} />
              <Label text="Correct Index" />
              <input type="number" value={form.correct_index ?? 0} onChange={(e) => setForm({ ...form, correct_index: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }} />
            </>
          )}

          {/* Educational metadata — visible for all exercise types */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #EEE' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#9E9E9E', fontFamily: 'Nunito, sans-serif', marginBottom: 8, letterSpacing: 0.5 }}>METADATA (OPTIONAL)</p>
            <Label text="Chunk ID (e.g. greeting,intro — for weak-chunk tracking)" />
            <input value={form.chunk_id || ''} onChange={(e) => setForm({ ...form, chunk_id: e.target.value })} placeholder="greeting" style={{ ...fieldStyle, marginBottom: 10 }} />
            {(form.type === 'listen' || form.type === 'choose') && (
              <>
                <Label text="Direction (translation flow)" />
                <select value={form.direction || ''} onChange={(e) => setForm({ ...form, direction: e.target.value })} style={{ ...fieldStyle, marginBottom: 10 }}>
                  <option value="">— none —</option>
                  <option value="so-en">Somali → English</option>
                  <option value="en-so">English → Somali</option>
                </select>
              </>
            )}
            {form.type === 'listen' && (
              <>
                <Label text="Audio Text (the phrase being played)" />
                <input value={form.audio_text || ''} onChange={(e) => setForm({ ...form, audio_text: e.target.value })} placeholder="Salaan" style={{ ...fieldStyle, marginBottom: 10 }} />
              </>
            )}
            <Label text="Hint (shown to user, optional)" />
            <input value={form.hint || ''} onChange={(e) => setForm({ ...form, hint: e.target.value })} placeholder="Optional hint" style={{ ...fieldStyle, marginBottom: 10 }} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: '2px solid #E0E0E0',
              background: 'white', fontSize: 13, fontWeight: 700, color: '#666',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
              background: '#1E88E5', fontSize: 13, fontWeight: 700, color: 'white',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function parseStringArray(raw, label) {
  let parsed;
  try { parsed = JSON.parse(raw || '[]'); }
  catch { throw new Error(`${label}: not valid JSON`); }
  if (!Array.isArray(parsed)) throw new Error(`${label}: must be a JSON array`);
  if (!parsed.every((x) => typeof x === 'string')) throw new Error(`${label}: every entry must be a string`);
  return parsed;
}

function Label({ text }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: '#999', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 3 }}>
      {text}
    </label>
  );
}
