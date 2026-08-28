import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { GalleryCollection, GalleryCopy } from '../../domain/types';
import { Gallery } from './Gallery';

const galleryCopyFixture: GalleryCopy = {
  eyebrow: 'Estudios complementarios',
  heading: 'Galería',
  intro: 'Una pausa visual para registrar las pequeñas pruebas de todo el recorrido.',
  carouselLabel: 'Estudios complementarios',
  instruction: 'Deslizá para explorar. Tocá una imagen para verla en detalle.',
  openImage: 'Abrir imagen',
  imageFallback: 'Imagen no disponible',
  findingLabel: 'Hallazgo',
  dialogEyebrow: 'Vista ampliada',
  close: 'Cerrar galería',
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
};

const galleryFixture: GalleryCollection = [
  {
    id: 'gallery-test-01',
    image: '/images/demo/gallery-01.webp',
    date: '2024-05',
    title: 'Estudio de imagen completo',
    finding: 'Hallazgo clínico completo.',
    caption: 'Una nota de archivo.',
    alt: 'Instrumental médico sobre una mesa de laboratorio.',
  },
  {
    id: 'gallery-test-02',
    image: '/images/demo/gallery-02.webp',
    date: '2025-02',
    title: 'Estudio de imagen mínimo',
    alt: 'Placa radiográfica ilustrativa.',
  },
  {
    id: 'gallery-test-03',
    image: '/images/demo/gallery-01.webp',
    title: 'Estudio con hallazgo',
    finding: 'Hallazgo aislado de prueba.',
    alt: 'Detalle de una muestra médica.',
  },
];

const firstItem = galleryFixture[0]!;
const secondItem = galleryFixture[1]!;
const thirdItem = galleryFixture[2]!;

function renderGallery() {
  return render(<Gallery items={galleryFixture} copy={galleryCopyFixture} />);
}

