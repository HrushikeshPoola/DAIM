import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import AppRouter from './components/AppRouter'
import AppWalletLoader from './components/AppWalletLoader'
import ContractJson from './BuiltContract/DAIM.json'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'

interface IProps { }
interface IState { }

class App extends Component<IProps, IState> {

    private _contract: any;
    private _web3: Web3;

    constructor(props: IProps) {
        super(props);
        this._web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this._contract = this.getContract();
    }

    componentDidMount() {
    }

    getContract() {
        const _ABI = ContractJson?.abi ?? [];
        const _address = ContractJson?.networks['5']?.address;
        let contract = new this._web3.eth.Contract((_ABI as any), _address);
        return contract;
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <Header></Header>
                    <AppWalletLoader>
                        <AppRouter web3={this._web3} contract={this._contract} ></AppRouter>
                    </AppWalletLoader>
                </BrowserRouter>
            </>
        );
    }
}

export default App;