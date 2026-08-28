import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { expedienteContent } from './content/expediente';
import { narrativeSections } from './content/sections';
import { statsContent } from './content/stats';
import { profileContent } from './content/profile';
import { timelineContent } from './content/timeline';
import { BootExperience } from './features/boot';
import { ExpedienteScene } from './features/expediente/ExpedienteScene';
import { Gallery } from './features/gallery';
import { Timeline } from './features/timeline';
import { VitalSigns } from './features/vitales';

export default function App() {
  return (
    <NarrativeShell
      sections={narrativeSections}
      renderSection={(section) =>
        section.id === 'inicio' ? (
          <BootExperience />
        ) : section.id === 'expediente' ? (
          <ExpedienteScene
            profile={profileContent}
            copy={expedienteContent}
            nextHref="#signos-vitales"
          />
        ) : section.id === 'signos-vitales' ? (
          <VitalSigns stats={statsContent} heading={section.label} />
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
