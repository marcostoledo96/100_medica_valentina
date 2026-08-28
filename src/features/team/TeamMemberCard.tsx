import { useState } from 'react';
import type { TeamCopy, TeamMember } from '../../domain/schemas/team.schema';

export interface TeamMemberCardProps {
  readonly member: TeamMember;
  readonly copy: TeamCopy;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

export function TeamMemberCard({ member, copy }: TeamMemberCardProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const headingId = `team-member-${member.id}-heading`;
  const photoAlt = `${copy.photoAltPrefix} ${member.name}`;
  // An unavailable photo is a materially different state than a real photo, so its
  // accessible name is composed from the unavailable-image copy instead of reusing
  // the real-photo alt formatter.
  const fallbackAlt = `${copy.imageFallback} de ${member.name}`;
  const showPhoto = member.photo !== undefined && !photoFailed;

  return (
    <article
      id={`team-member-${member.id}`}
      aria-labelledby={headingId}
      data-team-member={member.id}
      className="team-member-card"
    >
      <div aria-hidden="true" className="team-member-card__tape" />

      <div className="team-member-card__body">
        <h3 id={headingId} className="team-member-card__name">
          {member.name}
        </h3>

        <div className="team-member-card__message">
          <p className="team-member-card__field-label">{copy.messageLabel}</p>
          <p className="team-member-card__message-text">{member.message}</p>
        </div>

        <div className="team-member-card__role">
          <span className="team-member-card__field-label">{copy.roleLabel}</span>
          <span className="team-member-card__role-value">{member.role}</span>
        </div>
      </div>

      <figure className="team-member-card__media">
        {showPhoto ? (
          <img
            src={member.photo}
            alt={photoAlt}
            width="640"
            height="400"
            loading="lazy"
            decoding="async"
            onError={() => setPhotoFailed(true)}
            className="team-member-card__image"
          />
        ) : (
          <div
            role="img"
            aria-label={fallbackAlt}
            data-team-photo-fallback={member.id}
            data-testid={`team-photo-fallback-${member.id}`}
            className="team-member-card__fallback"
          >
            <span aria-hidden="true" className="team-member-card__fallback-mark">
              {getInitials(member.name)}
            </span>
            <span aria-hidden="true" className="team-member-card__fallback-label">
              {copy.imageFallback}
            </span>
          </div>
        )}
      </figure>
    </article>
  );
}
