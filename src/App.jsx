import { useState } from "react";
import Header from "./components/Layout/Header";
import  Sidebar  from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  const [Sidebarcollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");  
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar
        collapsed={Sidebarcollapsed}
        onToggle ={()=>setSidebarCollapsed(!Sidebarcollapsed)}
        currentPage={currentPage}
        onPagechange = {setCurrentPage}
         />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
          Sidebarcollapsed ={Sidebarcollapsed}
          onToggleSidebar = {() => setSidebarCollapsed(!Sidebarcollapsed)}
          
          />
          <main className="flex-1 overflow-y-auto bg-transperent">
            <div className="p-6 space-y-6">
              {
                currentPage === "dashboard" && <Dashboard/>
              }

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default App;
