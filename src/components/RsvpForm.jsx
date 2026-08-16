import { useState } from 'react';
import CtaButton from './CtaButton';
import HudCorners from './HudCorners';
import useScrollReveal from '../hooks/useScrollReveal';
import './RsvpForm.css';

const initialValues = { fullName: '', age: '' };

// Punto único donde se envían las respuestas. Por ahora sólo guarda
// localmente (y loguea) — conectá acá tu backend real cuando lo tengas:
// Formspree, Google Sheets (Apps Script), un endpoint propio, etc.
// Ejemplo con Formspree:
//   await fetch('https://formspree.io/f/TU_ID', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
async function submitRsvp(data) {
  console.info('[RSVP] Nueva confirmación', data);
  return Promise.resolve();
}

function RsvpForm({ content }) {
  const ref = useScrollReveal();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function handleChange(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!values.fullName.trim() || !values.age.trim()) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      await submitRsvp(values);
      setStatus('success');
      setValues(initialValues);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="rsvp" id="rsvp">
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
          <form className="rsvp__form hud-panel" onSubmit={handleSubmit} noValidate>
            <HudCorners />
            <div className="rsvp__field">
              <label className="rsvp__label" htmlFor="rsvp-name">
                {content.fields.name.label}
              </label>
              <input
                id="rsvp-name"
                className="rsvp__input"
                type="text"
                autoComplete="name"
                placeholder={content.fields.name.placeholder}
                value={values.fullName}
                onChange={handleChange('fullName')}
              />
            </div>

            <div className="rsvp__field">
              <label className="rsvp__label" htmlFor="rsvp-age">
                {content.fields.age.label}
              </label>
              <input
                id="rsvp-age"
                className="rsvp__input"
                type="number"
                min="0"
                max="120"
                inputMode="numeric"
                placeholder={content.fields.age.placeholder}
                value={values.age}
                onChange={handleChange('age')}
              />
            </div>

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
