const main = async () => {
	const gameContractFactory = await hre.ethers.getContractFactory("MyGame")
	const gameContract = await gameContractFactory.deploy(
		["Captain America", "Thor", "Wanda", "Iron man"],
		[
			"QmZpLKWGaXxTEgjGDJhTogNDYCs7TZPgRnFbsHUYrZFSrg/captain-america.jpg",
			"QmZpLKWGaXxTEgjGDJhTogNDYCs7TZPgRnFbsHUYrZFSrg/thor.png",
			"QmZpLKWGaXxTEgjGDJhTogNDYCs7TZPgRnFbsHUYrZFSrg/wanda.png",
			"QmZpLKWGaXxTEgjGDJhTogNDYCs7TZPgRnFbsHUYrZFSrg/iron-man.jpg",
		],
		[300, 400, 400, 350],
		[500, 500, 500, 500],
		[45, 60, 55, 50],
		"Thanos",
		"QmZpLKWGaXxTEgjGDJhTogNDYCs7TZPgRnFbsHUYrZFSrg/thanos.png",
		800,
		800,
		30,
	)
	await gameContract.deployed()

	console.log("contract deployed at :", gameContract.address)
	console.log("---")
}

const runMain = async () => {
	try {
		await main()
		process.exit(0)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

runMain()
