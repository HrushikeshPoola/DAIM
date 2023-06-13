import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar, { NavBarLinkProps } from './NavBar';
import { AppProps } from '../types';
import styles from '../styles/Main.module.css';
import Startups from './Startups';
import Admin from './Admin';
import Register from './Register';
import { ToastContainer } from 'react-toastify';
import Invest from './Invest';
import BuyTokens from './BuyTokens';
import NFTData from './NFTData';
import MyNFT from './MyNFT';
import InvestRequestsStartup from './InvestRequestsStartup';
import BuyTokenRequests from './BuyTokenRequets';
import './card.css';

export const RouteUrls = {
    Root: "/",
    Campaign: "campaign",
    Contribute: "contribute",
    Startups: "startups",
    Admin: "admin",
    Mint: "mint",
};

const navLinkClasses = {
    activeClassName: 'SubNavbarLinkActive',
    className: 'SubNavbarLink'
}
const NavLinks: NavBarLinkProps[] = [
    {
        ...navLinkClasses,
        text: "Register",
        to: 'reg-startup',
    },
    {
        ...navLinkClasses,
        text: "Startups Info",
        to: 'startups',
    },
    {
        ...navLinkClasses,
        text: "Investment Requests - Startup",
        to: 'invest-req-startup',
    },
    {
        ...navLinkClasses,
        text: "MY NFTs",
        to: 'my-nft',
    },
    {
        ...navLinkClasses,
        text: "Tokens Marketplace",
        to: 'buytokens',
    },
    {
        ...navLinkClasses,
        text: "NFT Puchase Requests",
        to: 'mynftreqs',
    },

];
const AdminLinks: NavBarLinkProps[] = [
    {
        ...navLinkClasses,
        text: "Admin - NFT",
        to: 'nftdata',
    },
    {
        ...navLinkClasses,
        text: "Admin - Investment Requests",
        to: 'invest-reqs',
    },
]


const SubPages = (params: AppProps & {isAdmin: boolean}) => {
    const {isAdmin, ...props} = params;
    return (
        <Routes>
            <Route path='reg-startup' element={<Register {...props} />} />
            <Route path={'startups'} element={<Startups {...props}></Startups>} />
            <Route path={'invest-req-startup'} element={<InvestRequestsStartup {...props}></InvestRequestsStartup>} />
            <Route path={'my-nft'} element={<MyNFT {...props}></MyNFT>} />
            <Route path={'buytokens'} element={<BuyTokens {...props}></BuyTokens>} />
            <Route path={'mynftreqs'} element={<BuyTokenRequests {...props}></BuyTokenRequests>} />
            {isAdmin && <Route path={'nftdata'} element={<NFTData {...props}></NFTData>} />}
            {isAdmin && <Route path={'invest-reqs'} element={<Invest {...props}></Invest>} />}
            <Route path={'/*'} element={<Navigate to={'startups'} replace={true} />} />
        </Routes>
    );
};

const AppRouter = (props: AppProps) => {
    const { web3, contract } = props;

    const [isAdmin, setAdmin] = useState<boolean>(false);

    useEffect(() => {
        const checkIfAdmin = async() => {
            try {
                const [account, ...accs] = await web3.eth.getAccounts();
                const adminAcc = await contract.methods.admin().call();
                setAdmin(account === adminAcc)
            } catch(e) {
                setAdmin(true)
            }
        };
        checkIfAdmin()
    }, []);

    return (<>
        <div className={styles.Container}>
            <div className={styles.subNavHeaderContainer}>
                <div className={styles.subNavHeaderLinksContainer}>
                    <Navbar links={isAdmin ? [...NavLinks, ...AdminLinks] : NavLinks} />
                </div>
            </div>
            <div className={styles.SubTabContentContainer}>
                <SubPages {...props} isAdmin={isAdmin} />
            </div>
            <ToastContainer />

        </div>
    </>);
}
export default AppRouter;