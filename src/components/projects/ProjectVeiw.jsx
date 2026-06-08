import { useNavigate, useParams } from "react-router-dom"
import { getProjects } from "../../services/projectService";
import { useState,useEffect } from "react";




const ProjectVeiw = () => {
    const{id} = useParams();
    const navigate = useNavigate();
    const[project, setProject] = useState(null);
    useEffect(()=>{
        fetchProject();
    },[]);

    const fetchProject = async() => {
        try{
            const res = await getProjects(id);
            setProject(res.data);
        }catch(error){
            console.log("Error fetching project", error);
        }
    };

    if(!project){
        return <div>Loading...</div>
    }

  return (
   <div className="bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        {project.projectName}
      </h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-semibold">
            Client
          </p>
          <p>{project.clientName}</p>
        </div>
        <div>
          <p className="font-semibold">
            Capacity
          </p>
          <p>{project.capacity}</p>
        </div>
        <div>
          <p className="font-semibold">
            Type
          </p>
          <p>{project.projectType}</p>
        </div>
        <div>
          <p className="font-semibold">
            Status
          </p>
          <p>{project.status}</p>
        </div>
        <div>
          <p className="font-semibold">
            Location
          </p>
          <p>{project.location}</p>
        </div>
      </div>
      <div>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};
export default ProjectVeiw