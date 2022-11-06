import React, { useEffect, useState } from "react"
import "./SelectCharacter.css"
import { ethers } from "ethers"
import MyGame from "./../../utils/MyGame.json" // ABI
import {
	CONTRACT_ADDRESS,
	transformCharacterData,
} from "./../../utils/constants"
import LoadingIndicator from "../LoadingIndicator"

const SelectCharacter = ({ setCharacterNFT }) => {
	const [characters, setCharacters] = useState(null)
	const [gameContract, setGameContract] = useState(null)

	// New minting state property
	const [mintingCharacter, setMintingCharacter] = useState(false)

	useEffect(() => {
		const { ethereum } = window

		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const gameContract = new ethers.Contract(
				CONTRACT_ADDRESS,
				MyGame.abi,
				signer,
			)

			setGameContract(gameContract)
		} else {
			console.log("Ethereum object not found")
		}
	}, [])

	useEffect(() => {
		const getCharaters = async () => {
			try {
				console.log("Getting contract charater to mint")

				const characterTxn =
					await gameContract.getAllDefaultCharacters()
				console.log("charaterTxn : ", characterTxn)

				const allCharacters = characterTxn.map(characterData =>
					transformCharacterData(characterData),
				)

				setCharacters(allCharacters)
			} catch (error) {
				console.error("Something went wrong fetching Charater", error)
			}
		}

		const onCharacterMint = async (sender, tokenId, characterIndex) => {
			console.log(
				`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`,
			)

			if (gameContract) {
				const characterNFT = await gameContract.checkIfUserHasNFT()
				console.log("characterNFT : ", characterNFT)
				setCharacterNFT(transformCharacterData(characterNFT))
			}
		}

		if (gameContract) {
			getCharaters()

			// Setup NFT Minted listner
			gameContract.on("CharacterNFTMinted", onCharacterMint)
		}

		return () => {
			// When your component unmounts, let;s make sure to clean up this listener
			if (gameContract) {
				gameContract.off("CharacterNFTMinted", onCharacterMint)
			}
		}
	}, [gameContract])

	const mintCharacterNFT = async characterId => {
		try {
			if (gameContract) {
				// loading indicator
				setMintingCharacter(true)

				console.log("Minting charater ...")
				const mintTxn = await gameContract.mintCharacterNFT(characterId)
				await mintTxn.wait()
				console.log("mintTxn : ", mintTxn)
				alert(
					`Your NFT is all done -- see it here: https://goerli.pixxiti.com/nfts/${CONTRACT_ADDRESS}/${characterId.toNumber()}`,
				)

				setMintingCharacter(false)
			}
		} catch (error) {
			console.warn("MintCharaterAction error : ", error)

			// hide indicators if some problem occurs
			setMintingCharacter(false)
		}
	}

	return (
		<>
			<h2>Mint Your Hero. Choose wisely.</h2>
			<div className="select-character-container">
				{/* Rendered Characters */}

				{characters != null &&
					characters.length > 0 &&
					characters.map((character, index) => (
						<div className="character-grid" key={index}>
							<div
								className="character-item"
								key={character.name}
							>
								<div className="name-container">
									<p>{character.name}</p>
								</div>
								<img
									src={character.imageURI}
									alt={character.name}
								/>
								<button
									type="button"
									className="character-mint-button"
									onClick={() => mintCharacterNFT(index)}
								>{`Mint ${character.name}`}</button>
							</div>
						</div>
					))}

				{mintingCharacter && (
					<div className="loading">
						<div className="indicator">
							<LoadingIndicator />
							<p>Minting In Progress...</p>
						</div>
						<img
							src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
							alt="Minting loading indicator"
						/>
					</div>
				)}
			</div>
		</>
	)
}

export default SelectCharacter
