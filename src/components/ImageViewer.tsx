import React from 'react';
import type {LightboxProps, Slide} from 'yet-another-react-lightbox';

export type ProductImage = {id: string; title: string; body: string; image: string; alt: string; width: number; height: number};
type ViewerProps = Pick<LightboxProps, 'close' | 'index' | 'on' | 'open' | 'slides'>;

const LazyLightbox = React.lazy(async () => {
  const [{default: Lightbox}, {default: Zoom}] = await Promise.all([
    import('yet-another-react-lightbox'),
    import('yet-another-react-lightbox/plugins/zoom'),
  ]);
  return {default: (props: ViewerProps): JSX.Element => <Lightbox {...props} plugins={[Zoom]} zoom={{maxZoomPixelRatio: 64, scrollToZoom: true}} />};
});

export function ImageViewerTrigger({item, onOpen, className, imageClassName, eager = false, children}: {item: ProductImage; onOpen: (item: ProductImage, opener: HTMLButtonElement) => void; className: string; imageClassName?: string; eager?: boolean; children?: React.ReactNode}): JSX.Element {
  const preview = (event: React.PointerEvent<HTMLButtonElement>): void => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--image-preview-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty('--image-preview-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };
  return <button className={className} data-testid="image-viewer-trigger" type="button" aria-label={`Inspect ${item.title}`} onPointerMove={preview} onClick={(event) => onOpen(item, event.currentTarget)}>{children ?? <img className={imageClassName} src={item.image} width={item.width} height={item.height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} alt={item.alt} />}<span>Click to inspect</span></button>;
}

export function SharedImageViewer({items, activeItem, onClose}: {items: readonly ProductImage[]; activeItem: ProductImage | null; onClose: () => void}): JSX.Element | null {
  const activeIndex = activeItem ? items.findIndex(({id}) => id === activeItem.id) : -1;
  const slides: Slide[] = items.map(({image, alt, width, height}) => ({src: image, alt, width, height}));
  if (activeIndex < 0) return null;
  return <div data-testid="image-viewer"><React.Suspense fallback={<div className="imageViewerLoading" aria-live="polite">Loading image viewer</div>}><LazyLightbox open close={onClose} index={activeIndex} slides={slides} on={{exited: onClose}} /></React.Suspense></div>;
}
