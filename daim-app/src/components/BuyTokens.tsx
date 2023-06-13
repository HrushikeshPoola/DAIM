import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';

interface Token {
    _id: number
    tokenId: number
    key: number
    uri: string
    // founder: string
    // revenue: number
}

const _TablColumns = [
    { title: 'Token ID', dataIndex: 'tokenId', key: 'tokenId', ellipsis: true },
    { title: 'Token URI', dataIndex: 'uri', key: 'uri', ellipsis: true },
    // { title: 'Founder', dataIndex: 'founder', key: 'founder', ellipsis: true },
    // { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', ellipsis: true },
    // { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const BuyTokens = (props: AppProps) => {
    const { contract, web3 } = props;
    const [tokensCount, setTokensCount] = useState<number>(0);
    const [allTokens, setAllTokens] = useState<Token[]>([]);
    const [investParts, setInvestParts] = useState<any>({});
    const [investValue, setInvestValue] = useState<any>({});

    const getAllTokens = async (onClick?: boolean) => {
        try {
            let tokensCount = await contract.methods.getTokensForSaleCount().call();
            let tokens: Token[] = [];
            // let parts: string[] = [];
            for (let i = 0; i < tokensCount; i++) {
                let res = await contract.methods.tokensForSale(i).call();
                const tokenId = parseInt(res as string);
                console.log('tokenId', tokenId);
                let isForSale = await contract.methods.tokensForSaleMap(tokenId).call();
                console.log('isForSale', isForSale);
                if (isForSale) {
                    let uri = await contract.methods.tokenURI(tokenId).call();
                    const token: Token = { tokenId: tokenId, _id: i, key: i, uri: uri };
                    tokens.push(token);    
                }
                tokens = tokens.filter((value, index, self) => {
                    return self.findIndex(t => t.tokenId === value.tokenId) === index;
                });
            }
            setTokensCount(tokens.length);
            setAllTokens(tokens);
            setInvestParts({});
            setInvestValue({});
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const buyFromOtherInvestor = async (index: number, tokenId: string | number) => {
        console.log(index, tokenId);
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            let investor = await contract.methods.investors(account).call();
            if (investor == '') {
                showToastUtil({ status: TOAST_TYPE.ERROR, message: 'Please register as a investor first.' });
                return;
            }
            // const parts: string = investParts[index] ?? '';
            // const parts_num = parseInt(parts as string);
            const value: string = investValue[index] ?? '0';
            const ethers = web3.utils.toWei(value, 'wei');
            await contract.methods.createBuyRequest(`${tokenId}`).send({ from: account, value: ethers });
            // getAllStartups();
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Buy request placed successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }


    useEffect(() => {
        getAllTokens();
    }, []);


    const TablColumns = [
        ..._TablColumns,
        {
            title: 'Purchase', dataIndex: '_id', key: '_purchase', ellipsis: true,
            render: (value: number, row: any) => <>
                {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
                {/* <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input> */}
                <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input>
                <Button onClick={() => buyFromOtherInvestor(value, row?.tokenId)}>{'Place Purchase request'}</Button>
            </>
        },
    ];

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total number of token available to purchase:'}</div>
                <div>{tokensCount}{''}</div>
                <Button onClick={() => getAllTokens(true)}>{'Update'}</Button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allTokens}
                />
            </div>
        </div>
    </>);
}

export default BuyTokens;