describe('Gallery', () => {
  it('renders injected copy and items without a structural placeholder', () => {
    const injectedCopy: GalleryCopy = {
      ...galleryCopyFixture,
      heading: 'Injected gallery heading',
      intro: 'Injected gallery introduction.',
      openImage: 'Inspect injected image',
      instruction: 'Injected gallery instruction.',
    };
    const injectedItem = {
      ...firstItem,
      id: 'injected-gallery-item',
      title: 'Injected gallery item',
    };

    render(<Gallery items={[injectedItem]} copy={injectedCopy} />);

    expect(screen.getByRole('heading', { level: 2, name: injectedCopy.heading })).toBeVisible();
    expect(screen.getByText(injectedCopy.intro)).toBeVisible();
    expect(
      screen.getByRole('button', { name: `${injectedCopy.openImage}: ${injectedItem.title}` })
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: injectedItem.title })).toBeVisible();
    expect(screen.getByText(injectedCopy.instruction)).toBeVisible();
    expect(screen.queryByText('Contenido estructural de demostración.')).not.toBeInTheDocument();
  });

  it('renders every image field and omits optional fields without empty placeholders', () => {
    renderGallery();

    expect(screen.getByRole('heading', { level: 2, name: 'Galería' })).toBeVisible();
    expect(screen.getByText(firstItem.date!)).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: firstItem.title })).toBeVisible();
    expect(screen.getByText(firstItem.finding!)).toBeVisible();
    expect(screen.getByText(firstItem.caption!)).toBeVisible();

    const minimalCard = screen
      .getByRole('heading', { level: 3, name: secondItem.title })
      .closest('[data-gallery-slide]');
    expect(minimalCard).not.toBeNull();
    expect((minimalCard as HTMLElement).querySelector('time')).toHaveTextContent(secondItem.date!);
    expect(within(minimalCard as HTMLElement).queryByText(secondItem.title)).toBeVisible();
    expect(
      within(minimalCard as HTMLElement).queryByText(firstItem.finding!)
    ).not.toBeInTheDocument();
    expect(
      within(minimalCard as HTMLElement).queryByText(firstItem.caption!)
    ).not.toBeInTheDocument();

    const findingCard = screen
      .getByRole('heading', { level: 3, name: thirdItem.title })
      .closest('[data-gallery-slide]');
    expect(findingCard).not.toBeNull();
    expect(within(findingCard as HTMLElement).getByText(thirdItem.finding!)).toBeVisible();
  });

  it('uses local lazy images, stable semantic triggers, and accessible alternative text', () => {
    renderGallery();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(galleryFixture.length);
    expect(images.map((image) => image.getAttribute('alt'))).toEqual(
      galleryFixture.map((item) => item.alt)
    );
    expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
    expect(images.every((image) => image.getAttribute('decoding') === 'async')).toBe(true);

    const triggers = screen.getAllByRole('button', { name: /Abrir imagen:/i });
    expect(triggers).toHaveLength(galleryFixture.length);
    expect(triggers[0]).toHaveAttribute('aria-haspopup', 'dialog');
    expect(triggers[0]).toHaveAttribute('aria-controls', 'gallery-lightbox');
    expect(triggers[0]).toHaveAttribute('data-gallery-trigger', firstItem.id);
  });

  it('opens a labelled modal, locks the background, and restores the exact trigger focus', async () => {
    const user = userEvent.setup();
    renderGallery();

    const trigger = screen.getByRole('button', { name: `Abrir imagen: ${firstItem.title}` });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'gallery-dialog-title-gallery-test-01');
    expect(dialog).toHaveAttribute('data-gallery-current-id', firstItem.id);
    expect(screen.getByRole('heading', { level: 2, name: firstItem.title })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cerrar galería' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('[aria-hidden="true"][inert]')).not.toBeNull();

    const modalImage = within(dialog).getByRole('img', { name: firstItem.alt });
    expect(modalImage).toHaveAttribute('loading', 'eager');
    expect(modalImage).toHaveAttribute('decoding', 'async');

    await user.click(screen.getByRole('button', { name: 'Cerrar galería' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('supports previous/next controls, arrow keys, Escape, and an explicit focus trap', async () => {
    const user = userEvent.setup();
    renderGallery();

    const firstTrigger = screen.getByRole('button', { name: `Abrir imagen: ${firstItem.title}` });
    await user.click(firstTrigger);
    const dialog = screen.getByRole('dialog');
    const closeButton = screen.getByRole('button', { name: 'Cerrar galería' });
    const nextButton = screen.getByRole('button', { name: 'Imagen siguiente' });
    const previousButton = screen.getByRole('button', { name: 'Imagen anterior' });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    await user.tab();
    expect(nextButton).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();
    await user.tab({ shift: true });
    expect(nextButton).toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement | null);

    await user.keyboard('{ArrowRight}');
    expect(dialog).toHaveAttribute('data-gallery-current-id', secondItem.id);
    expect(screen.getByRole('heading', { level: 2, name: secondItem.title })).toBeVisible();
    expect(previousButton).toBeEnabled();

    await user.click(previousButton);
    expect(dialog).toHaveAttribute('data-gallery-current-id', firstItem.id);
    await user.keyboard('{ArrowLeft}');
    expect(dialog).toHaveAttribute('data-gallery-current-id', firstItem.id);

    const positiveTabIndices = Array.from(document.querySelectorAll('[tabindex]'))
      .map((element) => Number(element.getAttribute('tabindex')))
      .filter((tabIndex) => tabIndex > 0);
    expect(positiveTabIndices).toEqual([]);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(firstTrigger).toHaveFocus();
  });

  it('renders a labelled visual fallback when an image cannot load', () => {
    renderGallery();

    const image = screen.getByRole('img', { name: firstItem.alt });
    fireEvent.error(image);

    expect(screen.getByRole('img', { name: firstItem.alt })).toHaveAttribute(
      'data-gallery-image-fallback',
      firstItem.id
    );
    expect(screen.getByText('Imagen no disponible')).toBeVisible();
  });
});
