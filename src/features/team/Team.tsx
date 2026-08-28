import type { TeamCollection, TeamCopy } from '../../domain/schemas/team.schema';
import { TeamMemberCard } from './TeamMemberCard';
import './Team.css';

export interface TeamProps {
  readonly members: TeamCollection;
  readonly copy: TeamCopy;
  readonly className?: string;
}

export function Team({ members, copy, className = '' }: TeamProps) {
  return (
    <div className={`team ${className}`.trim()} data-testid="team">
      <header className="team__header">
        <p className="team__eyebrow">{copy.eyebrow}</p>
        <h2 id="team-heading" className="team__heading">
          {copy.heading}
        </h2>
        <p className="team__intro">{copy.intro}</p>
      </header>

      <ul aria-label={copy.listLabel} className="team__list">
        {members.map((member) => (
          <li key={member.id} className="team__item">
            <TeamMemberCard member={member} copy={copy} />
          </li>
        ))}
      </ul>
    </div>
  );
}
