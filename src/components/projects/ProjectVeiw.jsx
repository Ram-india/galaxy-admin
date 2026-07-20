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

  const details = [
    { label: "Client", value: project.clientName },
    { label: "Capacity", value: project.capacity },
    { label: "Type", value: project.projectType },
    { label: "Status", value: project.status },
    { label: "Location", value: project.location },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        {project.projectName}
      </h1>
      <div className="grid grid-cols-2 gap-6">
        {details.map((detail) => (
          <div key={detail.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {detail.label}
            </p>
            <p className="mt-1 text-slate-800 dark:text-slate-200">
              {detail.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
};
export default ProjectVeiw