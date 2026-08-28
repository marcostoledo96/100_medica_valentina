import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { ExpedienteScene } from './features/expediente/ExpedienteScene';
import { expedienteCopy } from './content/expediente';
import { profileContent } from './content/profile';
import { narrativeSections } from './content/sections';

export default function App() {
  return (
    <NarrativeShell
      sections={narrativeSections}
      renderSection={(section) =>
        section.id === 'expediente' ? (
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
