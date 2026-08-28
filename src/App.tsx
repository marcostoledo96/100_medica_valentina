import { NarrativeShell } from './components/layout/NarrativeShell';
import { StructuralScenePlaceholder } from './components/showcase/StructuralScenePlaceholder';
import { narrativeSections } from './content/sections';

export default function App() {
  return (
    <NarrativeShell
      sections={narrativeSections}
      renderSection={(section) => <StructuralScenePlaceholder section={section} />}
    />
  );
}
