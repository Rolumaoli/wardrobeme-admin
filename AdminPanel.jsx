import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AdminPanel() {
  const [inspirations, setInspirations] = useState([]);
  const [filter, setFilter] = useState('');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
    style: ''
  });

  const fetchInspirations = async () => {
    let query = supabase.from('inspirations').select('*').order('created_at', { ascending: false });
    if (filter) {
      query = query.eq('style', filter);
    }
    const { data } = await query;
    setInspirations(data || []);
  };

  useEffect(() => {
    fetchInspirations();
  }, [filter]);

  const handleAdd = async () => {
    if (!newItem.title || !newItem.style || !newItem.image_url) return;
    await supabase.from('inspirations').insert([newItem]);
    setNewItem({ title: '', description: '', image_url: '', style: '' });
    fetchInspirations();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin – Pridaj inšpiráciu</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Názov"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Popis"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Obrázok URL"
          value={newItem.image_url}
          onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Štýl (napr. casual)"
          value={newItem.style}
          onChange={(e) => setNewItem({ ...newItem, style: e.target.value })}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={handleAdd}>Pridať inšpiráciu</button>
      </div>

      <input
        type="text"
        placeholder="Filtrovať podľa štýlu"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', marginBottom: '20px' }}
      />

      {inspirations.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
          <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <h3>{item.title}</h3>
          <p><strong>Štýl:</strong> {item.style}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
