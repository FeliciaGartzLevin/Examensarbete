import { Link } from "react-router-dom"
import { Button } from "../../components/Button"

export const SignInPage = () => {
	return (
		<div className="h-screen bg-dark-background flex justify-center items-center">
			<div className="w-full max-w-xs">
				<form className="bg-light-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div className='text-lg text-center font-bold mb-2'>
						Sign In
					</div>
					<div className="text-center text-gray-500 text-xs mb-4">
						<p>Sign in to your user profile.</p>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" aria-label="email">
							Email
						</label>
						<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" aria-labelledby="email" type="text" placeholder="Email" />
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" aria-label="password">
							Password
						</label>
						<input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" aria-labelledby="password" type="password" placeholder="******************" />
						<p className="text-red-500 text-xs italic">Please choose a password.</p>
					</div>
					<div className="flex items-center justify-between">
						<Link to='/forgot-password' className="inline-block align-baseline font-bold text-sm text-button-bg hover:text-link-hover">
							Forgot Password?
						</Link>
						<Button onClick={() => console.log('clicked sign up button 👆🏽')}>Sign in</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
