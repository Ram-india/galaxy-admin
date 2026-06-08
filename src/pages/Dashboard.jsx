import { useState } from "react";
import ProjectStats from "../components/projects/ProjectStats"


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  return (
    <div>
        <ProjectStats projects={projects} />
    </div>
  )
}

export default Dashboard