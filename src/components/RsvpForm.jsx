import { useState } from 'react';
import CtaButton from './CtaButton';
import HudCorners from './HudCorners';
import SongSearch from './SongSearch';
import useScrollReveal from '../hooks/useScrollReveal';
import './RsvpForm.css';

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
}

function makeGuest() {
  return { id: makeId(), fullName: '', dni: '', dietary: '', song: '', songLink: '' };
}

const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

// Envía la confirmación a la Google Sheet (ver google-apps-script.gs en la
// raíz del proyecto para el script que hay que publicar del lado de Google).
// Sin VITE_GOOGLE_SHEETS_URL configurada, sólo queda logueado en consola
// para poder seguir probando el formulario mientras tanto.
//
// Se usa mode:'no-cors' + Content-Type:text/plain a propósito: es la forma
// estándar de postear a un Web App de Apps Script sin que el navegador
// dispare un preflight CORS (Apps Script no responde ese preflight). Como
// contrapartida no podemos leer la respuesta — por eso alcanza con que el
// fetch no tire error de red.
async function submitRsvp(guests) {
  if (!SHEETS_URL) {
    console.info('[RSVP] Nueva confirmación (sin Google Sheets configurada)', guests);
    return;
  }

  await fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ guests }),
  });
}

function RsvpForm({ content, songSearch }) {
  const ref = useScrollReveal();
  const [guests, setGuests] = useState([makeGuest()]);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function updateGuest(id, field, value) {
    setGuests((list) => list.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  }

  function addGuest() {
    setGuests((list) => [...list, makeGuest()]);
  }

  function removeGuest(id) {
    setGuests((list) => (list.length > 1 ? list.filter((g) => g.id !== id) : list));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const incomplete = guests.some((g) => !g.fullName.trim() || !g.dni.trim());
    if (incomplete) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      await submitRsvp(guests);
      setStatus('success');
      setGuests([makeGuest()]);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="rsvp flat-section" id="rsvp">
      <div ref={ref} className="rsvp__inner">
        <span className="hud-kicker">{content.kicker}</span>
        <h2 className="hud-heading rsvp__heading">{content.heading}</h2>
        <p className="rsvp__description">{content.description}</p>

        {status === 'success' ? (
          <div className="rsvp__success hud-panel">
            <HudCorners />
            <p>{content.successMessage}</p>
          </div>
        ) : (
          <form className="rsvp__form" onSubmit={handleSubmit} noValidate>
            {guests.map((guest, index) => (
              <div className="rsvp__guest hud-panel" key={guest.id}>
                <HudCorners />

                <div className="rsvp__guest-header">
                  <span className="rsvp__guest-title">
                    {content.guestLabel} {index + 1}
                  </span>
                  {guests.length > 1 && (
                    <button
                      type="button"
                      className="rsvp__guest-remove"
                      onClick={() => removeGuest(guest.id)}
                    >
                      {content.removeGuestLabel}
                    </button>
                  )}
                </div>

                <div className="rsvp__field">
                  <label className="rsvp__label" htmlFor={`rsvp-name-${guest.id}`}>
                    {content.fields.name.label}
                  </label>
                  <input
                    id={`rsvp-name-${guest.id}`}
                    className="rsvp__input"
                    type="text"
                    autoComplete="name"
                    placeholder={content.fields.name.placeholder}
                    value={guest.fullName}
                    onChange={(e) => updateGuest(guest.id, 'fullName', e.target.value)}
                  />
                </div>

                <div className="rsvp__field">
                  <label className="rsvp__label" htmlFor={`rsvp-dni-${guest.id}`}>
                    {content.fields.dni.label}
                  </label>
                  <input
                    id={`rsvp-dni-${guest.id}`}
                    className="rsvp__input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={content.fields.dni.placeholder}
                    value={guest.dni}
                    onChange={(e) => updateGuest(guest.id, 'dni', e.target.value)}
                  />
                </div>

                <div className="rsvp__field">
                  <label className="rsvp__label" htmlFor={`rsvp-dietary-${guest.id}`}>
                    {content.fields.dietary.label}
                  </label>
                  <select
                    id={`rsvp-dietary-${guest.id}`}
                    className="rsvp__select"
                    value={guest.dietary}
                    onChange={(e) => updateGuest(guest.id, 'dietary', e.target.value)}
                  >
                    <option value="" disabled>
                      Elegí una opción
                    </option>
                    {content.fields.dietary.options.map((opt) => (
                      <option value={opt} key={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rsvp__field">
                  <label className="rsvp__label" htmlFor={`rsvp-song-${guest.id}`}>
                    {content.fields.song.label}
                  </label>
                  <SongSearch
                    id={`rsvp-song-${guest.id}`}
                    value={guest.song}
                    onChange={(value) => updateGuest(guest.id, 'song', value)}
                    onSelectLink={(link) => updateGuest(guest.id, 'songLink', link)}
                    placeholder={content.fields.song.placeholder}
                    content={songSearch}
                  />
                </div>
              </div>
            ))}

            <CtaButton type="button" variant="secondary" onClick={addGuest}>
              {content.addGuestLabel}
            </CtaButton>

            {status === 'error' && <p className="rsvp__error">{content.errorMessage}</p>}

            <CtaButton type="submit" variant="primary" showIcon disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Enviando…' : content.submitLabel}
            </CtaButton>
          </form>
        )}
      </div>
    </section>
  );
}

export default RsvpForm;
