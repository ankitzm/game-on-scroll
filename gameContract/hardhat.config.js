require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL, PRIVATE_GOERLI_ACCOUNT_KEY } = process.env

module.exports = {
	solidity: "0.8.17",
	networks: {
		goerli: {
			url: ALCHEMY_API_URL,
			accounts: [PRIVATE_GOERLI_ACCOUNT_KEY],
		},
	},
}
