export function PageSkeleton() {
  return (
    <div className="skeleton skeleton--page" aria-hidden="true">
      <div className="skeleton__block skeleton__block--title" />
      <div className="skeleton__block skeleton__block--card" />
      <div className="skeleton__block skeleton__block--card" />
    </div>
  );
}
