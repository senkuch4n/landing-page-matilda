import AuraScene from './components/AuraScene';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import RsvpForm from './components/RsvpForm';
import VenueGallery from './components/VenueGallery';
import siteContent from './content/siteContent';
import useSmoothScroll from './hooks/useSmoothScroll';
import './App.css';

function App() {
  useSmoothScroll();

  return (
    <div className="page">
      <AuraScene />
      <Header brand={siteContent.brand} brandBadge={siteContent.brandBadge} {...siteContent.header} />
      <Hero hero={siteContent.hero} bottom={siteContent.bottom} />
      <Countdown event={siteContent.event} />
      <RsvpForm content={siteContent.rsvp} />
      <VenueGallery content={siteContent.gallery} />
    </div>
  );
}

export default App;
