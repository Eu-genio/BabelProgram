import "../home.css";

const TECH_ICONS = [
  {
    name: "C#",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
  {
    name: ".NET",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg",
  },
  {
    name: "React",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "PostgreSQL",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
];

export default function TechStackBar() {
  return (
    <div className="hero-stack" aria-label="Tech stack">
      {TECH_ICONS.map((item) => (
        <div key={item.name} className="hero-stack-icon" title={item.name}>
          <img src={item.src} alt="" width={28} height={28} loading="lazy" />
          <span className="sr-only">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
