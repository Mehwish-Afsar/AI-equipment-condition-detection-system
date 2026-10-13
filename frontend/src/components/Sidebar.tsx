import {
  LayoutDashboard,
  ScanLine,
  Boxes,
  History,
  Wrench,
  Settings,
  User,
  GraduationCap,
  X,
} from 'lucide-react';

export type PageId = 'dashboard' | 'inspection' | 'equipment' | 'history' | 'reports';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inspection', label: 'AI Inspection', icon: ScanLine },
  { id: 'equipment', label: 'Equipment', icon: Boxes },
  { id: 'history', label: 'Inspection History', icon: History },
  { id: 'reports', label: 'Maintenance Reports', icon: Wrench },
];

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-700">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">EquipAI</p>
              <p className="text-[11px] text-gray-500 leading-tight">Condition Detection</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden p-1 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <User className="w-[18px] h-[18px] text-gray-400" />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Settings className="w-[18px] h-[18px] text-gray-400" />
            Settings
          </button>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              SM
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Sarah Mitchell</p>
              <p className="text-xs text-gray-500 truncate">Facilities Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
