import React, { useState, useEffect } from 'react'
import { ethers, BigNumberish } from 'ethers'
import styles from '../styles/Loader.module.css';
import Button from 'react-bootstrap/Button'
interface IProps {
	children?: React.ReactNode
}
enum ConnState {
	INIT,
	LOADING,
	SUCCESS,
	ERROR
}

const AppWalletLoader = (props: IProps) => {

	const [defaultAccount, setDefaultAccount] = useState<string>('');
	const [userBalance, setUserBalance] = useState<string>('');
	const [connState, setConnState] = useState<ConnState>(ConnState.INIT);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const connectWalletHandler = () => {
		setConnState(ConnState.LOADING);
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts' })
				.then((result) => {
					let res = result as string[];
					setDefaultAccount(res[0]);
					getAccountBalance(res[0]);
				})
				.catch(error => {
					setConnState(ConnState.ERROR);
					setErrorMessage(error?.message);
				});
		} else {
			setConnState(ConnState.ERROR);
			setErrorMessage('Please install MetaMask browser extension to interact');
			console.log('Need to install MetaMask');
		}
	}

	const getAccountBalance = (account: string) => {
		window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
			.then(balance => {
				const bal = balance as BigNumberish;
				setUserBalance(ethers.utils.formatEther(bal));
				setConnState(ConnState.SUCCESS);
			})
			.catch(error => {
				setConnState(ConnState.ERROR);
				setErrorMessage(error?.message);
			});
	};

	const chainChangedHandler = () => {
		window.location.reload(); // reload the page to avoid any errors with chain/account change mid use of application
	}

	useEffect(() => {
		connectWalletHandler()
	}, []);

	// listen for account changes
	window.ethereum.on('accountsChanged', chainChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

	return (
		<>
			{connState === ConnState.SUCCESS ?
				<div className={styles.AppLoader}>
					{props.children}
				</div>
				: <div className={styles.AppLoader}>
					<Button onClick={connectWalletHandler}>{'Click here to trigger connection'}</Button>
					<div className={styles.LoadingContainer}>
						<div className={styles.LoadingIndicator}></div>
					</div>
				</div>}
			{connState === ConnState.ERROR &&
				<div className={styles.errorMsg}>
					{errorMessage}
				</div>}
		</>
	);
}

export default AppWalletLoader;