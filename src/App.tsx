import { Route, Routes } from "react-router-dom"
import { NavigationMenu } from "./components/NavigationMenu"
import { NotFoundPage } from "./pages/guest-routes/NotFoundPage"
import { ResetPasswordPage } from "./pages/guest-routes/ResetPasswordPage"
import { SignInPage } from "./pages/guest-routes/SignInPage"
import { SignUpPage } from "./pages/guest-routes/SignUpPage"
import { AboutPage } from "./pages/guest-routes/AboutPage"
import { SignOutPage } from "./pages/guest-routes/SignOutPage"
import { LandingPage } from "./pages/auth-routes/LandingPage"
import { AuthControl } from "./components/auth/AuthControl"
import { SettingsPage } from "./pages/auth-routes/settings/SettingsPage"
import { AccountSettingsPage } from "./pages/auth-routes/settings/AccountSettingsPage"
import { UserPreferencesPage } from "./pages/auth-routes/settings/UserPreferencesPage"
import { QuestionsPage } from "./pages/auth-routes/questions/QuestionsPage"
import { MealsPerDay } from "./pages/auth-routes/questions/MealsPerDay"
import { DbSource } from "./pages/auth-routes/questions/DbSource"
import { FoodPreferences } from "./pages/auth-routes/questions/FoodPreferences"

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
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-out" element={<SignOutPage />} />
					<Route path="/about" element={<AboutPage />} />

					{/* Authenticated Routes - wrapped in parent component that is controlling that user is allowed to see the page */}
					<Route path="/" element={
						<AuthControl>
							<LandingPage />
						</AuthControl>
					} />

					<Route path="/settings" element={
						<AuthControl>
							<SettingsPage />
						</AuthControl>
					} >
						{/* <Route index element={
							<AuthControl>
								<UserPreferencesPage />
							</AuthControl>
						} /> */}
						<Route path="/settings/account-settings" element={
							<AuthControl>
								<AccountSettingsPage />
							</AuthControl>
						} />
						<Route path="/settings/preferences" element={
							<AuthControl>
								<UserPreferencesPage />
							</AuthControl>
						} />
					</Route>

					<Route path="/questions" element={
						<AuthControl>
							<QuestionsPage />
						</AuthControl>
					} >
						<Route path="/questions/meals" element={
							<AuthControl>
								<MealsPerDay />
							</AuthControl>
						} />
						<Route path="/questions/food-preferences" element={
							<AuthControl>
								<FoodPreferences />
							</AuthControl>
						} />
						<Route path="/questions/db-source" element={
							<AuthControl>
								<DbSource />
							</AuthControl>
						} />
					</Route>

				</Routes>
			</div>

		</div>
	)
}

export default App
