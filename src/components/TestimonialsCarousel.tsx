import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const TEXT_CLAMP_LINES = 10;
const CARD_COLLAPSED_HEIGHT = 380;
const SHOW_MORE_CHAR_THRESHOLD = 700;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  title: string;
  date: string;
  image: string;
  text: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedSlides, setExpandedSlides] = useState<Record<number, boolean>>({});
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Navigation callbacks
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // Sync selected index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  // Autoplay — pause on hover
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (isHovered) return;
    autoplayRef.current = setInterval(() => emblaApi?.scrollNext(), 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [emblaApi, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scrollPrev, scrollNext]);

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="relative py-24 overflow-hidden bg-background"
    >
      {/* ── Background ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,119,198,0.07),transparent)]" />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '1px', background: 'linear-gradient(to right, transparent, var(--border), transparent)' }} aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Heading ───────────────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-3xl font-semibold text-center tracking-tight"
          style={{ marginBottom: '3rem', color: 'var(--foreground)' }}
        >
          Testimonials
        </motion.h2>

        {/* ── Gold-standard structure ────────────────────────────────────
              Layer 1: motion.div — fade-in animation only, no padding
              Layer 2: relative max-w-4xl — STABLE anchor for arrows
              Layer 3: overflow-hidden — ONLY the slider clips here
              Arrows live in Layer 2, never touched by slide width
        ──────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* ── CARD CONTAINER ─────────────────────────────────────── */}
          <div className="relative max-w-4xl mx-auto">

            {/* Edge fade masks — relative to overflow viewport */}
            <div
              className="absolute left-0 top-0 bottom-0 w-12 md:w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
              aria-hidden
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-12 md:w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
              aria-hidden
            />

            {/* EMBLA VIEWPORT — only clipping happens here */}
            <div ref={emblaRef} className="overflow-hidden">
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                {testimonials.map((testimonial, index) => {
                  const isActive = selectedIndex === index;
                  const isExpanded = expandedSlides[index] ?? false;
                  const isLongText = testimonial.text.trim().length > SHOW_MORE_CHAR_THRESHOLD;
                  return (
                    <div
                      key={testimonial.name}
                      style={{ flex: '0 0 540px', maxWidth: '88vw', minWidth: 0 }}
                    >
                      <motion.div
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => !isActive && scrollTo(index)}
                        tabIndex={isActive ? -1 : 0}
                        role="button"
                        aria-label={isActive ? undefined : `Go to ${testimonial.name} testimonial`}
                        onKeyDown={(e) => { if (!isActive && e.key === "Enter") scrollTo(index); }}
                        className="relative rounded-2xl border bg-card shadow-xl overflow-hidden cursor-pointer outline-none transition-shadow duration-300 hover:shadow-2xl"
                        style={{
                          height: isExpanded ? 'auto' : `${CARD_COLLAPSED_HEIGHT}px`,
                          minHeight: `${CARD_COLLAPSED_HEIGHT}px`,
                          transition: 'height 300ms ease',
                        }}
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              key="glow"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
                              aria-hidden
                            />
                          )}
                        </AnimatePresence>
                        <div
                          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '1px', background: 'linear-gradient(to right, transparent, var(--border), transparent)', pointerEvents: 'none' }}
                          aria-hidden
                        />

                        <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                          {/* Header: logo + name/date in a row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem', flexShrink: 0 }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', overflow: 'hidden', border: '1px solid rgba(63,63,70,0.8)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', flexShrink: 0 }}>
                              <ImageWithFallback
                                src={testimonial.image}
                                alt={`${testimonial.name} logo`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3, marginBottom: '0.125rem' }}>
                                {testimonial.name}
                              </h3>
                              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                                {testimonial.title} · {testimonial.date}
                              </p>
                            </div>
                          </div>

                          {/* Divider */}
                          <div
                            style={{ width: '100%', height: '1px', marginBottom: '0.875rem', flexShrink: 0, background: 'linear-gradient(to right, transparent, rgba(113,113,122,0.3), transparent)' }}
                            aria-hidden
                          />

                          {/* Testimonial text */}
                          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                            <AnimatePresence mode="wait">
                              {isActive && (
                                <motion.p
                                  key={`text-${testimonial.name}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.38, delay: 0.08, ease: "easeOut" }}
                                  style={{
                                    fontSize: '0.8625rem',
                                    lineHeight: 1.8,
                                    color: 'var(--muted-foreground)',
                                    ...(!isExpanded ? {
                                      display: '-webkit-box',
                                      WebkitLineClamp: TEXT_CLAMP_LINES,
                                      WebkitBoxOrient: 'vertical' as const,
                                      overflow: 'hidden',
                                    } : {}),
                                  }}
                                >
                                  {testimonial.text.trim()}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            {!isActive && (
                              <p
                                style={{
                                  fontSize: '0.8625rem',
                                  lineHeight: 1.8,
                                  color: 'var(--muted-foreground)',
                                  opacity: 0,
                                  userSelect: 'none',
                                  pointerEvents: 'none',
                                  display: '-webkit-box',
                                  WebkitLineClamp: TEXT_CLAMP_LINES,
                                  WebkitBoxOrient: 'vertical' as const,
                                  overflow: 'hidden',
                                }}
                                aria-hidden
                              >
                                {testimonial.text.trim()}
                              </p>
                            )}
                          </div>

                          {/* Show more / less button */}
                          {isActive && isLongText && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedSlides(prev => ({ ...prev, [index]: !isExpanded }));
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                marginTop: '0.75rem',
                                padding: 0,
                                border: 'none',
                                background: 'none',
                                color: 'var(--muted-foreground)',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'color 150ms',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                            >
                              {isExpanded ? (
                                <>Show less <ChevronUp style={{ width: '0.875rem', height: '0.875rem' }} /></>
                              ) : (
                                <>Show more <ChevronDown style={{ width: '0.875rem', height: '0.875rem' }} /></>
                              )}
                            </button>
                          )}

                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Centered arrow buttons ────────────────────────────────────── */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="z-20 flex w-10 h-10 rounded-full items-center justify-center border bg-card text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="z-20 flex w-10 h-10 rounded-full items-center justify-center border bg-card text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Pagination dots ─────────────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Testimonial slide navigation"
          className="flex justify-center items-center gap-2 mt-4"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={selectedIndex === index
                ? { width: '1.25rem', height: '0.375rem', backgroundColor: 'var(--foreground)' }
                : { width: '0.375rem', height: '0.375rem', backgroundColor: 'var(--muted-foreground)' }
              }
            />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '1px', background: 'linear-gradient(to right, transparent, var(--border), transparent)' }} aria-hidden />
    </section>
  );
}
