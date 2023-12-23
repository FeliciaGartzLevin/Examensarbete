import { NavLink, Outlet } from "react-router-dom"
import { UserImgAndName } from "../../components/UserImgAndName"

export const SettingsPage = () => {
	return (
		<div className="bg-dark-background h-full lg:px-20 px-2 md:px-8 pt-6">
			<div className="bg-light-background py-6 px-3 md:px-12 rounded-md flex flex-col items-center">
				<div className="flex flex-col justify-center gap-3 ">
					<h1 className="font-bold text-center">Settings</h1>

					<UserImgAndName />

					<div className="flex justify-center items-center gap-2 flex-row">
						<p className="borderDivider"><NavLink to='/settings/preferences'>User Preferences</NavLink></p>
						<p><NavLink to='/settings/account-settings'>Account settings</NavLink></p>
					</div>
					<hr />
				</div>

				<div className="flex justify-center w-full text-center pt-6">
					<Outlet />
				</div>

			</div>
		</div>
	)
}
