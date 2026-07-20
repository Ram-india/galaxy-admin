import { AlertCircle, Briefcase, CheckCircle, Clock } from "lucide-react";

const ProjectStats = ({projects = []}) => {
    const totalProjects = projects.length;

    const completed = projects.filter(
        (p) => p.status === "Completed"
    ).length;

    const ongoeing = projects.filter(
        (p) => p.status === "Ongoing"
    ).length;

    const pending = projects.filter(
        (p) => p.status === "Pending"
    ).length;

    const stats = [
        {
            title: "Total Projects",
            value: totalProjects,
            icon: Briefcase,
            color: "from-blue-600 to-cyan-600",
        },
        {
            title: "Completed",
            value: completed,
            icon: CheckCircle,
            color: "from-green-600 to-emerald-600",
        },
        {
            title: "Ongoing",
            value: ongoeing,
            icon: Clock,
            color: "from-yellow-600 to-amber-600",
        },
        {
            title: "Pending",
            value: pending,
            icon: AlertCircle,
            color: "from-red-600 to-rose-600",
        }
    ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
            <div
            key={index} 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
            <div className={`h-2 bg-gradient-to-r ${item.color}`}/>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {item.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {item.value}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${item.color}`}>
                        <item.icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
            </div>
        ))}

    </div>
  )
}

export default ProjectStats