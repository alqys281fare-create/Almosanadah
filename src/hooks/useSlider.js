
import { useEffect, useState } from 'react';


export default function useSlider(
  total,
  {
    views = [[640, 1], [1024, 2], [Infinity, 3]],
    autoplay = 0,
    step = null,
  } = {}
) {
  const pick = () => {
    const width =
      typeof window === 'undefined' ? 1200 : window.innerWidth;

    return (
      views.find(([max]) => width < max) ||
      views[views.length - 1]
    )[1];
  };

  const [perView, setPerView] = useState(pick);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive item count
  useEffect(() => {
    const onResize = () => setPerView(pick());

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Movement amount:
  // null = full page
  // 1 = one item
  const movement = Math.max(1, step ?? perView);

  // Maximum valid starting position
  const maxStart = Math.max(0, total - perView);

  // Number of movement positions
  const pages =
    maxStart === 0
      ? 1
      : Math.ceil(maxStart / movement) + 1;

  // Keep current position valid when screen size or items change
  useEffect(() => {
    setPage((current) => Math.min(current, pages - 1));
  }, [pages]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || pages < 2 || paused) return undefined;

    const id = setInterval(() => {
      setPage((current) => (current + 1) % pages);
    }, autoplay);

    return () => clearInterval(id);
  }, [autoplay, pages, paused]);

  const start = Math.min(page * movement, maxStart);
  const end = Math.min(start + perView, total);

  return {
    page,
    pages,
    perView,
    setPage,
    start,
    end,

    hover: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: () => setPaused(false),
    },
  };
}
