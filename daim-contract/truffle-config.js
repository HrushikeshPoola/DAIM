
const HDWalletProvider = require("@truffle/hdwallet-provider");

// const __MEMONIC__ = "sunset coach hat razor inherit stereo glide castle state walk drink logic";
const __MEMONIC__ = "media motion stock pull festival spell juice silver shy hen peanut they learn tuna foot";
const __INFURA_KEY__ = "https://goerli.infura.io/v3/587c83f0608a4d9d908d477fd0166234";

module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(__MEMONIC__, __INFURA_KEY__)
      },
      network_id: '5',
      // gas: 4465030,
      // gasPrice: 10000000000,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  // CONTRACTS DIRECTORY
  contracts_directory: './contracts/',
  contracts_build_directory: "../daim-app/src/BuiltContract/"
};
