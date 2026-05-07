import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type FormState = {
  judul: string;
  tahun_rilis: string;
  sutradara: string;
  sinopsis: string;
  bahasa: string;
  cover: string;
};

const API_URL = '/api/movies';

export default function AddMovie() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    judul: '',
    tahun_rilis: '',
    sutradara: '',
    sinopsis: '',
    bahasa: '',
    cover: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Gagal menambahkan film. Periksa kembali data yang dimasukkan.');
      }
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
        <div>
          <h1 className="mb-2">Tambah Film Baru</h1>
          <p className="text-muted">Isi data film baru untuk menambah koleksi film di aplikasi.</p>
        </div>
        <Link href="/" className="btn btn-outline-secondary align-self-center">
          Kembali ke Daftar
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Judul Film</label>
              <input type="text" className="form-control" value={form.judul} onChange={handleChange('judul')} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tahun Rilis</label>
              <input type="text" className="form-control" value={form.tahun_rilis} onChange={handleChange('tahun_rilis')} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sutradara</label>
              <input type="text" className="form-control" value={form.sutradara} onChange={handleChange('sutradara')} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Bahasa</label>
              <input type="text" className="form-control" value={form.bahasa} onChange={handleChange('bahasa')} required />
            </div>
            <div className="col-12">
              <label className="form-label">Sinopsis</label>
              <textarea className="form-control" value={form.sinopsis} onChange={handleChange('sinopsis')} required />
            </div>
            <div className="col-12">
              <label className="form-label">URL atau data URI Cover Film</label>
              <input type="text" className="form-control" value={form.cover} onChange={handleChange('cover')} placeholder="https://example.com/cover.png atau data:image/png;base64,..." />
            </div>
            {form.cover && (
              <div className="col-12">
                <label className="form-label">Preview Cover</label>
                <div className="border rounded overflow-hidden mb-3" style={{ maxHeight: '280px' }}>
                  <img
                    src={form.cover}
                    alt="Preview cover"
                    className="img-fluid"
                    style={{ width: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/600x280?text=Invalid+Cover+URL';
                    }}
                  />
                </div>
              </div>
            )}
            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Film'}
              </button>
              <Link href="/" className="btn btn-outline-secondary">
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
