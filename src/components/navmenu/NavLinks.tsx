import { NavLink } from "react-router-dom"

type NavLinksProps = {
	className?: string
	onClick?: React.MouseEventHandler<HTMLUListElement> | undefined
	signOutButton?: JSX.Element
}

export const NavLinks: React.FC<NavLinksProps> = ({ className, onClick, signOutButton }) => {
	return (
		<ul onClick={onClick} className={"flex items-center justify-center gap-6 md:gap-10 " + (className ?? '')}>
			<li>
				<NavLink to="/">
					Home
				</NavLink>
			</li>
			<li>
				<NavLink to="/meals">
					Meals
				</NavLink>
			</li>
			<li>
				<NavLink to="/weeks">
					Weeks
				</NavLink>
			</li>
			<li>
				{signOutButton}
			</li>
		</ul>
	)
}
