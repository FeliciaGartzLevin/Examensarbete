import { Route, Routes } from "react-router-dom"
import { NavigationMenu } from "./components/navmenu/NavigationMenu"
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
import { MealsOverView } from "./pages/auth-routes/MealsOverView"
import { WeeksOverview } from "./pages/auth-routes/WeeksOverview"
import { CreateMeal } from "./components/create-update-meal/CreateMeal"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MealDetails } from "./pages/auth-routes/MealDetails"

export const App = () => {
	return (
		<div className="font-primary grid grid-cols-1 grid-rows-app min-h-screen bg-neutral-dinner bg-cover">
			<div className="span-1 sticky top-0 z-10">
				<NavigationMenu />
			</div>

			<div className="span-1 sm:px-4">
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

					<Route path="/meal/:mealId" element={
						<AuthControl>
							<MealDetails />
						</AuthControl>
					} />

					<Route path="/settings" element={
						<AuthControl>
							<SettingsPage />
						</AuthControl>
					} >
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

					<Route path="/questions/*" element={
						<AuthControl>
							<QuestionsPage />
						</AuthControl>
					} />

					<Route path="/meals" element={
						<AuthControl>
							<MealsOverView />
						</AuthControl>
					} />

					<Route path="/weeks" element={
						<AuthControl>
							<WeeksOverview />
						</AuthControl>
					} />

					<Route path="/create-meal" element={
						<AuthControl>
							<CreateMeal />
						</AuthControl>
					} />

				</Routes>
				<ReactQueryDevtools initialIsOpen={false} />
			</div>

		</div>
	)
}

export default App
