import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PresentationMode } from './components/PresentationMode';
import { StoryPresentationMode } from './components/StoryPresentationMode';
import './styles.css';

const data = JSON.parse(document.getElementById('presentation-data').textContent);
window.__AHM_PORTABLE__ = true;
function PortableApp() {
  const [view, setView] = useState(location.hash);
  useEffect(() => {
    const update = () => setView(location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return view === '#story' ? <StoryPresentationMode data={data} /> : <PresentationMode data={data} />;
}
createRoot(document.getElementById('root')).render(<PortableApp />);
