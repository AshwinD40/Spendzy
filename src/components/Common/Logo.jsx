import { Link } from "react-router-dom";

function Logo({
  size = "w-6 h-6",
  imgClassName = "",
  showName = false,
  nameSize = "text-lg",
  to,
  className = "",
}) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${size} flex items-center justify-center shrink-0`}>
        <img
          src="/favicon.ico"
          alt="Spendzy Logo"
          className={`w-full h-full object-contain rounded-md ${imgClassName}`}
        />
      </div>
      {showName && (
        <span
          className={`${nameSize} font-sans font-bold tracking-tight text-neutral-900 dark:text-white select-none`}
        >
          Spend<span className="text-emerald-500">zy</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

export default Logo;
