import { Route, Routes } from "react-router-dom"
import { NavigationMenu } from "./components/NavigationMenu"
import { NotFoundPage } from "./pages/guest-routes/NotFoundPage"
import { ForgotPasswordPage } from "./pages/guest-routes/ForgotPasswordPage"
import { SignInPage } from "./pages/guest-routes/SignInPage"
import { SignUpPage } from "./pages/guest-routes/SignUpPage"
import { AboutPage } from "./pages/guest-routes/AboutPage"
import { SignOutPage } from "./pages/guest-routes/SignOutPage"
import { LandingPage } from "./pages/auth-routes/LandingPage"

export const App = () => {
	return (
		<div className="font-primary grid grid-cols-1 grid-rows-app min-h-screen">
			<div className="span-1">
				<NavigationMenu />
			</div>

			<div className="span-1">
				<Routes>
					{/* Guest Routes */}
					<Route path="*" element={<NotFoundPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-out" element={<SignOutPage />} />
					<Route path="/about" element={<AboutPage />} />

					{/* Authenticated Routes - wrappa i förälder som kollar auth  */}
					<Route path="/" element={<LandingPage />} />

				</Routes>
			</div>

		</div>
	)
}

export default App
