import { useEffect } from "react";

/**
 * InteractionLayer
 *
 * Activates premium public-page interactions that are intentionally data/class-driven:
 * - `.lp-reveal` → IntersectionObserver reveal on scroll
 * - `[data-magnetic]` / `.lp-magnetic` → subtle cursor-proximity pull + spotlight
 * - `[data-parallax]` → lightweight scroll-linked vertical drift
 *
 * Reduced motion is fully respected.
 */
export function InteractionLayer() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(".lp-reveal"));
    revealTargets.forEach((el) => {
      if (el.dataset.revealReady === "true") return;
      el.dataset.revealReady = "true";
    });

    if (prefersReducedMotion) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      return () => {
        revealTargets.forEach((el) => delete el.dataset.revealReady);
      };
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealTargets.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      revealObserver.observe(el);
    });

    const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanupFns: Array<() => void> = [];

    if (pointerFine) {
      const magneticTargets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-magnetic], .lp-magnetic"),
      );

      magneticTargets.forEach((el) => {
        const strength = Number.parseFloat(
          el.dataset.magneticStrength ||
            (el.classList.contains("lp-magnetic-strong") ? "24" : "14"),
        );

        const handleMove = (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const localX = event.clientX - rect.left;
          const localY = event.clientY - rect.top;
          const offsetX = (localX / rect.width - 0.5) * strength;
          const offsetY = (localY / rect.height - 0.5) * strength;

          el.style.setProperty("--lp-mx", `${offsetX.toFixed(2)}px`);
          el.style.setProperty("--lp-my", `${offsetY.toFixed(2)}px`);
          el.style.setProperty("--lp-spotlight-x", `${((localX / rect.width) * 100).toFixed(2)}%`);
          el.style.setProperty("--lp-spotlight-y", `${((localY / rect.height) * 100).toFixed(2)}%`);
          el.classList.add("is-magnetic-active");
          document.body.classList.add("cursor-magnetic");
        };

        const handleLeave = () => {
          el.style.setProperty("--lp-mx", "0px");
          el.style.setProperty("--lp-my", "0px");
          el.classList.remove("is-magnetic-active");
          document.body.classList.remove("cursor-magnetic");
        };

        const handleDown = () => {
          document.body.classList.add("cursor-active");
          el.classList.add("is-pressed");
        };

        const handleUp = () => {
          document.body.classList.remove("cursor-active");
          el.classList.remove("is-pressed");
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);
        el.addEventListener("mousedown", handleDown);
        window.addEventListener("mouseup", handleUp);

        cleanupFns.push(() => {
          el.removeEventListener("mousemove", handleMove);
          el.removeEventListener("mouseleave", handleLeave);
          el.removeEventListener("mousedown", handleDown);
          window.removeEventListener("mouseup", handleUp);
          el.classList.remove("is-magnetic-active", "is-pressed");
          el.style.removeProperty("--lp-mx");
          el.style.removeProperty("--lp-my");
          el.style.removeProperty("--lp-spotlight-x");
          el.style.removeProperty("--lp-spotlight-y");
        });
      });
    }

    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let parallaxFrame = 0;

    const updateParallax = () => {
      parallaxFrame = 0;
      const viewportHeight = window.innerHeight || 1;

      parallaxTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = Number.parseFloat(el.dataset.parallax || "0.14");
        const deltaFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        const shift = Math.max(-48, Math.min(48, -deltaFromCenter * speed * 0.18));
        el.style.setProperty("--lp-parallax-y", `${shift.toFixed(2)}px`);
      });
    };

    const requestParallax = () => {
      if (parallaxFrame) return;
      parallaxFrame = window.requestAnimationFrame(updateParallax);
    };

    requestParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);

    return () => {
      revealObserver.disconnect();
      cleanupFns.forEach((fn) => fn());
      if (parallaxFrame) {
        window.cancelAnimationFrame(parallaxFrame);
      }
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      revealTargets.forEach((el) => delete el.dataset.revealReady);
      parallaxTargets.forEach((el) => el.style.removeProperty("--lp-parallax-y"));
      document.body.classList.remove("cursor-magnetic", "cursor-active");
    };
  }, []);

  return null;
}
