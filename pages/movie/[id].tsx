import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Movie, normalizeMovie } from '../../lib/movie';

const API_URL = '/api/movies';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
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

  const deleteMovie = async () => {
    if (!movie) return;
    const confirmed = confirm('Anda yakin ingin menghapus film ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${movie.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus film.');
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
        <div>
          <h1 className="mb-2">Detail Film</h1>
          <p className="text-muted">Detail lengkap film dengan sinopsis, informasi, dan kontrol edit/hapus.</p>
        </div>
        <Link href="/" className="btn btn-outline-primary align-self-center">
          Kembali ke Daftar
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Memuat detail film...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : movie ? (
        <div className="card shadow-sm">
          <div className="card-body">
            {movie.cover ? (
              <img
                src={movie.cover}
                alt={movie.judul}
                className="img-fluid mb-3"
                style={{ width: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            ) : (
              <div className="mb-3" style={{ height: '300px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontWeight: 500 }}>
                No Cover
              </div>
            )}
            <h2 className="card-title">{movie.judul}</h2>
            <p className="text-muted mb-1">Tahun Rilis: {movie.tahun_rilis}</p>
            <p className="text-muted mb-1">Sutradara: {movie.sutradara}</p>
            <p className="text-muted mb-1">Bahasa: {movie.bahasa}</p>
            <hr />
            <h5>Sinopsis</h5>
            <p>{movie.sinopsis}</p>
            <div className="mt-4 d-flex flex-wrap gap-2">
              <Link href={`/movie/${movie.id}/edit`} className="btn btn-success">
                Edit Film
              </Link>
              <button type="button" className="btn btn-danger" onClick={deleteMovie}>
                Hapus Film
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Film tidak ditemukan.</div>
      )}
    </div>
  );
}
