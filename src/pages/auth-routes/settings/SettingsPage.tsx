import { NavLink, Outlet } from "react-router-dom"
import { UserImgAndName } from "../../../components/UserImgAndName"
import { Divider } from "../../../components/generic-utilities/Divider"
import { ContentContainer } from "../../../components/generic-utilities/ContentContainer"

export const SettingsPage = () => {
	return (
		<ContentContainer>
			<div className="flex flex-col justify-center gap-3 ">
				<h1 className="font-bold text-center">Settings</h1>

				<UserImgAndName />

				<div className="flex justify-center items-center gap-2 flex-row">
					<NavLink to='/settings/preferences'><p>User Preferences</p></NavLink>
					<div className="bg-black w-[2px] h-[2.5rem]"></div>
					<NavLink to='/settings/account-settings'><p>Account settings</p></NavLink>
				</div>
				<Divider symbol='bowl' />
			</div>

			<div className="flex justify-center w-full text-center pt-6">
				<Outlet />
			</div>
		</ContentContainer>

	)
}
