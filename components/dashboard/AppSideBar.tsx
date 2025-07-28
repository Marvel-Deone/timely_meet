"use client"

import { Calendar, Clock, BarChart3, Video } from "lucide-react"
import { usePathname } from "next/navigation";

const sidebarItems = [
  { title: "Dashboard", icon: BarChart3, href: "/dashboard", isActive: true },
  { title: "Events", icon: Calendar, href: "/events" },
  { title: "Meetings", icon: Video, href: "/meetings" },
  { title: "Availability", icon: Clock, href: "/availability" },
]

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TimelyMeet
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${item.href === pathname
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
    </div>
  )
}

export default AppSidebar;
