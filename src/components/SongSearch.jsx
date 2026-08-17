import { useEffect, useRef, useState } from 'react';
import './SongSearch.css';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

// Buscador de canciones integrado en la página (sin salir a otra pestaña):
// consulta la YouTube Data API v3 en vivo mientras el invitado escribe y
// muestra resultados reales (miniatura + título) para elegir con un clic.
// Sin VITE_YOUTUBE_API_KEY configurada, cae a un link directo a YouTube —
// Spotify no se puede buscar así de forma segura sin un backend propio
// (necesita un client secret que nunca debe exponerse en el frontend).
function SongSearch({ id, value, onChange, onSelectLink, placeholder, content }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (!API_KEY || query.trim().length < 2) {
      setResults([]);
      setStatus('idle');
      return undefined;
    }

    setStatus('loading');
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          part: 'snippet',
          type: 'video',
          videoCategoryId: '10',
          maxResults: '5',
          q: query,
          key: API_KEY,
        });
        const res = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('YouTube search failed');
        const data = await res.json();
        setResults(data.items || []);
        setStatus('done');
      } catch (err) {
        if (err.name !== 'AbortError') setStatus('error');
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleInputChange(e) {
    const next = e.target.value;
    setQuery(next);
    onChange(next);
    onSelectLink?.(''); // texto libre: ya no corresponde a un resultado puntual
    setOpen(true);
  }

  function selectResult(item) {
    const title = item.snippet.title;
    const channel = item.snippet.channelTitle;
    const label = `${title} — ${channel}`;
    setQuery(label);
    onChange(label);
    onSelectLink?.(`https://www.youtube.com/watch?v=${item.id.videoId}`);
    setOpen(false);
    setResults([]);
  }

  const encoded = encodeURIComponent(query.trim());
  const spotifyHref = query.trim() ? `${content.spotifySearchBase}${encoded}` : undefined;
  const youtubeHref = query.trim() ? `https://music.youtube.com/search?q=${encoded}` : undefined;

  return (
    <div className="song-search" ref={containerRef}>
      <input
        id={id}
        className="song-search__input"
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
      />

      {API_KEY && open && query.trim().length >= 2 && (
        <div className="song-search__results hud-panel">
          {status === 'loading' && <p className="song-search__hint">{content.loadingLabel}</p>}
          {status === 'error' && <p className="song-search__hint">{content.noResultsLabel}</p>}
          {status === 'done' && results.length === 0 && (
            <p className="song-search__hint">{content.noResultsLabel}</p>
          )}
          {status === 'done' &&
            results.map((item) => (
              <button
                type="button"
                key={item.id.videoId}
                className="song-search__result"
                onClick={() => selectResult(item)}
              >
                <img src={item.snippet.thumbnails?.default?.url} alt="" />
                <span className="song-search__result-text">
                  <span className="song-search__result-title">{item.snippet.title}</span>
                  <span className="song-search__result-channel">{item.snippet.channelTitle}</span>
                </span>
              </button>
            ))}
        </div>
      )}

      {!API_KEY && (
        <div className="song-search__fallback">
          <a
            className={`song-search__fallback-link${query.trim() ? '' : ' is-disabled'}`}
            href={youtubeHref}
            target="_blank"
            rel="noreferrer"
          >
            {content.openInYoutube}
          </a>
          <a
            className={`song-search__fallback-link${query.trim() ? '' : ' is-disabled'}`}
            href={spotifyHref}
            target="_blank"
            rel="noreferrer"
          >
            {content.spotifyLinkLabel}
          </a>
        </div>
      )}
    </div>
  );
}

export default SongSearch;
