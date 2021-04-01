require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY=process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.3",
  networks: {
    goerli: {
      url: `https://rpc.slock.it/goerli`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/` + process.env.RPC_API_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};

