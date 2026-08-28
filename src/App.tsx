import { NarrativeShell } from './components/layout/NarrativeShell';
import { narrativeSections } from './content/sections';

export default function App() {
  return <NarrativeShell sections={narrativeSections} />;
}
