import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { anamnesisContent } from './content/anamnesis';
import { expedienteContent } from './content/expediente';
import { narrativeSections } from './content/sections';
import { statsContent } from './content/stats';
import { profileContent } from './content/profile';
import { timelineContent } from './content/timeline';
import { teamContent } from './content/team';
import { BootExperience } from './features/boot';
import { Anamnesis } from './features/anamnesis';
import { ExpedienteScene } from './features/expediente/ExpedienteScene';
import { Gallery } from './features/gallery';
import { Timeline } from './features/timeline';
import { Team } from './features/team';
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
            nextHref="#anamnesis"
          />
        ) : section.id === 'anamnesis' ? (
          <Anamnesis content={anamnesisContent} nextHref="#signos-vitales" />
        ) : section.id === 'signos-vitales' ? (
          <VitalSigns stats={statsContent} heading={section.label} />
        ) : section.id === 'linea-tiempo' ? (
          <Timeline entries={timelineContent} heading={section.label} />
        ) : section.id === 'galeria' ? (
          <Gallery />
        ) : section.id === 'equipo-tratante' ? (
          <Team members={teamContent.members} copy={teamContent.copy} />
        ) : (
          <StructuralScenePlaceholder section={section} />
        )
      }
    />
  );
}
