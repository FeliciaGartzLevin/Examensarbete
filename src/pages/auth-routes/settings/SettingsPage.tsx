import { NavLink, Outlet } from "react-router-dom"
import { UserImgAndName } from "../../../components/UserImgAndName"
import { Divider } from "../../../components/generic utilities/Divider"

export const SettingsPage = () => {
	return (
		<div className="text-center h-full lg:px-20 px-2 md:px-8 py-6">
			<div className="bg-light-background py-6 px-3 md:px-12 rounded-md flex flex-col items-center">
				<div className="flex flex-col justify-center gap-3 ">
					<h1 className="font-bold text-center">Settings</h1>

					<UserImgAndName />

					<div className="flex justify-center items-center gap-2 flex-row">
						<NavLink to='/settings/preferences'><p>User Preferences</p></NavLink>
						<div className="bg-black w-[2px] h-[2.5rem]"></div>
						<NavLink to='/settings/account-settings'><p>Account settings</p></NavLink>
					</div>
					<Divider symbol />
				</div>

				<div className="flex justify-center w-full text-center pt-6">
					<Outlet />
				</div>

			</div>
		</div>
	)
}
