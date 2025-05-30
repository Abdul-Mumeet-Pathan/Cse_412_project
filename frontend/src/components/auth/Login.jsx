import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { useDarkMode } from '../DarkModeProvider'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { darkMode } = useDarkMode();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-400">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-md">
                    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300`}>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                            <h1 className="text-2xl font-bold">Welcome Back</h1>
                            <p className="text-blue-100">Login to access your account</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your email"
                                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium block">Login as</Label>
                                <RadioGroup className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center">
                                        <Input
                                            id="student-role"
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                                        />
                                        <Label htmlFor="student-role" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                            Job Seeker
                                        </Label>
                                    </div>
                                    <div className="flex items-center">
                                        <Input
                                            id="recruiter-role"
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                                        />
                                        <Label htmlFor="recruiter-role" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                            Recruiter
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="pt-2">
                                {loading ? (
                                    <Button disabled className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.01] shadow-md"
                                    >
                                        Login
                                    </Button>
                                )}
                            </div>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login