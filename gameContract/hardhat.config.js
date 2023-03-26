require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

dotenv.config();

module.exports = {
	solidity: {
		version: "0.8.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		scrollAlpha: {
			url: "https://alpha-rpc.scroll.io/l2" || "",
			accounts:
				process.env.PRIV_KEY !== undefined ? [process.env.PRIV_KEY] : [],
		},
	},
};