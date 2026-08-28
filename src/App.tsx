import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { expedienteCopy } from './content/expediente';
import { narrativeSections } from './content/sections';
import { profileContent } from './content/profile';
import { BootExperience } from './features/boot';
import { ExpedienteScene } from './features/expediente/ExpedienteScene';

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
            copy={expedienteCopy}
            nextHref="#linea-tiempo"
          />
        ) : (
          <StructuralScenePlaceholder section={section} />
        )
      }
    />
  );
}
