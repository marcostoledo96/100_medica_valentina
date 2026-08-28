import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { timelineContent } from './content/timeline';
import { narrativeSections } from './content/sections';
import { BootExperience } from './features/boot';
import { Gallery } from './features/gallery';
import { Timeline } from './features/timeline';

export default function App() {
  return (
    <NarrativeShell
      sections={narrativeSections}
      renderSection={(section) =>
        section.id === 'inicio' ? (
          <BootExperience />
        ) : section.id === 'linea-tiempo' ? (
          <Timeline entries={timelineContent} heading={section.label} />
        ) : section.id === 'galeria' ? (
          <Gallery />
        ) : (
          <StructuralScenePlaceholder section={section} />
        )
      }
    />
  );
}
