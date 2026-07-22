import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dropdown that renders in a portal, anchored under its trigger.
 *
 * Portals are used so a menu inside a scrolling table is never clipped, but
 * that puts the menu outside the trigger's DOM subtree. The dismiss handler
 * must therefore test the trigger *and* the menu: checking only the trigger
 * closes the menu on `mousedown` over an item, which unmounts it before the
 * `click` can fire — the item's onClick then never runs at all.
 *
 * @param {number} menuWidth used to right-align the menu with its trigger
 */
export const useAnchoredMenu = (menuWidth) => {
  const [position, setPosition] = useState(null); // null === closed
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const isOpen = position !== null;

  const close = useCallback(() => setPosition(null), []);

  const open = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      top: rect.bottom + 6,
      left: Math.max(8, rect.right - menuWidth),
    });
  }, [menuWidth]);

  const toggle = useCallback(
    () => (isOpen ? close() : open()),
    [isOpen, close, open]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      const isInsideTrigger = triggerRef.current?.contains(event.target);
      const isInsideMenu = menuRef.current?.contains(event.target);

      if (!isInsideTrigger && !isInsideMenu) close();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    // A fixed-position menu would drift away from its anchor on scroll/resize
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, close]);

  /** Closes the menu, then runs the chosen action. */
  const runAction = useCallback(
    (action) => {
      close();
      action?.();
    },
    [close]
  );

  return { isOpen, position, triggerRef, menuRef, open, close, toggle, runAction };
};

export default useAnchoredMenu;
