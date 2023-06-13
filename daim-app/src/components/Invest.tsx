import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import { Button } from 'react-bootstrap';


interface Request {
    reqId: number
    key: number
    investor: string
    startupId: number
    parts: number
    amountPayed: number
    completed: string
}

const _TablColumns = [
    { title: 'Request ID', dataIndex: 'reqId', key: 'reqId', ellipsis: true },
    { title: 'Investor Name', dataIndex: 'investor', key: 'investor', ellipsis: true },
    { title: 'Startup ID', dataIndex: 'startupId', key: 'startupId', ellipsis: true },
    { title: 'Parts', dataIndex: 'parts', key: 'parts', ellipsis: true },
    { title: 'AmountPayed (ether)', dataIndex: 'amountPayed', key: 'amountPayed', ellipsis: true },
    { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true },
    // { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const Invest = (props: AppProps) => {
    const { contract, web3 } = props;
    const [reqCount, setReqCount] = useState<number>(0);
    const [allReqs, setAllReqs] = useState<Request[]>([]);

    const getReqCount = async (onClick?: boolean) => {
        try {
            let reqCount = await contract.methods.getReqCount().call();
            setReqCount(parseInt(reqCount as string));
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const getAllReqs = async () => {
        try {
            let reqs: Request[] = [];
            for (let i = 0; i < reqCount; i++) {
                let res = await contract.methods.investRequests(i).call();
                const req: Request = { _id: i, key: i, ...res, completed: res.completed ? 'true' : 'false' };
                reqs.push(req);
            }
            setAllReqs(reqs);
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const approve = async (reqId: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            let req: Request = allReqs[reqId];
            await contract.methods.approveInvestRequest(reqId).send({ from: account, value: 0 });
            getAllReqs();
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const reject = async (reqId: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.rejectInvestRequest(reqId).send({ from: account, value: 0 });
            getAllReqs();
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    // const createInvestRequest = async (index: number) => {
    //     try {
    //         const [account, ...accs] = await web3.eth.getAccounts();
    //         let investor = await contract.methods.investors(account).call();
    //         if (investor == '') {
    //             showToastUtil({ status: TOAST_TYPE.ERROR, message: 'Please register as a investor first.' });
    //             return;
    //         }
    //         const parts: string = investParts[index] ?? '';
    //         const parts_num = parseInt(parts as string);
    //         const value: string = investValue[index] ?? '';
    //         const ethers = web3.utils.toWei(value, 'wei');
    //         // console.log(ethers);
    //         await contract.methods.createInvestRequest(index, parts_num).send({ from: account, value: ethers });
    //         showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Your request was recorded successfully!' });
    //     } catch (e) {
    //         showToastUtil({ status: TOAST_TYPE.ERROR });
    //         console.error(e);
    //     }
    // }


    useEffect(() => {
        getReqCount();
    }, []);

    useEffect(() => {
        getAllReqs();
    }, [reqCount]);

    const TablColumns = [
        ..._TablColumns,
        // {
        //     title: 'Approve', dataIndex: 'reqId', key: '_approve', ellipsis: true,
        //     render: (value: number, row: any) => <>
        //         {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
        //         {/* <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input>
        //         <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input> */}
        //         <Button onClick={() => approve(value)}>{'Approve'}</Button>
        //     </>
        // },
        // {
        //     title: 'Reject', dataIndex: 'reqId', key: '_reject', ellipsis: true,
        //     render: (value: number, row: any) => <>
        //         <Button onClick={() => reject(value)}>{'Reject'}</Button>
        //     </>
        // },
    ];

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total number of Invest Requests:'}</div>
                <div>{reqCount}{' (requests)'}</div>
                <Button onClick={() => getReqCount(true)}>{'Update'}</Button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allReqs}
                />
            </div>
        </div>
    </>);
}

export default Invest;