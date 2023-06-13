import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';
interface Token {
    tokenId: number
    key: number
    uri: string
    price: string
    // founder: string
    // revenue: number
}

interface NFT_DAIM {
    name: string,
    symbol: string,
    totalSupply: number
    // MAX_SUPPLY: number
    // MAX_SUPPLY_USER: number
}

const _TablColumns = [
    { title: 'Token ID', dataIndex: 'tokenId', key: 'tokenId', ellipsis: true },
    { title: 'Token URI', dataIndex: 'uri', key: 'uri', ellipsis: true },
    { title: 'Asset Price', dataIndex: 'price', key: 'price', ellipsis: true },
    // { title: 'Founder', dataIndex: 'founder', key: 'founder', ellipsis: true },
    // { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', ellipsis: true },
    // { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    // { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const NFTData = (props: AppProps) => {
    const { contract, web3 } = props;
    const [tokensCount, setTokensCount] = useState<number>(0);
    const [allTokens, setAllTokens] = useState<Token[]>([]);
    const [investParts, setInvestParts] = useState<any>({});
    const [investValue, setInvestValue] = useState<any>({});

    const [nftData, setNftData] = useState<NFT_DAIM>({ name: '', symbol: '', totalSupply: 0 });
    const getNftData = async () => {
        try {
            const name = await contract.methods.name().call();
            const symbol = await contract.methods.symbol().call();
            const totalSupply = await contract.methods.totalSupply().call();
            setNftData({ name, symbol, totalSupply });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }


    const totalSupply = async (onClick?: boolean) => {
        try {
            let tokensCount = await contract.methods.totalSupply().call();
            setTokensCount(parseInt(tokensCount as string));
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const getAllTokens = async () => {
        try {
            console.log('in all :')
            let tokens: Token[] = [];
            // let parts: string[] = [];
            for (let i = 1; i <= tokensCount; i++) {
                // let res = await contract.methods.tokensForSale(i).call();
                // const tokenId = parseInt(res as string);
                console.log('in for :', i);
                let uri = await contract.methods.tokenURI(`${i}`).call();
                let price = await contract.methods.tokenPriceMap(`${i}`).call();
                console.log('uri:', uri);
                const token: Token = { tokenId: i, key: i, uri: uri, price: price };
                tokens.push(token);
            }
            setAllTokens(tokens);
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    useEffect(() => {
        getNftData();
        totalSupply();
    }, []);

    useEffect(() => {
        getAllTokens();
    }, [tokensCount]);

    const TablColumns = [
        ..._TablColumns,
        // {
        //     title: 'Invest', dataIndex: 'startupId', key: '_invest', ellipsis: true,
        //     render: (value: number, row: any) => <>
        //         {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
        //         <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input>
        //         <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input>
        //         <button onClick={() => createInvestRequest(value)}>{'Invest'}</button>
        //     </>
        // },
    ];

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{`NFT Token Name: ${nftData.name}`}</div>
                <div>{`NFT Token Symbol: ${nftData.symbol}`}</div>
            </div>
            <div className={styles.Row}>
                <div>{'Total NFTs in circulation:'}</div>
                <div>{tokensCount}{''}</div>
                <Button onClick={() => totalSupply(true)}>{'Update'}</Button>
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

export default NFTData;