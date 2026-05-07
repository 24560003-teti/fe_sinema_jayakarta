import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Movie, normalizeMovie } from '../lib/movie';

const API_URL = '/api/movies';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Tidak dapat memuat data film. Pastikan API lokal berjalan.');
      }
      const data = await res.json();
      setMovies(Array.isArray(data) ? data.map(normalizeMovie) : []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const deleteMovie = async (id: number) => {
    const confirmed = confirm('Hapus film ini dari daftar?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Gagal menghapus film.');
      }
      setMovies((current) => current.filter((movie) => movie.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-4 gap-3">
        <div>
          <h1 className="mb-2">Sinema Jayakarta</h1>
          <p className="text-muted">Website film interaktif dengan daftar, detail, tambah, edit, dan hapus film.</p>
        </div>
        <Link href="/movie/add" className="btn btn-primary btn-lg align-self-center">
          Tambah Film
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5">Memuat daftar film...</div>
      ) : movies.length === 0 ? (
        <div className="alert alert-info">Belum ada film. Tambahkan film baru untuk memulai.</div>
      ) : (
        <div className="row gy-4">
          {movies.map((movie) => (
            <div className="col-md-6" key={movie.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  {movie.cover ? (
                    <img
                      src={movie.cover}
                      alt={movie.judul}
                      className="card-img-top mb-3"
                      style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="mb-3" style={{ height: '200px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontWeight: 500 }}>
                      No Cover
                    </div>
                  )}
                  <h3 className="card-title">
                    <Link href={`/movie/${movie.id}`} className="card-link">
                      {movie.judul}
                    </Link>
                  </h3>
                  <p className="text-muted mb-1">Tahun Rilis: {movie.tahun_rilis}</p>
                  <p className="text-muted mb-3">Sutradara: {movie.sutradara}</p>
                  <p className="card-text text-truncate">{movie.sinopsis}</p>
                  <div className="mt-auto d-flex gap-2 flex-wrap">
                    <Link href={`/movie/${movie.id}`} className="btn btn-outline-secondary btn-sm">
                      Detail
                    </Link>
                    <Link href={`/movie/${movie.id}/edit`} className="btn btn-outline-success btn-sm">
                      Edit
                    </Link>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteMovie(movie.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
