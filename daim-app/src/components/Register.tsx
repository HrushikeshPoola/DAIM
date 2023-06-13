import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import { AppProps } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';

import { Card, Form } from 'react-bootstrap';
import { Column } from 'rc-table';

const Register = (props: AppProps) => {
    const { contract, web3 } = props;

    const [name_startup, setStartupName] = useState<string>('');
    const [name_investor, setIvestorName] = useState<string>('');

    const registerStatup = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.createStartup(name_startup, account).send({ from: account, value: 0 });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Registered Successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const registerInvestor = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.registerAsInvestor(name_investor).send({ from: account, value: 0 });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Registered Successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }
    const [startUpCount, setStartUpCount] = useState<number>(0);
    const [startupList, setStartupList] = useState<any[]>([]);
    const temp = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            console.log('started check');
            let a = await contract.methods.getStartupsCount().call();
            setStartUpCount(a);
            console.log(a);
            // let contributionVal = await contract.methods.contributions(inputAddress).call();
            // showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Registered Successfully!' });
        } catch (e) {
            // showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }
    temp();

    return (<>
        {/* <div className={styles.Container}>
            <div className={styles.Row}>
                <input value={name_startup} placeholder='Enter Startup Name' onChange={e => setStartupName(e.target.value)}></input>
                <Button onClick={registerStatup}>{'Register Startup (Admin Only)'}</Button>
            </div>
            <div className={styles.Row}>
                <input value={name_investor} placeholder='Enter Investor Name' onChange={e => setIvestorName(e.target.value)}></input>
                <Button onClick={registerInvestor}>{'Register as Investor'}</Button>
            </div>
        </div> */}
    <div style={{display:'flex',width:'100%', height:'100%',flexDirection:"column", alignContent:"center"}}>
    
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Register</h3>
          <div className="form-group mt-3">
            <label>Startup</label>
            <Form.Control className="mb-3" value={name_startup} placeholder='Enter Startup Name' onChange={e => setStartupName(e.target.value)} />
            <Button style={{width:'100%'}} onClick={registerStatup}>{'Register Startup (Admin Only)'}</Button>
          </div>
          <div className="form-group mt-3">
            <label>Investor</label>
            <Form.Control className="mb-3" value={name_investor} placeholder='Enter Investor Name' onChange={e => setIvestorName(e.target.value)}/>
            <Button style={{width:'100%'}} onClick={registerInvestor}>{'Register as Investor'}</Button>
          </div>
        </div>
      </form>
    </div>
    </div>
    </>);
}

export default Register;