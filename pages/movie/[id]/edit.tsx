import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Movie, normalizeMovie } from '../../../lib/movie';

const API_URL = '/api/movies';

export default function EditMovie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMovie(normalizeMovie(data));
          return;
        }

        const listRes = await fetch(API_URL);
        if (!listRes.ok) throw new Error('Gagal memuat data film.');
        const list = await listRes.json();
        const found = Array.isArray(list) ? list.map(normalizeMovie).find((item) => item.id === Number(id)) : null;
        setMovie(found ?? null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (field: keyof Omit<Movie, 'id'>) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMovie((current) => (current ? { ...current, [field]: event.target.value } : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!movie) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!res.ok) {
        throw new Error('Gagal memperbarui film.');
      }
      router.push(`/movie/${movie.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
        <div>
          <h1 className="mb-2">Edit Film</h1>
          <p className="text-muted">Ubah informasi film dan simpan perubahan.</p>
        </div>
        <Link href="/" className="btn btn-outline-secondary align-self-center">
          Kembali ke Daftar
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Memuat data film...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : movie ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Judul Film</label>
                <input type="text" className="form-control" value={movie.judul} onChange={handleChange('judul')} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tahun Rilis</label>
                <input type="text" className="form-control" value={movie.tahun_rilis} onChange={handleChange('tahun_rilis')} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sutradara</label>
                <input type="text" className="form-control" value={movie.sutradara} onChange={handleChange('sutradara')} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bahasa</label>
                <input type="text" className="form-control" value={movie.bahasa} onChange={handleChange('bahasa')} required />
              </div>
              <div className="col-12">
                <label className="form-label">Sinopsis</label>
                <textarea className="form-control" value={movie.sinopsis} onChange={handleChange('sinopsis')} required />
              </div>
              <div className="col-12">
                <label className="form-label">URL atau data URI Cover Film</label>
              <input type="text" className="form-control" value={movie.cover || ''} onChange={handleChange('cover')} placeholder="https://example.com/cover.png atau data:image/png;base64,..." />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <Link href={`/movie/${movie.id}`} className="btn btn-outline-secondary">
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Data film tidak ditemukan.</div>
      )}
    </div>
  );
}
