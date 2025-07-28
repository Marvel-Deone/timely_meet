"use client"

import { Calendar, Clock, BarChart3, Video, X } from "lucide-react"
import { usePathname } from "next/navigation"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const sidebarItems = [
  { title: "Dashboard", icon: BarChart3, href: "/dashboard", isActive: true },
  { title: "Events", icon: Calendar, href: "/events" },
  { title: "Meetings", icon: Video, href: "/meetings" },
  { title: "Availability", icon: Clock, href: "/availability" },
]

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
   const pathname = usePathname();
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-gray-600/75 bg-opacity-75 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TimelyMeet
              </span>
            </div>
            <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.href === pathname
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <item.icon className="mr-3 flex-shrink-0 h-4 w-4" />
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default MobileSidebar;
