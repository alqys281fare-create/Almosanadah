import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icons.jsx';

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/*
 * Accessible dialog: Esc / backdrop / close button close it, focus is trapped inside while open and
 * returned to the opener afterwards, and the page behind does not scroll.
 * On phones it becomes a bottom sheet.
 */
export default function DetailsModal({ open, onClose, title, closeLabel = 'Close', children }) {
  const panel = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement;
    const { overflow, paddingInlineEnd } = document.body.style;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingInlineEnd = `${sbw}px`;
    const t = setTimeout(() => panel.current?.querySelector('.dm__close')?.focus(), 30);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab' && panel.current) {
        const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingInlineEnd = paddingInlineEnd;
      opener.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="dm" role="presentation">
      <div className="dm__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="dm__panel" role="dialog" aria-modal="true" aria-label={title} ref={panel}>
        <button type="button" className="dm__close" onClick={onClose} aria-label={closeLabel}>
          <Icon name="close" size={20} />
        </button>
        <div className="dm__scroll">{children}</div>
      </div>
    </div>,
    document.body
  );
}
