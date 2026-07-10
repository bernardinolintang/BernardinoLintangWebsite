import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CardImageCarouselProps = {
  images: string[];
  alt: string;
  imgPos?: string;
  imagePositions?: string[];
};

export function CardImageCarousel({ images, alt, imgPos, imagePositions }: CardImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  if (images.length === 0) return null;

  if (!multi) {
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
                alt={`${alt} — photo ${i + 1} of ${images.length}`}
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
