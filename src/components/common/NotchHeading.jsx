/* Section heading drawn inside a half-circle that hangs from the top edge (gallery / accreditation / testimonials). */
export default function NotchHeading({ children, id }) {
  return (
    <div className="notch">
      <h2 className="notch__title" id={id}>{children}</h2>
    </div>
  );
}
