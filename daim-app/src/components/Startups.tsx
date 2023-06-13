import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps, STARTUP } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';
const _TablColumns = [
    { title: 'Startup ID', dataIndex: 'startupId', key: 'startupId', ellipsis: true },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Founder', dataIndex: 'founder', key: 'founder', ellipsis: true },
    // { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', ellipsis: true },
    // { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const Startups = (props: AppProps) => {
    const { contract, web3 } = props;
    const [startupsCount, setStartupsCount] = useState<number>(0);
    const [allStartups, setAllStartups] = useState<STARTUP[]>([]);
    const [investParts, setInvestParts] = useState<any>({});
    const [investValue, setInvestValue] = useState<any>({});

    console.log(contract.methods);
    const getStartupsCount = async (onClick?: boolean) => {
        try {
            let startupsCount = await contract.methods.getStartupsCount().call();
            setStartupsCount(parseInt(startupsCount as string));
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const getAllStartups = async () => {
        try {
            let startups: STARTUP[] = [];
            let parts: string[] = [];
            for (let i = 0; i < startupsCount; i++) {
                let res = await contract.methods.startups(i).call();
                const startup: STARTUP = { _id: i, key: i, ...res };
                startups.push(startup);
                parts.push('');
            }
            setAllStartups(startups);
            setInvestParts({});
            setInvestValue({});
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const createInvestRequest = async (index: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            let investor = await contract.methods.investors(account).call();
            if (investor == '') {
                showToastUtil({ status: TOAST_TYPE.ERROR, message: 'Please register as a investor first.' });
                return;
            }
            const parts: string = investParts[index] ?? '';
            const parts_num = parseInt(parts as string);
            const value: string = investValue[index] ?? '';
            const ethers = web3.utils.toWei(value, 'wei');
            // console.log(ethers);
            await contract.methods.createInvestRequest(index, parts_num).send({ from: account, value: ethers });
            // getAllStartups();
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Your request was recorded successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }


    useEffect(() => {
        getStartupsCount();
    }, []);

    useEffect(() => {
        getAllStartups();
    }, [startupsCount]);

    const TablColumns = [
        ..._TablColumns,
        {
            title: 'Invest', dataIndex: 'startupId', key: '_invest', ellipsis: true,
            render: (value: number, row: any) => <>
                {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
                <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input>
                <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input>
                <Button onClick={() => createInvestRequest(value)}>{'Invest'}</Button>
            </>
        },
    ];

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total number of Startups:'}</div>
                <div>{startupsCount}{''}</div>
                <Button onClick={() => getStartupsCount(true)}>{'Update'}</Button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allStartups}
                />
            </div>
        </div>
    </>);
}

export default Startups;