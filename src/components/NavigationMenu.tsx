import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";

export const NavigationMenu = () => {
	return (
		<div className="flex justify-between items-center">
			<h1 className="text-lg font-bold">
				<Link to="/">Maträttsroulette 🥘</Link>
			</h1>
			<div className="flex justify-between items-center gap-3">
				<p><Link to="/preferences">Preferences</Link></p>
				<p><Link to="/settings">Settings</Link></p>
				<Link to="/sign-out"><PiSignOut /></Link>
			</div>
		</div>
	)
}

