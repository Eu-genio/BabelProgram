import ProjectCard from "../components/ProjectCard";
import "../projects.css";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="projects-title">Projects</h1>

      <ProjectCard />
    </div>
  );
}