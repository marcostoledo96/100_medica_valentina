import { ExperiencePhaseProvider } from './components/ui/ExperiencePhase/ExperiencePhaseProvider';
import { DesignSystemShowcase } from './components/showcase/DesignSystemShowcase';

export default function App() {
  return (
    <ExperiencePhaseProvider as="div" className="min-h-screen">
      <DesignSystemShowcase />
    </ExperiencePhaseProvider>
  );
}
