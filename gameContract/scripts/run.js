const main = async () => {
	const gameContractFactory = await hre.ethers.getContractFactory("MyGame")
	const gameContract = await gameContractFactory.deploy()
	await gameContract.deployed()

	console.log("contract deployed at :", gameContract.address)
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
