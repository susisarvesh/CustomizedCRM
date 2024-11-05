import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading, error } = useAuthStore();
	const navigate = useNavigate();
	// Initialize useNavigate
	

	const handleLogin = async (e) => {
    e.preventDefault();
   try {
        const response = await login(email, password);
        
        if (response.success) {
            // Redirect based on user role
            const redirectPath = response.userRole === 'support' ? '/support' : '/dashboard';
            navigate(redirectPath); // Redirect to the appropriate dashboard based on user role
        } else {
            alert(response.message); // Handle any messages from the login response
        }
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message); // Display error message if login fails
    }
};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-400 bg-opacity-30 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<div className="flex justify-center flex-col items-center">
				<img src="https://ik.imagekit.io/zhf0gkzac/VSmart/Vsmarttechnologies.png?updatedAt=1724834363389" alt=" vsmart logo" className="w-[150px] mb-5" />
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-orange-200 text-transparent bg-clip-text'>
					Welcome Back
					</h2>
					</div>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-white hover:underline'>
							Forgot password?
						</Link>
					</div>
					{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-white bg-opacity-50 flex justify-center'>
				{/* <p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-white hover:underline'>
						Sign up
					</Link>
				</p> */}
			</div>
		</motion.div>
	);
};

export default LoginPage;
