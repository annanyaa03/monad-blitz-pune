import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
dotenv.config();

const MONAD_TESTNET_RPC_URL =
  process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz";
const MONAD_TESTNET_CHAIN_ID = Number(process.env.MONAD_TESTNET_CHAIN_ID || "10143");
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      metadata: {
        bytecodeHash: "ipfs"
      }
    }
  },
  networks: {
    hardhat: {},
    monadTestnet: {
      url: MONAD_TESTNET_RPC_URL,
      chainId: MONAD_TESTNET_CHAIN_ID,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      monadTestnet: process.env.MONADSCAN_API_KEY || "empty"
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: MONAD_TESTNET_CHAIN_ID,
        urls: {
          apiURL: "https://testnet.monadscan.com/api",
          browserURL: "https://testnet.monadscan.com"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://monadvision.com"
  }
};

