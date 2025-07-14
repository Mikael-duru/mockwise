import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserButton from "./user-button";

const Header = async ({ user }: { user: User }) => {
	return (
		<header>
			<div className="flex justify-between items-center">
				<Link href={"/"} className="flex items-center gap-2">
					<Image src={"/logo.svg"} alt="logo" width={36} height={30} />
					<h2 className="text-primary-100">MockWise</h2>
				</Link>

				<UserButton user={user} />
			</div>
		</header>
	);
};

export default Header;
