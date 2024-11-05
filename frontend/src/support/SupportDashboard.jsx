import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  Search, 
  X, 
  Users, 
  UserPlus, 
  Ticket, 
  Info, 
  LogOut,
  ClipboardList,
  History,
  CheckSquare
} from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEngineerOpen, setIsEngineerOpen] = useState(false)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    { icon: <Ticket className="w-5 h-5" />, label: "Ticket Details", path: "/supports/tickets" },
    { icon: <Info className="w-5 h-5" />, label: "About", path: "/supports/about" },
  ]

  return (
    <div className="flex flex-col h-screen bg-white lg:flex-row w-full">
      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? 'translate-y-0' : '-translate-y-full'
      } lg:translate-y-0 fixed top-0 left-0 right-0 lg:static lg:block w-full lg:w-64 bg-orange-50 border-r border-orange-100 overflow-y-auto z-50 transition-transform duration-300 ease-in-out lg:transition-none h-screen lg:h-auto`}>
        <div className="p-4 flex justify-between items-center lg:justify-start">
          <h2 className="text-2xl font-bold text-orange-600 flex justify-center items-center">Vsmart Technologies</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-orange-600" />
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <div key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-orange-800 ${
                  location.pathname === item.path ? "bg-orange-100" : ""
                }`}
                onClick={() => {
                  setIsSidebarOpen(false)
                  setIsTicketOpen(false)
                }}
              >
                {item.icon}
                <span className="ml-4">{item.label}</span>
              </Link>
              
              {item.label === "Ticket Details" && (
                <div className="relative">
                  <button
                    onClick={() => setIsTicketOpen(!isTicketOpen)}
                    className="flex items-center px-4 py-2 text-orange-800 hover:bg-orange-100 w-full"
                  >
                    <Ticket className="w-5 h-5" />
                    <span className="ml-4">Support Ticket</span>
                    <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${isTicketOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTicketOpen && (
                    <div className="pl-4">
                       <Link
                        to="/supports/verify"
                        className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Verify Ticket
                      </Link>
                      <Link
                        to="/supports/assign"
                        className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Assign Ticket
                      </Link>
                      {/* <Link
                        to="/supports/history"
                        className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <History className="w-4 h-4 mr-2" />
                        Ticket History
                      </Link> */}
                      <Link
                        to="/supports/close"
                        className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Close Ticket
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="relative">
            <button
              onClick={() => setIsEngineerOpen(!isEngineerOpen)}
              className="flex items-center px-4 py-2 text-orange-800 hover:bg-orange-100 w-full"
            >
              <UserPlus className="w-5 h-5" />
              <span className="ml-4">Add Engineer</span>
              <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${isEngineerOpen ? 'rotate-180' : ''}`} />
            </button>
            {isEngineerOpen && (
              <div className="pl-4">
                <Link
                  to="/supports/field"
                  className="flex items-center px-8 py-2 text-orange-800 hover:bg-orange-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Field Engineer
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 mt-4 text-orange-800 hover:bg-orange-100 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-4">Logout</span>
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
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-orange-200 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div> */}
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="text-orange-600" />
              <div className="flex items-center space-x-2">
                <Link to="/supports/about">
                  <div className="w-8 h-8 rounded-full mb-4 pointer bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                {/* <span className="hidden lg:block text-orange-600">{user.name}</span> */}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}