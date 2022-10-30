const main = async () => {
	const gameContractFactory = await hre.ethers.getContractFactory("MyGame")
	const gameContract = await gameContractFactory.deploy(
		["Leo", "Aang", "Pikachu"],
		[
			"https://i.imgur.com/pKd5Sdk.png",
			"https://i.imgur.com/xVu4vFL.png",
			"https://i.imgur.com/WMB6g9u.png",
		],
		[100, 200, 300],
		[500, 500, 500],
		[100, 50, 25],
	)
	await gameContract.deployed()

	console.log("contract deployed at :", gameContract.address)
	console.log("---")

	let txn
	txn = await gameContract.mintCharacterNFT(2) // call mint function to mint 2nd nft of array
	await txn.wait()
	console.log("Minted NFT #1")

	txn = await gameContract.mintCharacterNFT(0)
	await txn.wait()
	console.log("Minted NFT #2")

	txn = await gameContract.mintCharacterNFT(1)
	await txn.wait()
	console.log("Minted NFT #3")

	txn = await gameContract.mintCharacterNFT(2)
	await txn.wait()
	console.log("Minted NFT #4")

	// txn = await gameContract.mintCharacterNFT(3)
	// await txn.wait()
	// console.log("Minted NFT #3");

	// get value of returned NFT uri
	let returnedTokenUri = await gameContract.tokenURI(1) // tokenURI is inherited from ERC721
	console.log("token uri - ", returnedTokenUri)
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
