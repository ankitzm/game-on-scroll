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
		[30, 60, 50, 50],
		"Thanos",
		"https://bafybeifkradixv5ge6uq3zj43gipaw3lea64ctfyl7agga33mpfvq37q2u.ipfs.dweb.link/thanos.png",
		800,
		800,
		50,
	)
	await gameContract.deployed()

	console.log("contract deployed at :", gameContract.address)
	console.log("---")

	let txn
	txn = await gameContract.mintCharacterNFT(3) // call mint function to mint 2nd nft of array
	await txn.wait()
	console.log("Minted NFT #1")

	// txn = await gameContract.mintCharacterNFT(0)
	// await txn.wait()
	// console.log("Minted NFT #2")

	// txn = await gameContract.mintCharacterNFT(1)
	// await txn.wait()
	// console.log("Minted NFT #3")

	// txn = await gameContract.mintCharacterNFT(2)
	// await txn.wait()
	// console.log("Minted NFT #4")

	// txn = await gameContract.mintCharacterNFT(3)
	// await txn.wait()
	// console.log("Minted NFT #3");

	// get value of returned NFT uri
	let returnedTokenUri = await gameContract.tokenURI(1) // tokenURI is inherited from ERC721
	console.log("token uri - ", returnedTokenUri)

	console.log("---")
	console.log("")
	txn = await gameContract.attackVillan()
	await txn.wait()

	txn = await gameContract.attackVillan()
	await txn.wait()

	txn = await gameContract.reviveVillan()
	await txn.wait()
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
