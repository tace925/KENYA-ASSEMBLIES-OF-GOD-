import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { galleryImages as defaultImages } from "../data/content";
import { store } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function Gallery() {
  const stored = store.getGallery();
  const images = stored.length > 0 ? stored : defaultImages;

  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Glimpses of
            <span className="block italic text-gold-light">grace.</span>
          </>
        }
        subtitle="Worship nights, fellowships and moments from life at the mountain."
        image="https://images.pexels.com/photos/36425621/pexels-photo-36425621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container">
          <SectionHeading eyebrow="Photo archive" title="The house in pictures" />

          {images.length === 0 ? (
            <p className="mt-12 text-mist">No gallery images yet. Admin can add them from the dashboard.</p>
          ) : (
            <div className="masonry mt-12">
              {images.map((img, i) => (
                <button
                  key={img.id || img.src + i}
                  type="button"
                  className="masonry-item w-full text-left"
                  onClick={() => setActive(i)}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className={img.tall ? "aspect-[3/4] object-cover" : "aspect-[4/3] object-cover"}
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cream">
                    {img.caption}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center border border-white/20"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <img
              src={images[active].src}
              alt={images[active].caption}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}