export type ApiMovie = {
  id?: number;
  id_film?: number;
  judul: string;
  tahun_rilis: string;
  sutradara: string;
  sinopsis: string;
  bahasa: string;
  cover?: string;
  rating?: number | null;
};

export type Movie = {
  id: number;
  judul: string;
  tahun_rilis: string;
  sutradara: string;
  sinopsis: string;
  bahasa: string;
  cover?: string;
  rating?: number | null;
};

const normalizeCover = (cover?: string): string | undefined => {
  if (!cover) return undefined;

  const trimmed = cover.trim();

  // Hapus spasi atau newline dari base64 jika ada
  const cleaned = trimmed.replace(/\s+/g, '');

  if (/^data:image\/[a-zA-Z]+;base64,/.test(cleaned)) {
    return cleaned;
  }

  // Jika diberikan raw base64 tanpa prefix, tambahkan prefix default.
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    return `data:image/jpeg;base64,${cleaned}`;
  }

  return cleaned;
};

export const normalizeMovie = (movie: ApiMovie): Movie => ({
  id: movie.id ?? movie.id_film ?? 0,
  judul: movie.judul,
  tahun_rilis: movie.tahun_rilis,
  sutradara: movie.sutradara,
  sinopsis: movie.sinopsis,
  bahasa: movie.bahasa,
  cover: normalizeCover(movie.cover),
  rating: movie.rating ?? null,
});
