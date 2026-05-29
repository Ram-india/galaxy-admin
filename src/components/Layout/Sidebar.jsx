
import { ChevronDown, Zap } from "lucide-react";
import { menuItems } from "../../data/menuItems";
import { useState } from "react";

const Sidebar = ({collapsed, onToggle, currentPage, onPagechange}) => {
  const [expandedItems, setExpandedItems] = useState(new Set(['analytics'])); // Set to track expanded items

  const toggleExpanded= (itemid) => {
    const newExpanded = new Set(expandedItems);
    if(newExpanded.has(itemid)){
      newExpanded.delete(itemid);
    }else {
      newExpanded.add(itemid);
    }
    setExpandedItems(newExpanded);
  };
  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-72"}
        min-h-screen
        bg-white/80
        transition-all
        duration-500
        dark:bg-slate-900/80
        backdrop-blur-xl
        border-r
        border-slate-200/50
        dark:border-slate-700/50
        flex
        flex-col
        relative
        z-10
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          {/* Condintional Rendering */}

          {!collapsed && (
            <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              My App
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin Panel
            </p>
          </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item)=>{
            return (
                <div key={item.id}>
                  <button className={`w-full flex items-center justify-between p-3 rounded-xl transistion-all duration-300
                  ${currentPage === item.label || item.active ?
                  "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" :
                  "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"}
                  `}
                  onClick={()=> {
                    if(item.submenu){
                      toggleExpanded(item.id);
                    }
                    else {
                      onPagechange(item.id);
                    }
                  }}
                  >
                    <div className="flex items-center space-x-3">
                     <item.icon className="w-5 h-5" />
                      {/* Conditional Rendering */}
                      <>
                      {!collapsed && (
                      <>
                      <span className="'font-medium ml-2 ">{item.label}</span>
                      
                     
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-1 text-xs bg-slate-200  dark:bg-slate-700  text-slate-600 dark:text-slate-300 rounded-full">
                          {item.count}
                        </span>
                      )}
                      </>
                    )}
                      </>
                      
                    </div>

                    {!collapsed && item.submenu && (
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${item.active ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  {/* Submenus */}
                  {!collapsed && item.submenu && expandedItems.has(item.id) && (
                    <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subitem) => {
                      return <button 
                      className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 
                      dark:hover:text-slate-200 hover:bg-slate-100 dark:hover-bg-slate-800/50 rounded-lg "
                      >{subitem.label}</button>
                    })}
                  </div>
                  )}
                </div>
          )
        })}
        
      </nav>

      {/* User Profile */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            bg-slate-50
            dark:bg-slate-800/50
          "
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="
              w-10
              h-10
              rounded-full
              object-cover
              ring-2
              ring-blue-500
            "
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
              John Doe
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Administrator
            </p>
          </div>
        </div>
      </div>
        )}

      
    </aside>
  );
};

export default Sidebar;