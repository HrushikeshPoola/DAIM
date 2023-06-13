# DAIM

### 1. About
This project aims to enable startups to create and issue Non-Fungible Tokens (NFTs) tailored for venture capitalists (VCs) to buy and trade. By leveraging the ERC721 standard on the Ethereum blockchain, the project develops a comprehensive solution that includes smart contract deployment, token minting, and a user-friendly platform. Startups can tokenize their equity or other digital assets, allowing VCs to purchase and trade these NFTs. The project focuses on ensuring security, transparency, and compliance, providing a trusted platform for startups and VCs to engage in token-based investment and trading activities

 
### 2.File structure
This directory comprises two subdirectories, one dedicated to contract and the other to the frontend UI application.

### 3. Contract
The contract folder contains all the solidity files required for migrating and deploying smart contracts. Additionally, this folder includes test cases for various smart contract use cases.
### 4. App
The app directory consists of UI components designed to serve as an interface for the smart contract.
### 5. Firebase
- Set up a Firebase project.
- Initialize Firebase in daim-app directory using ```firebase init```
- select configurable settings and specify the folder to expose (in our case build directory)
- build web application (to generate build folder to convert typescript to js)
- Deploy application using ```firebase deploy```

### 6. References
- [openZeppelin](https://docs.openzeppelin.com/contracts/3.x/erc721) : For ERC721 Details
- [Blockchain In action](https://www.manning.com/books/blockchain-in-action) : For concepts related to blockchain and smart contracts
- [Firebase](https://firebase.google.com/docs/cli) : firebase deployment steps