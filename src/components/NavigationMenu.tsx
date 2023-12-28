import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const NavigationMenu = () => {
	const { userName } = useAuthContext()

	return (
		<div className="flex justify-between items-center text-white">
			<h1 className="text-lg font-bold">
				<Link to="/">Maträttsroulette 🥘</Link>
			</h1>
			<div className="flex justify-between items-center gap-3">
				<p><Link to="/settings/account-settings">Settings</Link></p>
				<p className="font-semibold">{userName}</p>
				<Link to="/sign-out"><PiSignOut /></Link>
			</div>
		</div>
	)
}

