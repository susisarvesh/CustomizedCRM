import { useState } from "react"
import { Bell, ChevronDown, Menu, Search, X, Users, UserPlus } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEngineerOpen, setIsEngineerOpen] = useState(false)
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", label: "Ticket Details", path: "/dashboard/tickets" },
    { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "About", path: "/dashboard/about" },
    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "Customers", path: "/dashboard/customers" },
  ]

  return (
    <div className="flex flex-col h-screen bg-white lg:flex-row w-full">
      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? 'translate-y-0' : '-translate-y-full'
      } lg:translate-y-0 fixed top-0 left-0 right-0 lg:static lg:block w-full lg:w-64 bg-orange-50 border-r border-orange-100 overflow-y-auto z-50 transition-transform duration-300 ease-in-out lg:transition-none h-screen lg:h-auto`}>
        <div className="p-4 flex justify-between items-center lg:justify-start">
          <img src="https://ik.imagekit.io/zhf0gkzac/VSmart/Vsmarttechnologies.png?updatedAt=1724834363389" alt="" className="w-[150px]" />
          {/* <h2 className="text-2xl font-bold text-orange-600 flex justify-center items-center">Vsmart Technologies</h2> */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-orange-600" />
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2 text-orange-800 ${
                location.pathname === item.path ? "bg-orange-100" : ""
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setIsEngineerOpen(!isEngineerOpen)}
              className="flex items-center px-4 py-2 text-orange-800 hover:bg-orange-100 w-full"
            >
              <UserPlus className="w-5 h-5 mr-4" />
              Add Engineer
              <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${isEngineerOpen ? 'rotate-180' : ''}`} />
            </button>
            {isEngineerOpen && (
              <div className="pl-4">
                <Link
                  to="/dashboard/support"
                  className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Users className="w-5 h-5 mr-4" />
                  Support Engineer
                </Link>
                <Link
                  to="/dashboard/field"
                  className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Users className="w-5 h-5 mr-4" />
                  Field Engineer
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 mt-4 text-orange-800 hover:bg-orange-100 w-full text-left"
          >
            <svg
              className="w-5 h-5 mr-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-0 mt-[100vh]' : 'lg:ml-0 mt-0'
      }`}>
        <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-orange-600" />
              ) : (
                <Menu className="h-6 w-6 text-orange-600" />
              )}
            </button>
            <div className="flex-1 max-w-xs mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-orange-200 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="text-orange-600" />
              <div className="flex items-center space-x-2">
                <Link to="/dashboard/about">
                  <div className="w-8 h-8 rounded-full mb-4 pointer bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}