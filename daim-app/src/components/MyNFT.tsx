import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { AppProps } from '../types';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

interface Token {
    tokenId: number
    key: number
    uri: string
    price: string
    // founder: string
    // revenue: number
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


const MyNFT = (props: AppProps) => {
    const { contract, web3 } = props;
    const [tokensCount, setTokensCount] = useState<number>(0);
    const [tokenIDs, setTokenIDs] = useState<string[]>([]);
    const [allTokens, setAllTokens] = useState<Token[]>([]);
    const [investParts, setInvestParts] = useState<any>({});
    const [investValue, setInvestValue] = useState<any>({});

    const userSupply = async (onClick?: boolean) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            let tokensCount = await contract.methods.balanceOf(account).call();
            setTokensCount(parseInt(tokensCount as string));
            let ids: string[] = [];
            for (let i = 0; i < tokensCount; i++) {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
                ids.push((tokenId as string));
            }
            setTokenIDs(ids);
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const getAllTokens = async () => {
        console.log(tokenIDs);
        try {
            let tokens: Token[] = [];
            for (let i = 0; i < tokensCount; i++) {
                const tokenId = parseInt(tokenIDs[i] as string);
                let uri = await contract.methods.tokenURI(`${tokenId}`).call();
                let price = await contract.methods.tokenPriceMap(`${tokenId}`).call();
                const token: Token = { tokenId: tokenId, key: i, uri: uri, price: price };
                tokens.push(token);
            }
            setAllTokens(tokens);
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const putYourShareForSale = async (index: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            const res: string = await contract.methods.putYourShareForSale(index).send({ from: account, value: 0 });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: `Token ID: ${index} placed for sale successfully!` });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    useEffect(() => {
        userSupply();
    }, []);

    useEffect(() => {
        getAllTokens();
    }, [tokenIDs.length]);

    const TablColumns = [
        ..._TablColumns,
        {
            title: 'Sale', dataIndex: 'tokenId', key: '_sale', ellipsis: true,
            render: (value: number, row: any) => <>
                {/* <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> */}
                {/* <input value={investParts[value]} placeholder='Enter Parts to purchase' onChange={e => setInvestParts({ ...investParts, [value]: e.target.value })}></input>
                <input value={investValue[value]} placeholder='Enter Amount (wei)' onChange={e => setInvestValue({ ...investValue, [value]: e.target.value })}></input> */}
                <Button onClick={() => putYourShareForSale(value)}>{'Place your token for sale on our marketplace'}</Button>
            </>
        },
    ];

    return (<>
        {/* <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total NFTs owned:'}</div>
                <div>{tokensCount}{''}</div>
                <Button onClick={() => userSupply(true)}>{'Update'}</Button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allTokens}
                />
            </div>
        </div> */}
        <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start', alignItems : 'flex-start',overflow: 'auto'}}>
        
        {allTokens.length && allTokens.map((req, i , arr) => {
        const token_details = req.uri.split("_");
        return (<>
            <div key = {req.tokenId} className="card" style={{width: "20rem", height:"10rem", margin:'5px', boxShadow:'2px 2px 1px #ddd'}}>
            <button className="navbar-btn includer">
                <i className="fas fa-file-invoice-dollar fa-lg"></i>
                <span className="badge badge-success">startup {token_details[0]}</span>
            </button>
                <div className="card-body mt-4">
                    <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start', alignItems:'center', overflow: 'auto'}}>
                    <span><Button style={{fontSize:'10px', margin:'5px'}} variant="primary">Price <Badge bg="secondary">{req.price}</Badge></Button></span>  
                    <span><Button style={{fontSize:'10px', margin:'5px'}} variant="primary">Token Id <Badge bg="secondary">{req.tokenId}</Badge></Button></span>    
                    <span><Button style={{fontSize:'10px', margin:'5px'}} variant="primary">Parts <Badge bg="secondary">{token_details[1]}</Badge></Button></span>    

                </div>
                </div>
                <div className="card-footer" style={{display:'flex', flexDirection:'row-reverse', flexWrap:'wrap', overflow: 'auto', padding:'0px', borderRadius:'0px'}}>
                    <a className="card-link" style={{fontSize:'12px', width:'100%'}}><Button style={{backgroundColor:'#ddd', color:'#000', borderRadius:'0px', border:'0px' , fontSize:'15px' ,width:'100%'}} onClick={() => putYourShareForSale(req.tokenId)}>{'Place your token for sale'}</Button></a>

                </div>
            </div>
        </>);
    })}
    </div>
    </>);
}

export default MyNFT;