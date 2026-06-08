import { Plus, Search } from "lucide-react"

const ProjectFilters = ({
    search,
    setSearch,
    openModal,
    
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
            <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            />
            <input 
            type="text"
            placeholder="Search Projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
        </div>
        <div>
            <button 
            onClick={openModal}
            className="w-full md:w-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-violet-700 transition-all font-medium"
            >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Project</span>
            </button>
        </div>
    </div>
  )
}

export default ProjectFilters