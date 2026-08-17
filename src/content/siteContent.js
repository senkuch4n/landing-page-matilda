// Todos los textos de la invitación viven aquí.
// Cambia estos valores para reemplazar el contenido sin tocar los componentes.
const siteContent = {
  brand: 'Matilda',
  brandBadge: '15',

  header: {
    tagline: '15 años',
  },

  hero: {
    titleLines: ['Mis', '15', 'Años'],
    sideNote:
      'Una noche para brillar junto a las personas que más quiero. Los espero para celebrar juntos',
  },

  bottom: {
    kicker: 'Bienvenidos',
    copy:
      'Los invito a celebrar mis quince años el 19 de septiembre de 2026, desde las 21:00 hs, en el Salón del Colegio de Abogados de Salta.',
    primaryCta: {
      label: 'Confirmar asistencia',
      href: '#rsvp',
    },
    secondaryCta: {
      label: 'Ver detalles',
      href: '#countdown',
    },
  },

  event: {
    dateISO: '2026-09-19T21:00:00',
    endTimeLabel: '04:00',
    kicker: 'Cuenta regresiva',
    heading: 'Faltan',
    labels: {
      days: 'Días',
      hours: 'Horas',
      minutes: 'Min',
      seconds: 'Seg',
    },
  },

  venue: {
    kicker: '¿Dónde?',
    heading: 'Te espero acá',
    name: 'Salón del Colegio de Abogados de Salta',
    address: 'Av. Circunvalación Oeste km 3,4400, Salta, Argentina',
    directionsHref:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent('Colegio de Abogados de Salta, Av. Circunvalación Oeste km 3,4400, Salta, Argentina'),
    mapEmbedSrc:
      'https://maps.google.com/maps?q=' +
      encodeURIComponent('Colegio de Abogados de Salta, Av. Circunvalación Oeste km 3,4400, Salta, Argentina') +
      '&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directionsLabel: 'Cómo llegar',
    // Fotos para el recorrido 3D (alrededores + interior del salón).
    photos: [
      { src: '/photos_salon/salon_1.webp', alt: 'Mesas puestas en el salón' },
      { src: '/photos_salon/salon_2.webp', alt: 'Salón decorado para una fiesta' },
      { src: '/photos_salon/salon_3.webp', alt: 'Entrada del salón de noche' },
      { src: '/photos_salon/salon_4.webp', alt: 'Fachada del salón de día' },
    ],
  },

  dressCode: {
    kicker: 'Dress code',
    heading: 'Gala',
    note: 'El color claro se reserva para la quinceañera.',
  },

  rsvp: {
    kicker: 'Confirmá tu asistencia',
    heading: 'Quienes van?',
    description: 'Sumá a los invitados que te van a acompañar y contanos algunos datos de cada uno.',
    guestLabel: 'Invitado',
    addGuestLabel: '+ Agregar invitado',
    removeGuestLabel: 'Quitar',
    fields: {
      name: { label: 'Nombre y apellido', placeholder: 'Nombre y apellido' },
      dni: { label: 'DNI', placeholder: 'Número de DNI' },
      dietary: {
        label: 'Requerimiento alimentario',
        options: ['Ninguno', 'Vegetariano', 'Vegano', 'Celíaco / sin TACC', 'Otro'],
      },
      song: { label: 'Sugerí una canción', placeholder: 'Buscá una canción o artista' },
    },
    submitLabel: 'Confirmar asistencia',
    successMessage: '¡Gracias! Ya confirmamos su lugar en la fiesta 🎉',
    errorMessage: 'Completá nombre y DNI de cada invitado para continuar.',
  },

  // Buscador de canciones integrado (per invitado). Usa la YouTube Data API v3
  // (VITE_YOUTUBE_API_KEY en .env) para mostrar resultados sin salir de la página.
  // Spotify no ofrece esto de forma segura sin backend, así que queda como link directo.
  songSearch: {
    spotifySearchBase: 'https://open.spotify.com/search/',
    spotifyLinkLabel: 'Buscar en Spotify',
    loadingLabel: 'Buscando…',
    noResultsLabel: 'Sin resultados',
    noApiKeyHint: 'Búsqueda integrada no configurada — abrí la búsqueda en una pestaña nueva.',
    openInYoutube: 'Abrir búsqueda en YouTube',
  },


  // Fotos de Matilda y su familia, usadas como collage decorativo
  // semitransparente repartido por distintas secciones de la página
  // (sólo se ven en pantallas anchas, en mobile se ocultan).
  familyPhotos: {
    hero: '/photos_family/foto_4.jpeg',
    venue: '/photos_family/foto_3.jpeg',
    dressCode: '/photos_family/foto_2.jpeg',
    rsvp: '/photos_family/foto_1.jpeg',
    credits: '/photos_family/foto_5.jpeg',
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
