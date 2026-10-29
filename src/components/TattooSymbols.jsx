/** SVGs estilo tattoo oldschool (stroke grosso, fill sólido) */

const base = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 64 64",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export const TattooSymbol = ({ id, className }) => {
  switch (id) {
    case "heart":
      return (
        <svg {...base} className={className}>
          <path
            d="M32 54S8 38 8 22c0-8 6-14 14-14 5 0 9 3 10 7 1-4 5-7 10-7 8 0 14 6 14 14 0 16-24 32-24 32z"
            fill="#c62828"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M22 24c2-2 5-2 6 1" stroke="#ffcdd2" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...base} className={className}>
          <path
            d="M36 6L18 34h12l-4 24 22-32H34l2-20z"
            fill="#f9a825"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "dagger":
      return (
        <svg {...base} className={className}>
          <path d="M30 8h4v28h-4z" fill="#cfd8dc" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M28 36h8v4h-8z" fill="#6d4c41" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M22 40h20v4H22z" fill="#b71c1c" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M30 44h4v12l-2 4-2-4V44z" fill="#90a4ae" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="32" cy="38" r="2" fill="#ffd54f" stroke="#1a1a1a" strokeWidth="1.5" />
        </svg>
      );
    case "skull":
      return (
        <svg {...base} className={className}>
          <ellipse cx="32" cy="28" rx="18" ry="16" fill="#eceff1" stroke="#1a1a1a" strokeWidth="3" />
          <path d="M22 42h20v8c0 4-4 6-10 6s-10-2-10-6v-8z" fill="#eceff1" stroke="#1a1a1a" strokeWidth="3" />
          <ellipse cx="24" cy="28" rx="5" ry="6" fill="#1a1a1a" />
          <ellipse cx="40" cy="28" rx="5" ry="6" fill="#1a1a1a" />
          <path d="M28 38h8v3h-8z" fill="#1a1a1a" />
          <path d="M26 48v4M32 48v5M38 48v4" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      );
    case "rose":
      return (
        <svg {...base} className={className}>
          <path d="M32 58V36" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 48c-8 0-12-6-10-8 4 2 8 0 10 2" fill="#43a047" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M32 48c8 0 12-6 10-8-4 2-8 0-10 2" fill="#43a047" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="32" cy="24" r="14" fill="#c62828" stroke="#1a1a1a" strokeWidth="3" />
          <circle cx="32" cy="24" r="8" fill="#e53935" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="32" cy="24" r="3" fill="#ffcdd2" stroke="#1a1a1a" strokeWidth="1.5" />
        </svg>
      );
    case "snake":
      return (
        <svg {...base} className={className}>
          <path
            d="M12 40c8-16 16-4 24-12s8-16 16-8"
            stroke="#2e7d32"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M12 40c8-16 16-4 24-12s8-16 16-8"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="50" cy="20" r="7" fill="#66bb6a" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="52" cy="18" r="1.5" fill="#1a1a1a" />
          <path d="M56 22l6 2-6 2" fill="#e53935" stroke="#1a1a1a" strokeWidth="1" />
        </svg>
      );
    case "star":
      return (
        <svg {...base} className={className}>
          <path
            d="M32 6l6 16h17l-14 10 5 17-14-10-14 10 5-17L9 22h17z"
            fill="#ffd54f"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "eye":
      return (
        <svg {...base} className={className}>
          <path
            d="M8 32c8-14 20-20 24-20s16 6 24 20c-8 14-20 20-24 20S16 46 8 32z"
            fill="#fffde7"
            stroke="#1a1a1a"
            strokeWidth="3"
          />
          <circle cx="32" cy="32" r="10" fill="#1565c0" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="32" cy="32" r="4" fill="#1a1a1a" />
          <circle cx="28" cy="28" r="2" fill="#e3f2fd" />
        </svg>
      );
    default:
      return null;
  }
};
