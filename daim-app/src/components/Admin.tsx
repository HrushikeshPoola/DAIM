import React, { useState, useEffect } from 'react'
import { AppProps } from '../types';
import styles from '../styles/Component.module.css';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const Admin = (props: AppProps) => {
    const { contract, web3 } = props;

    const [desc, setDesc] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [amt, setAmt] = useState<string>('');
    const createSpendingRequest = async () => {
        try {
            const ethers = web3.utils.toWei(amt, 'wei');
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.createSpendingRequest(desc, recipient, ethers).send({ from: account, value: 0 });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Completed successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [reqID, setReqID] = useState<string>('');
    const approveRequest = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.makePayment(parseInt(reqID)).send({ from: account, value: 0 });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Completed successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    function ContainerFluidExample() {
        return (
          <Container className={styles.Container}>
            <Row className={styles.Row}>
              <Col className={styles.Column}><input value={desc} placeholder='Enter Description for Spending Request' onChange={e => setDesc(e.target.value)} ></input></Col>
              <Col className={styles.Column}><input value={desc} placeholder='Enter Description for Spending Request' onChange={e => setDesc(e.target.value)} ></input></Col>
            </Row>
          </Container>
        );
      }

    return (<>
        <div className={styles.Container}>
        <ContainerFluidExample/>
            <div className={styles.Row}>
                <input value={desc} placeholder='Enter Description for Spending Request' onChange={e => setDesc(e.target.value)} ></input>
                <input value={recipient} placeholder='Enter Recipient Wallet Address' onChange={e => setRecipient(e.target.value)} ></input>
                <input value={amt} placeholder='Enter Contribution Amount (Wei)' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onChange={e => setAmt(e.target.value)}
                ></input>
                <Button onClick={createSpendingRequest}>{'Create Spending Request'}</Button>
            </div>
            <div className={styles.Row}>
                <input value={reqID} placeholder='Enter Request ID' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onChange={e => setReqID(e.target.value)}
                ></input>
                <Button onClick={approveRequest}>{'Try Approve Request and Make Payment'}</Button>
            </div>
        </div>
    </>);
}

export default Admin;