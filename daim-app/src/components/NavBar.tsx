import * as React from "react";
import { NavLink } from 'react-router-dom';

export interface NavBarLinkProps {
    to : string,
    text : string,
    activeClassName ?: string,
    className ?: string,
}

interface NavBarProps {
    links: NavBarLinkProps[];
}

const Navbar = (props: NavBarProps) => {
    const navLinks = props.links;
    return (
        <nav>{navLinks.map((link, index) => {
            const {text, activeClassName, className, ...rest} = link;
            return <NavLink className={({isActive}) => (isActive ? `${activeClassName} ${className}` : className)} 
            {...rest} key={`link-${index}`} onClick={() => {}}>{text}</NavLink>
        })}
        </nav>
    );
} 

export default Navbar;