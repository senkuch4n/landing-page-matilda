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
  const { familyPhotos } = siteContent;

  return (
    <div className="page">
      <AuraScene />
      <Header brand={siteContent.brand} brandBadge={siteContent.brandBadge} {...siteContent.header} />
      <Hero hero={siteContent.hero} bottom={siteContent.bottom} event={siteContent.event} familyPhotoSrc={familyPhotos.hero} />
      <VenueRoute venue={siteContent.venue} familyPhotoSrc={familyPhotos.venue} />
      <DressCode content={siteContent.dressCode} familyPhotoSrc={familyPhotos.dressCode} />
      <RsvpForm content={siteContent.rsvp} songSearch={siteContent.songSearch} familyPhotoSrc={familyPhotos.rsvp} />
      <DeveloperCredit content={siteContent.credits} familyPhotoSrc={familyPhotos.credits} />
      <SiteFooter event={siteContent.event} credits={siteContent.credits} />
    </div>
  );
}

export default App;
