export function IconButton({
  children,
  onClick,
  className = "",
  title,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={className}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
