import { useEffect, useRef, useState, useCallback } from "react";
import Hammer from "hammerjs";

// Alinha com Dashboard: swipe ativo em celular/tablet (incl. landscape);
// desliga só em desktop largo onde a nav lateral entra.
const DESKTOP_MQ = "(min-width: 1280px)";

function isHorizontallyScrollable(target, boundary) {
  let el = target instanceof Element ? target : target?.parentElement;
  while (el && el !== boundary) {
    const style = window.getComputedStyle(el);
    const overflowX = style.overflowX;
    if (
      (overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay") &&
      el.scrollWidth > el.clientWidth + 1
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Swipe horizontal entre abas (estilo Ionic), só em viewports mobile.
 */
export function useSwipeTabs(tabCount, selected, setSelected) {
  const viewportRef = useRef(null);
  const selectedRef = useRef(selected);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  selectedRef.current = selected;

  const goTo = useCallback(
    (index) => {
      const next = Math.max(0, Math.min(tabCount - 1, index));
      setSelected(next);
    },
    [tabCount, setSelected]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || tabCount < 2) return;

    const mq = window.matchMedia(DESKTOP_MQ);
    let hammer = null;
    let ignoreGesture = false;

    const setup = () => {
      if (hammer) {
        hammer.destroy();
        hammer = null;
      }
      if (mq.matches) {
        setDragOffset(0);
        setIsDragging(false);
        return;
      }

      hammer = new Hammer.Manager(el, {
        touchAction: "pan-y",
      });
      hammer.add(
        new Hammer.Pan({
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 12,
        })
      );

      hammer.on("panstart", (e) => {
        const scrollEl = isHorizontallyScrollable(e.target, el);
        if (scrollEl) {
          const atLeft = scrollEl.scrollLeft <= 0;
          const atRight =
            scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 1;
          // Só deixa o swipe de aba se o scroll interno já está na borda na direção do gesto
          if (!(atLeft && e.deltaX > 0) && !(atRight && e.deltaX < 0)) {
            ignoreGesture = true;
            return;
          }
        }
        ignoreGesture = false;
        setIsDragging(true);
      });

      hammer.on("panmove", (e) => {
        if (ignoreGesture) return;
        const index = selectedRef.current;
        let delta = e.deltaX;
        // Resistência nas bordas
        if ((index === 0 && delta > 0) || (index === tabCount - 1 && delta < 0)) {
          delta *= 0.35;
        }
        setDragOffset(delta);
      });

      const finish = (e) => {
        if (ignoreGesture) {
          ignoreGesture = false;
          setIsDragging(false);
          setDragOffset(0);
          return;
        }

        const width = el.offsetWidth || 1;
        const threshold = width * 0.22;
        const index = selectedRef.current;
        const { deltaX, velocityX } = e;

        let next = index;
        if ((deltaX < -threshold || velocityX < -0.45) && index < tabCount - 1) {
          next = index + 1;
        } else if ((deltaX > threshold || velocityX > 0.45) && index > 0) {
          next = index - 1;
        }

        setSelected(next);
        setDragOffset(0);
        setIsDragging(false);
      };

      hammer.on("panend", finish);
      hammer.on("pancancel", () => {
        ignoreGesture = false;
        setIsDragging(false);
        setDragOffset(0);
      });
    };

    setup();
    mq.addEventListener("change", setup);

    return () => {
      mq.removeEventListener("change", setup);
      if (hammer) hammer.destroy();
    };
  }, [tabCount, setSelected]);

  return { viewportRef, dragOffset, isDragging, goTo };
}
