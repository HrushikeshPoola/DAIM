import Web3 from "web3"

/* */
export interface AppProps {
    contract: any
    web3: Web3
}

export interface STARTUP {
    startupId: number
    key: number
    name: string
    founder: string
    revenue: number
}
