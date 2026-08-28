import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { BootExperience } from './features/boot';
import { narrativeSections } from './content/sections';

export default function App() {
  return (
    <NarrativeShell
      sections={narrativeSections}
      renderSection={(section) =>
        section.id === 'inicio' ? (
          <BootExperience />
        ) : (
          <StructuralScenePlaceholder section={section} />
        )
      }
    />
  );
}
