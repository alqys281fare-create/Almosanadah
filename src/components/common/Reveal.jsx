import useInView from '../../hooks/useInView.js';

// Scroll-reveal wrapper. direction: up | down | left | right | zoom | fade
export default function Reveal({ children, direction = 'up', delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${direction} ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
