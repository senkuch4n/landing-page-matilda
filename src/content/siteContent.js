// Todos los textos de la invitación viven aquí.
// Cambia estos valores para reemplazar el contenido sin tocar los componentes.
const siteContent = {
  brand: 'Matilda',
  brandBadge: '15',

  header: {
    tagline: 'Quince años',
    soundOnLabel: 'Música',
    soundOffLabel: 'silencio',
  },

  hero: {
    titleLines: ['Mis', 'Quince', 'Años'],
    sideNote:
      'Una noche para brillar junto a las personas que más quiero. Los espero para celebrar juntos',
  },

  bottom: {
    kicker: 'Bienvenidos',
    copy:
      'Los invito a celebrar mis quince años. [fecha, el horario y el lugar del evento].',
    primaryCta: {
      label: 'Confirmar asistencia',
      href: '#rsvp',
    },
    secondaryCta: {
      label: 'Ver detalles',
      href: '#countdown',
    },
  },

  // TODO: reemplazar por la fecha y hora reales del evento.
  event: {
    dateISO: '2026-11-14T20:00:00',
    kicker: 'Cuenta regresiva',
    heading: 'Faltan',
    labels: {
      days: 'Días',
      hours: 'Horas',
      minutes: 'Min',
      seconds: 'Seg',
    },
  },

  rsvp: {
    kicker: 'Confirmá tu asistencia',
    heading: 'Guardate un lugar',
    description: 'Completá tus datos para confirmar que vas a estar en la fiesta.',
    fields: {
      name: { label: 'Nombre completo', placeholder: 'Tu nombre y apellido' },
      age: { label: 'Edad', placeholder: 'Tu edad' },
    },
    submitLabel: 'Confirmar asistencia',
    successMessage: '¡Gracias! Ya confirmamos tu lugar en la fiesta 🎉',
    errorMessage: 'Completá todos los campos para continuar.',
  },

  // Agregá acá las fotos del salón cuando las tengas, por ejemplo:
  // { src: '/venue/salon-1.jpg', alt: 'Vista general del salón' }
  gallery: {
    kicker: 'El lugar',
    heading: 'Así es el salón',
    description: 'Muy pronto vamos a subir las fotos del lugar donde festejamos.',
    photos: [],
  },

  credits: {
    kicker: 'Detrás de esta invitación',
    nameLines: ['Joel Miguel', 'Serrudo'],
    role: 'Desarrollador',
    location: 'Salta, Argentina',
    bio: 'Si querés una invitación así para tu propio evento, podes escribirme.',
    links: {
      github: 'https://github.com/senkuch4n',
      linkedin: 'https://www.linkedin.com/in/joel-serrudo-463731234/',
      email: 'joelserrudo@gmail.com',
      phone: '+5493875043021',
      phoneLabel: '+54 9 387 504 3021',
    },
  },
};

export default siteContent;
