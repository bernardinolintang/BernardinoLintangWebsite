import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type CardImageCarouselProps = {
  images: string[];
  alt: string;
  imgPos?: string;
  imagePositions?: string[];
  fit?: "cover" | "contain";
};

export function CardImageCarousel({ images, alt, imgPos, imagePositions, fit }: CardImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const multi = images.length > 1;

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  if (images.length === 0) return null;

  if (!multi) {
    if (fit === "contain") {
      return (
        <>
          <div
            className="al-card-portrait"
            role="button"
            tabIndex={0}
            aria-label={`Expand image: ${alt}`}
            onClick={() => setLightboxOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxOpen(true);
              }
            }}
          >
            <img src={images[0]} alt="" aria-hidden="true" loading="lazy" className="al-card-portrait__bg" />
            <img
              src={images[0]}
              alt={alt}
              loading="lazy"
              className="al-card-portrait__fg"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
            <span className="al-card-portrait__hint" aria-hidden="true">
              <Maximize2 size={14} strokeWidth={2.25} />
            </span>
          </div>
          {lightboxOpen &&
            createPortal(
              <>
                <div className="al-modal-overlay al-lightbox-overlay" onClick={() => setLightboxOpen(false)} />
                <div className="al-modal al-lightbox" role="dialog" aria-modal="true" aria-label={alt}>
                  <button className="al-modal-close" aria-label="Close" onClick={() => setLightboxOpen(false)}>×</button>
                  <img src={images[0]} alt={alt} className="al-lightbox__img" />
                </div>
              </>,
              document.body,
            )}
        </>
      );
    }
    return (
      <img
        src={images[0]}
        alt={alt}
        loading="lazy"
        style={imgPos ? { objectPosition: imgPos } : undefined}
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
      />
    );
  }

  return (
    <div className="al-card-carousel">
      <div className="al-card-carousel__viewport" ref={emblaRef}>
        <div className="al-card-carousel__track">
          {images.map((src, i) => {
            const position = imagePositions?.[i] ?? imgPos;
            return (
            <div className="al-card-carousel__slide" key={src}>
              <img
                src={src}
                alt={`${alt}, photo ${i + 1} of ${images.length}`}
                loading={i === 0 ? "eager" : "lazy"}
                style={position ? { objectPosition: position } : undefined}
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="al-card-carousel__btn al-card-carousel__btn--prev"
        onClick={scrollPrev}
        aria-label="Previous image"
      >
        <ChevronLeft size={18} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="al-card-carousel__btn al-card-carousel__btn--next"
        onClick={scrollNext}
        aria-label="Next image"
      >
        <ChevronRight size={18} strokeWidth={2.25} />
      </button>
      <div className="al-card-carousel__dots" aria-hidden>
        {images.map((_, i) => (
          <span key={i} className={i === selectedIndex ? "active" : ""} />
        ))}
      </div>
    </div>
  );
}
