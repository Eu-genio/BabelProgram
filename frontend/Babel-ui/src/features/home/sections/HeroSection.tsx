import "../home.css";
export default function HeroSection() {
  return (
    <section style={{ marginBottom: "4rem" }}>
      <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>
        Eugenio Borgnolo
      </h1>

      <p style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: 500 }}>
        Full-stack developer | .NET & React
      </p>

      <p style={{ color: "#666", maxWidth: "600px", lineHeight: 1.6 }}>
        I build scalable systems with clean architecture and a focus on
        production reliability.
      </p>
    </section>
  );
}