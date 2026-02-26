import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
      className="relative py-24 overflow-hidden bg-zinc-950"
    >
      {/* ── Background ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,119,198,0.07),transparent)]" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Heading ───────────────────────────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-3xl font-semibold text-center text-white mb-14 tracking-tight"
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
              style={{ background: "linear-gradient(to right, rgb(9 9 11), transparent)" }}
              aria-hidden
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-12 md:w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, rgb(9 9 11), transparent)" }}
              aria-hidden
            />

            {/* EMBLA VIEWPORT — only clipping happens here */}
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4 md:gap-5">
                {testimonials.map((testimonial, index) => {
                  const isActive = selectedIndex === index;
                  return (
                    <div
                      key={testimonial.name}
                      className="flex-[0_0_84%] md:flex-[0_0_68%] min-w-0"
                    >
                      <motion.div
                        animate={{
                          scale:   isActive ? 1    : 0.95,
                          opacity: isActive ? 1    : 0.45,
                        }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => !isActive && scrollTo(index)}
                        tabIndex={isActive ? -1 : 0}
                        role="button"
                        aria-label={isActive ? undefined : `Go to ${testimonial.name} testimonial`}
                        onKeyDown={(e) => { if (!isActive && e.key === "Enter") scrollTo(index); }}
                        className="relative rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 transition-shadow duration-300 hover:shadow-2xl"
                      >
                        {/* Active glow */}
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
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent pointer-events-none"
                          aria-hidden
                        />

                        <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center">

                          {/* ── FIXED IMAGE CONTAINER — always h-32, never distorts layout */}
                          <div className="h-28 w-full flex items-center justify-center mb-7 flex-shrink-0">
                            <div className="h-28 w-28 rounded-2xl overflow-hidden border border-zinc-700/80 bg-white flex items-center justify-center p-2.5 shadow-sm">
                              <ImageWithFallback
                                src={testimonial.image}
                                alt={`${testimonial.name} logo`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </div>

                          {/* ── Name */}
                          <h3 className="text-xl md:text-2xl font-semibold text-white leading-snug mb-1.5">
                            {testimonial.name}
                          </h3>

                          {/* ── Date */}
                          <p className="text-sm text-zinc-500 mb-6">{testimonial.date}</p>

                          {/* Divider */}
                          <div
                            className="w-10 h-px mb-6 flex-shrink-0"
                            style={{ background: "linear-gradient(to right, transparent, rgba(113,113,122,0.6), transparent)" }}
                            aria-hidden
                          />

                          {/* ── FIXED TEXT AREA — min-h prevents arrow drift between slides */}
                          <div className="min-h-[180px] flex items-start justify-center w-full">
                            <AnimatePresence mode="wait">
                              {isActive && (
                                <motion.p
                                  key={`text-${testimonial.name}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.38, delay: 0.08, ease: "easeOut" }}
                                  className="text-[0.9375rem] leading-[1.85] text-zinc-300 max-w-prose"
                                >
                                  {testimonial.text.trim()}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            {!isActive && (
                              <p
                                className="text-[0.9375rem] leading-[1.85] text-zinc-300 max-w-prose opacity-0 select-none pointer-events-none"
                                aria-hidden
                              >
                                {testimonial.text.trim()}
                              </p>
                            )}
                          </div>

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
            className="z-20 flex w-10 h-10 rounded-full items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 hover:border-zinc-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="z-20 flex w-10 h-10 rounded-full items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 hover:border-zinc-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
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
              className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                selectedIndex === index
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" aria-hidden />
    </section>
  );
}
