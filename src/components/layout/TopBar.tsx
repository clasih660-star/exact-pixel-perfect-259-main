import { Search, Bell, Settings, User, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <div className="topnav">
      <div className="search-box">
        <Search className="text-gray-400" size={18} />
        <input type="text" placeholder="Search lessons, courses, or topics..." />
      </div>

      <div className="topnav-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notif-dot" />
        </button>

        <button className="icon-btn" aria-label="Settings">
          <Settings size={20} />
        </button>

        <button className="icon-btn" aria-label="Profile">
          <User size={20} />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="avatar text-xs">AJ</div>
          <span className="text-sm font-medium text-gray-700">Alex</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
