import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { hasWordAudio } from '../data/wordOfTheDay';

const CATEGORIES = ['greetings', 'emotions', 'school', 'transport'];

export default function WordOfDayManager() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const fetchWords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('word_of_day')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setWords(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWords(); }, []);

  const filtered = words.filter((w) => {
    const matchesCategory = category === 'all' || w.category === category;
    const matchesSearch = search === '' ||
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.somali.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSave = async (word) => {
    const payload = {
      english: word.english,
      somali: word.somali,
      category: word.category,
      is_active: word.is_active,
      sort_order: word.sort_order,
    };

    if (word.id) {
      await supabase.from('word_of_day').update(payload).eq('id', word.id);
    } else {
      await supabase.from('word_of_day').insert({ ...payload, sort_order: words.length + 1 });
    }
    setEditing(null);
    fetchWords();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this word?')) return;
    await supabase.from('word_of_day').delete().eq('id', id);
    fetchWords();
  };

  const toggleActive = async (word) => {
    await supabase.from('word_of_day').update({ is_active: !word.is_active }).eq('id', word.id);
    fetchWords();
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#999', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
        Word of the Day
      </h2>

      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E0E0E0',
          fontSize: 14, fontFamily: 'Nunito, sans-serif', marginBottom: 12, boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setCategory('all')}
          style={{
            padding: '6px 14px', borderRadius: 20, border: 'none',
            background: category === 'all' ? '#0891B2' : '#E0E0E0',
            color: category === 'all' ? 'white' : '#666',
            fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}
        >
          All ({words.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none',
              background: category === cat ? '#0891B2' : '#E0E0E0',
              color: category === cat ? 'white' : '#666',
              fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {cat} ({words.filter(w => w.category === cat).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: '#666', fontFamily: 'Nunito, sans-serif' }}>
          {filtered.length} words
        </span>
        <button type="button" onClick={() => setEditing({
          english: '', somali: '', category: 'greetings', is_active: true, sort_order: words.length + 1,
        })} style={{
          background: '#0891B2', border: 'none', borderRadius: 6, padding: '6px 14px',
          fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
        }}>
          + Add Word
        </button>
      </div>

      {filtered.map((word) => (
        <div key={word.id} style={{
          background: 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 6,
          border: '1px solid #EEE', opacity: word.is_active ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: getCategoryColor(word.category), flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#333', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
              {word.english}
            </p>
            <p style={{ fontSize: 13, color: '#0891B2', fontFamily: 'Nunito, sans-serif', margin: '2px 0 0' }}>
              {word.somali}
            </p>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, color: getCategoryColor(word.category),
            background: `${getCategoryColor(word.category)}15`,
            padding: '3px 8px', borderRadius: 6, textTransform: 'capitalize',
            fontFamily: 'Nunito, sans-serif',
          }}>
            {word.category}
          </span>
          {!hasWordAudio(word.english) && (
            <span title="No audio file matches this word — it will be skipped by the daily picker." style={{
              fontSize: 10, fontWeight: 700, color: '#B45309', background: '#FEF3C7',
              padding: '3px 8px', borderRadius: 6, fontFamily: 'Nunito, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              🔇 No audio
            </span>
          )}
          <button type="button" onClick={() => setEditing({ ...word })} style={miniBtn('#1E88E5')}>Edit</button>
          <button type="button" onClick={() => toggleActive(word)} style={miniBtn(word.is_active ? '#FF9800' : '#0891B2')}>
            {word.is_active ? 'Hide' : 'Show'}
          </button>
          <button type="button" onClick={() => handleDelete(word.id)} style={miniBtn('#E53935')}>Del</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ fontSize: 13, color: '#999', fontFamily: 'Nunito, sans-serif', textAlign: 'center', padding: 20 }}>
          No words found.
        </p>
      )}

      {editing && (
        <WordEditModal word={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    greetings: '#0891B2',
    emotions: '#E53935',
    school: '#7B1FA2',
    transport: '#FF9800',
  };
  return colors[category] || '#666';
}

function miniBtn(color) {
  return {
    background: 'none', border: `1px solid ${color}`, borderRadius: 4, padding: '2px 6px',
    fontSize: 10, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
    flexShrink: 0,
  };
}

function WordEditModal({ word, onSave, onClose }) {
  const [form, setForm] = useState({ ...word });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.english.trim() || !form.somali.trim()) {
      setFormError('Both English and Somali are required');
      return;
    }
    onSave(form);
  };

  const fieldStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E0E0E0',
    fontSize: 14, fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400,
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#333', fontFamily: 'Nunito, sans-serif', marginBottom: 16 }}>
          {word.id ? 'Edit Word' : 'Add New Word'}
        </h3>
        {formError && (
          <div role="alert" style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
            English
          </label>
          <input
            value={form.english}
            onChange={(e) => setForm({ ...form, english: e.target.value })}
            style={{ ...fieldStyle, marginBottom: form.english.trim() && !hasWordAudio(form.english) ? 6 : 12 }}
            placeholder="e.g. Hello"
          />
          {form.english.trim() && !hasWordAudio(form.english) && (
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#B45309', background: '#FEF3C7',
              padding: '6px 10px', borderRadius: 6, marginBottom: 12,
              fontFamily: 'Nunito, sans-serif',
            }}>
              🔇 No audio file for this word — it will be saved but skipped by the daily picker.
            </div>
          )}

          <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
            Somali
          </label>
          <input
            value={form.somali}
            onChange={(e) => setForm({ ...form, somali: e.target.value })}
            style={{ ...fieldStyle, marginBottom: 12 }}
            placeholder="e.g. Salaan"
          />

          <label style={{ fontSize: 12, fontWeight: 700, color: '#666', fontFamily: 'Nunito, sans-serif', display: 'block', marginBottom: 4 }}>
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ ...fieldStyle, marginBottom: 16 }}
          >
            <option value="greetings">Greetings</option>
            <option value="emotions">Emotions</option>
            <option value="school">School & Work</option>
            <option value="transport">Transport</option>
          </select>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 10, border: '2px solid #E0E0E0',
              background: 'white', fontSize: 14, fontWeight: 700, color: '#666',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
              background: '#0891B2', fontSize: 14, fontWeight: 700, color: 'white',
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
