import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "solidity-coverage";

import * as dotenv from "dotenv";

dotenv.config();

const accounts =
  process.env.MAIN_PRIVATE_KEY !== undefined
    ? process.env.VERIFIER_PRIVATE_KEY !== undefined
      ? [process.env.MAIN_PRIVATE_KEY, process.env.VERIFIER_PRIVATE_KEY]
      : [process.env.MAIN_PRIVATE_KEY]
    : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_LINK_MAINNET || "",
      accounts,
    },
    goerli: {
      url: process.env.ALCHEMY_LINK_GOERLI || "",
      accounts,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  abiExporter: [
    {
      path: "./abi/json",
      runOnCompile: false,
      clear: false,
      flat: true,
      spacing: 2,
      format: "json",
    },
    {
      path: "./abi/minimal",
      runOnCompile: false,
      clear: false,
      flat: true,
      spacing: 2,
      format: "minimal",
    },
    {
      path: "./abi/fullName",
      runOnCompile: false,
      clear: false,
      flat: true,
      spacing: 2,
      format: "fullName",
    },
  ],
};

export default config;
