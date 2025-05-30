import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase, Home, Search, Building2, Menu, X, Mail, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDarkMode } from "../DarkModeProvider";

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [mailPopoverOpen, setMailPopoverOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useDarkMode();

    const notifications = [
        { id: 1, company: "TechCorp", message: "Interview scheduled for Frontend Developer", time: "2 hours ago", read: false },
        { id: 2, company: "DesignHub", message: "Your application has been shortlisted", time: "1 day ago", read: false },
        { id: 3, company: "DataSystems", message: "Request for additional information", time: "3 days ago", read: true }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const navItems = user && user.role === 'recruiter' ? [
        { path: "/admin/companies", icon: <Building2 className="h-4 w-4" />, label: "Companies" },
        { path: "/admin/jobs", icon: <Briefcase className="h-4 w-4" />, label: "Jobs" }
    ] : [
        { path: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
        { path: "/jobs", icon: <Briefcase className="h-4 w-4" />, label: "Jobs" },
        { path: "/browse", icon: <Search className="h-4 w-4" />, label: "Browse" }
    ];

    return (
        <header className={cn(
            "sticky top-0 z-50 backdrop-blur-md border-b shadow-lg transition-colors",
            "bg-white/95 dark:bg-gray-900/95",
            "border-gray-100 dark:border-gray-800"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-md">
                                <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                JobPortal
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <NavLink 
                                key={item.path}
                                to={item.path}
                                icon={item.icon}
                                label={item.label}
                                darkMode={darkMode}
                            />
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? (
                                <span className="text-yellow-500 text-xl">🌞</span>
                            ) : (
                                <span className="text-gray-700 text-xl">🌙</span>
                            )}
                        </button>

                        {user && user.role === 'student' && (
                            <Popover open={mailPopoverOpen} onOpenChange={setMailPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <button className="relative p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className={cn(
                                    "w-80 p-0 mt-2 shadow-xl rounded-xl",
                                    "bg-white dark:bg-gray-800",
                                    "border-gray-100 dark:border-gray-700"
                                )}>
                                    <div className={cn(
                                        "p-4 border-b",
                                        "border-gray-100 dark:border-gray-700"
                                    )}>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Interview Notifications</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} unread messages</p>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className={cn(
                                                        "p-4 border-b transition-colors cursor-pointer",
                                                        "border-gray-100 dark:border-gray-700",
                                                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                                                        !notification.read && "bg-blue-50 dark:bg-blue-900/30"
                                                    )}
                                                    onClick={() => setMailPopoverOpen(false)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{notification.company}</h4>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                                                    {!notification.read && (
                                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded-full">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <Mail className="h-8 w-8 text-gray-300 dark:text-gray-500 mx-auto mb-2" />
                                                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className={cn(
                                        "p-3 border-t text-center",
                                        "border-gray-100 dark:border-gray-700"
                                    )}>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                                        >
                                            Mark all as read
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 px-4">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg px-6 transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="hidden md:block">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="flex items-center space-x-2 focus:outline-none group">
                                                <Avatar className="h-9 w-9 border-2 border-blue-100 dark:border-blue-900 group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all shadow-md">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                                                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-600 dark:text-blue-300">
                                                        {user?.fullname?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className={cn(
                                            "w-64 p-0 mt-2 shadow-xl rounded-xl",
                                            "bg-white dark:bg-gray-800",
                                            "border-gray-100 dark:border-gray-700"
                                        )}>
                                            <div className={cn(
                                                "p-4 border-b",
                                                "border-gray-100 dark:border-gray-700"
                                            )}>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                                                        <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-600 dark:text-blue-300">
                                                            {user?.fullname?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{user?.fullname}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                {user && user.role === 'student' && (
                                                    <Link to="/profile">
                                                        <Button variant="ghost" className="w-full justify-start space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <User2 className="h-4 w-4 text-blue-500" />
                                                            <span>View Profile</span>
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={logoutHandler}
                                                    className="w-full justify-start space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <LogOut className="h-4 w-4 text-red-500" />
                                                    <span>Sign Out</span>
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden shadow-lg transition-all duration-300 overflow-hidden",
                "bg-white dark:bg-gray-800",
                mobileMenuOpen ? "max-h-screen py-4 border-t border-gray-100 dark:border-gray-700" : "max-h-0"
            )}>
                <div className="container mx-auto px-4">
                    <nav className="flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <MobileNavLink 
                                key={item.path}
                                to={item.path}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => setMobileMenuOpen(false)}
                                darkMode={darkMode}
                            />
                        ))}
                    </nav>
                    
                    {user ? (
                        <div className={cn(
                            "mt-4 pt-4 border-t",
                            "border-gray-100 dark:border-gray-700"
                        )}>
                            {user.role === 'student' && (
                                <div className="mb-4">
                                    <Link 
                                        to="#" 
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg",
                                            "hover:bg-gray-50 dark:hover:bg-gray-700",
                                            "text-gray-700 dark:text-gray-300"
                                        )}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setMailPopoverOpen(true);
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>Notifications</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center space-x-3 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-600 dark:text-blue-300">
                                        {user?.fullname?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">{user?.fullname}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </div>
                            
                            {user.role === 'student' && (
                                <Link to="/profile">
                                    <Button 
                                        variant="ghost" 
                                        className={cn(
                                            "w-full justify-start space-x-2 mb-2",
                                            "text-gray-700 dark:text-gray-300",
                                            "hover:bg-gray-50 dark:hover:bg-gray-700"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User2 className="h-4 w-4 text-blue-500" />
                                        <span>View Profile</span>
                                    </Button>
                                </Link>
                            )}
                            
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    logoutHandler();
                                    setMobileMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full justify-start space-x-2",
                                    "text-gray-700 dark:text-gray-300",
                                    "hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                <LogOut className="h-4 w-4 text-red-500" />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    ) : (
                        <div className={cn(
                            "mt-4 pt-4 border-t flex flex-col space-y-3",
                            "border-gray-100 dark:border-gray-700"
                        )}>
                            <Link to="/login">
                                <Button variant="outline" className="w-full border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

const NavLink = ({ to, icon, label, darkMode }) => (
    <Link 
        to={to}
        className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium",
            "text-gray-600 dark:text-gray-300",
            "hover:text-blue-600 dark:hover:text-blue-400",
            "hover:bg-blue-50 dark:hover:bg-gray-700",
            "transition-colors"
        )}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, label, onClick, darkMode }) => (
    <Link 
        to={to}
        onClick={onClick}
        className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium",
            "text-gray-700 dark:text-gray-300",
            "hover:text-blue-600 dark:hover:text-blue-400",
            "hover:bg-blue-50 dark:hover:bg-gray-700",
            "transition-colors"
        )}
    >
        <span className="text-blue-500">{icon}</span>
        <span>{label}</span>
    </Link>
);

export default Navbar