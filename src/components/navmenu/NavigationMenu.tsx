import { PiSignOut } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Logo from "./Logo";
import { FaUserShield } from "react-icons/fa6";
import { FaHamburger } from "react-icons/fa";
import { TbCarrotOff } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { NavLinks } from "./Navlinks";


export const NavigationMenu = () => {
	const { userName, activeUser } = useAuthContext()
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const menuRef = useRef<HTMLDivElement | null>(null)

	const activeUserButton = (
		<NavLink to="/settings/account-settings">
			<button type='button' className="flex justify-center items-center gap-2 border-white border-2 p-2 hover:bg-white">
				<p className="font-semibold"><FaUserShield size={23} /></p>
				<p>{userName}</p>
			</button>
		</NavLink>
	)

	const signOutButton = (
		<NavLink
			className="flex justify-center items-center gap-1"
			to="/sign-out"
		>
			<PiSignOut size={23} />
			<span className="md:hidden">Sign out</span>
		</NavLink>
	)

	// makes the drop down menu close when clicking outside it
	useEffect(() => {
		const clickHandler = (e: MouseEvent) => {
			if (!menuRef.current?.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener("mousedown", clickHandler)

		return () => {
			document.addEventListener("mousedown", clickHandler)
		}
	}, [menuRef])

	return (
		<nav className="flex flex-col backdrop-filter backdrop-blur-lg bg-opacity-30 bg-white">
			<nav className="px-4 py-2 flex justify-between items-center text-black w-full h-full ">
				<h1 className="text-2xl font-extrabold">
					<Logo text link />
				</h1>

				{activeUser && <div className="hidden md:flex">
					<NavLinks />
				</div>}

				{activeUser
					? (<div className="flex justify-between items-center gap-6">

						{activeUserButton}
						<div className="hidden md:flex">
							{signOutButton}
						</div>

						{isOpen
							? (
								<div
									onClick={() => setIsOpen(!isOpen)}
									className="md:hidden text-black"
								>
									<button title="Navigation menu" type="button" className="relative bg-light-background p-4">
										<TbCarrotOff size={25} />
									</button>
								</div>
							)
							: (
								<button
									title="Navigation menu"
									type="button"
									onClick={() => setIsOpen(!isOpen)}
									className="md:hidden p-4"
								>
									<FaHamburger size={25} />
								</button>

							)
						}
					</div>)
					: (<></>)}
			</nav>

			{/* drop down menu */}
			{isOpen &&
				<div
					ref={menuRef as React.LegacyRef<HTMLDivElement>}
					className="z-20 md:hidden text-black py-6 w-full border-b border-gray-500">
					<NavLinks
						onClick={() => setIsOpen(false)}
						className="flex-col"
						signOutButton={signOutButton}
					/>
				</div>
			}
		</nav>

	)
}

