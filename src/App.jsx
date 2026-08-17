import AuraScene from './components/AuraScene';
import Header from './components/Header';
import Hero from './components/Hero';
import VenueRoute from './components/VenueRoute';
import DressCode from './components/DressCode';
import RsvpForm from './components/RsvpForm';
import DeveloperCredit from './components/DeveloperCredit';
import SiteFooter from './components/SiteFooter';
import siteContent from './content/siteContent';
import useSmoothScroll from './hooks/useSmoothScroll';
import './App.css';

function App() {
  useSmoothScroll();

  return (
    <div className="page">
      <AuraScene />
      <Header brand={siteContent.brand} brandBadge={siteContent.brandBadge} {...siteContent.header} />
      <Hero hero={siteContent.hero} bottom={siteContent.bottom} event={siteContent.event} />
      <VenueRoute venue={siteContent.venue} />
      <DressCode content={siteContent.dressCode} />
      <RsvpForm content={siteContent.rsvp} songSearch={siteContent.songSearch} />
      <DeveloperCredit content={siteContent.credits} />
      <SiteFooter event={siteContent.event} credits={siteContent.credits} />
    </div>
  );
}

export default App;
