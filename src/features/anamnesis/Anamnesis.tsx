import { useState } from 'react';
import type { AnamnesisContent } from '../../domain/schemas/anamnesis.schema';
import './Anamnesis.css';

export interface AnamnesisProps {
  readonly content: AnamnesisContent;
  readonly nextHref: string;
  readonly className?: string;
}

export function Anamnesis({ content, nextHref, className = '' }: AnamnesisProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = content.photo !== undefined && !photoFailed;

  return (
    <div data-testid="anamnesis" className={`anamnesis ${className}`.trim()}>
      <header className="anamnesis__header">
        <p className="anamnesis__eyebrow">{content.eyebrow}</p>
        <h2 id="anamnesis-heading" className="anamnesis__heading">
          {content.heading}
        </h2>
        <p className="anamnesis__intro">{content.intro}</p>
      </header>

      <div
        className={`anamnesis__body${showPhoto ? ' anamnesis__body--with-photo' : ''}`.trimEnd()}
      >
        {content.photo ? (
          showPhoto ? (
            <figure data-testid="anamnesis-photo" className="anamnesis__photo">
              <img
                src={content.photo.src}
                alt={content.photo.alt}
                width={content.photo.width}
                height={content.photo.height}
                loading="lazy"
                decoding="async"
                onError={() => setPhotoFailed(true)}
                className="anamnesis__photo-image"
              />
            </figure>
          ) : (
            <div
              role="img"
              aria-label={content.photoFallbackLabel}
              data-testid="anamnesis-photo-fallback"
              className="anamnesis__photo-fallback"
            >
              <span aria-hidden="true" className="anamnesis__photo-fallback-mark">
                ✕
              </span>
              <span className="anamnesis__photo-fallback-label">{content.photoFallbackLabel}</span>
            </div>
          )
        ) : null}

        <div className="anamnesis__blocks">
          {content.blocks.map((block) => (
            <div key={block.id} className="anamnesis__block">
              <h3 id={`anamnesis-block-${block.id}`} className="anamnesis__block-title">
                {block.title}
              </h3>
              <p className="anamnesis__block-body">{block.body}</p>
            </div>
          ))}
        </div>
      </div>

      {content.quote ? (
        <figure data-testid="anamnesis-quote" className="anamnesis__quote">
          <blockquote className="anamnesis__quote-text">
            <p>{content.quote.text}</p>
          </blockquote>
          {content.quote.attribution ? (
            <figcaption className="anamnesis__quote-attribution">
              <cite>{content.quote.attribution}</cite>
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <footer data-testid="anamnesis-bridge" className="anamnesis__bridge">
        <span aria-hidden="true" className="anamnesis__bridge-rule" />
        <p className="anamnesis__transition-label">{content.transitionLabel}</p>
        <a href={nextHref} className="anamnesis__cta">
          <span>{content.ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      </footer>
    </div>
  );
}
