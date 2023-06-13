import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps, STARTUP } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
interface Request {
    reqId: number
    key: number
    tokenId: number
    tokenOwner: string
    buyee: string
    amountPayed: number
    completed: string
}

const _TablColumns = [
    { title: 'Request ID', dataIndex: 'reqId', key: 'reqId', ellipsis: true },
    { title: 'Token ID', dataIndex: 'tokenId', key: 'tokenId', ellipsis: true },
    { title: 'Buyee Name', dataIndex: 'buyee', key: 'buyee', ellipsis: true },
    // { title: 'Startup ID', dataIndex: 'startupId', key: 'startupId', ellipsis: true },
    { title: 'AmountPayed (ether)', dataIndex: 'amountPayed', key: 'amountPayed', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true },
    // { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const BuyTokenRequests = (props: AppProps) => {
    const { contract, web3 } = props;
    const [reqCount, setReqCount] = useState<number>(0);
    const [allReqs, setAllReqs] = useState<Request[]>([]);


    const getAllReqs = async (onClick?: boolean) => {
        try {
            let res = await contract.methods.getBuyReqCount().call();
            let reqCount = (parseInt(res as string));

            let reqs: Request[] = [];
            let my_reqs: Request[] = [];
            for (let i = 0; i < reqCount; i++) {
                let res = await contract.methods.buyRequests(i).call();
                const req: Request = { _id: i, key: i, ...res, completed: res.completed ? 'true' : 'false' };
                if (req.completed !== 'true') reqs.push(req);
            }
            console.log(reqs);
            const [account, ...accs] = await web3.eth.getAccounts();

            my_reqs = reqs.filter((req) => req.tokenOwner === account);

            setAllReqs(my_reqs);
            setReqCount(my_reqs.length);
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const approve = async (reqId: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            let req: Request = allReqs[reqId];
            await contract.methods.approveBuyRequest(reqId).send({ from: account, value: 0 });
            getAllReqs();
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const reject = async (reqId: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.rejectbuyRequest(reqId).send({ from: account, value: 0 });
            getAllReqs();
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    useEffect(() => {
        getAllReqs();
    }, []);

    const TablColumns = [
        ..._TablColumns,
        {
            title: 'Approve', dataIndex: 'reqId', key: '_approve', ellipsis: true,
            render: (value: number, row: any) => <>
                {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
                {/* <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input>
                <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input> */}
                <Button onClick={() => approve(value)}>{'Approve'}</Button>
            </>
        },
        {
            title: 'Reject', dataIndex: 'reqId', key: '_reject', ellipsis: true,
            render: (value: number, row: any) => <>
                <Button onClick={() => reject(value)}>{'Reject'}</Button>
            </>
        },
    ];

    return (<>
        {/* <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total number of Invest Requests:'}</div>
                <div>{reqCount}{' (requests)'}</div>
                <Button onClick={() => getAllReqs(true)}>{'Update'}</Button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allReqs}
                />
            </div>
        </div> */}
        <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start', alignItems : 'flex-start',overflow: 'auto'}}>
    {allReqs.length && allReqs.map((req, i , arr) => {
        return (<>
            <div key = {req.key} className="card" style={{width: "20rem", height:"12rem", margin:'5px', boxShadow:'2px 2px 1px #ddd'}}>
            <button className="navbar-btn includer">
                <i className="fas fa-file-invoice-dollar fa-lg"></i>
            </button>
                <div className="card-body">
                    <h5 style={{fontSize:'10px'}} className="card-title"><span>Buyer : {req.buyee}</span></h5>
                    <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start', alignItems:'center', overflow: 'auto'}}>
                    <span><Button style={{fontSize:'10px', margin:'5px'}} variant="primary">Token Id <Badge bg="secondary">{req.tokenId}</Badge></Button></span>    
                    <span><Button style={{fontSize:'10px', margin:'5px'}}  variant="primary">Amount Paid <Badge bg="secondary">{req.amountPayed}</Badge></Button></span>
                </div>
                </div>
                <div className="card-footer" style={{display:'flex', flexDirection:'row-reverse', flexWrap:'wrap', overflow: 'auto'}}>
                    <a className="card-link" style={{fontSize:'12px', margin:'10px'}}><Button style={{backgroundColor:'inherit', color:'red'}} type="button" className="btn btn-outline-danger" onClick={() => reject(req.reqId)}>{'Reject'}</Button></a>
                    <a className="card-link" style={{fontSize:'12px', margin:'10px'}}><Button style={{backgroundColor:'inherit', color:'#0d6efd'}} onClick={() => approve(req.reqId)}>{'Approve'}</Button></a>

                </div>
            </div>
        </>);
    })}
    </div>
    </>);
}

export default BuyTokenRequests;