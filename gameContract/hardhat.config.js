require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL, PRIVATE_ACCOUNT_KEY } = process.env

module.exports = {
	solidity: "0.8.17",
	networks: {
		mumbai: {
			url: ALCHEMY_API_URL,
			accounts: [PRIVATE_ACCOUNT_KEY],
		},
	},
}
