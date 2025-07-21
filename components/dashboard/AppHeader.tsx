"use client"

// import { Calendar } from "@/components/ui/calendar"
import { Search, Plus, Bell, Menu, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserMenu from "../common/UserMenu"
import Link from "next/link"

interface AppHeaderProps {
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

const AppHeader = ({ onMobileMenuToggle, isMobileMenuOpen }: AppHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 md:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={onMobileMenuToggle}
            >
              <span className="sr-only">Open sidebar</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile logo */}
            <div className="md:hidden ml-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TimelyMeet
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:block md:ml-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events, meetings..."
                  className="pl-10 w-80 bg-gray-50/50 border-gray-200/50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/events?create=true"}>
              <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create Event</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Avatar className="w-8 h-8 ring-2 ring-blue-100">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                <UserMenu />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader;