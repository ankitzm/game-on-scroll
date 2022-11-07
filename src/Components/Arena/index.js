import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, transformCharacterData } from "../../utils/constants"
import myGame from "./../../utils/MyGame.json"
import "./Arena.css"
import LoadingIndicator from "../LoadingIndicator"

function Arena({ characterNFT, currentAccount, setCharacterNFT }) {
	const [gameContract, setGameContract] = useState(null)
	const [villan, setVillan] = useState(null)
	const [attackState, setAttackState] = useState("")

	// Toast state management
	const [showToast, setShowToast] = useState("")

	useEffect(() => {
		const { ethereum } = window

		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const gameContract = new ethers.Contract(
				CONTRACT_ADDRESS,
				myGame.abi,
				signer,
			)

			setGameContract(gameContract)
		} else {
			console.log("Ethereum object not found")
		}
	}, [])

	useEffect(() => {
		// fetching villan from smart contract
		const fetchVillan = async () => {
			const villanTxn = await gameContract.getVillan()
			console.log("Villan : ", villanTxn)
			console.log("transform", transformCharacterData(villanTxn))
			setVillan(transformCharacterData(villanTxn))
		}

		// event to update character HP after attack
		const onAttackComplete = (from, newVillanHp, newPlayerHp) => {
			const villanHp = newVillanHp.toNumber()
			const playerHp = newPlayerHp.toNumber()
			const sender = from.toString()

			console.log(
				`Attack Complete : VillanHp- ${villanHp} and PlayerHp - ${playerHp} - ${sender}`,
			)

			// if our player hp updated
			if (currentAccount === sender.toLowerCase()) {
				setVillan(prevState => {
					return { ...prevState, hp: villanHp }
				})

				setCharacterNFT(prevState => {
					return { ...prevState, hp: playerHp }
				})
			}

			// if player is't ours, update villan hp only
			else {
				setVillan(prevState => {
					return { ...prevState, hp: villanHp }
				})
			}
		}

		if (gameContract) {
			fetchVillan()
			gameContract.on("AttackComplete", onAttackComplete)
		}
	}, [gameContract, setCharacterNFT, currentAccount])

	const runAttackAction = async () => {
		try {
			if (gameContract) {
				setAttackState("attacking")
				console.log("attacking villan ...")
				const attackTxn = await gameContract.attackVillan()
				console.log("attackTxn : ", attackTxn)
				setAttackState("hit")

				// Toast State

				setShowToast(true)
				setTimeout(() => {
					setShowToast(false)
				}, 8000)
			}
		} catch (error) {
			console.error("Error attacking villan : ", error)
			setAttackState("")
		}
	}

	return (
		<div className="arena-container">
			{/* Add your toast HTML right here */}
			{villan && characterNFT && (
				<div className={`toast ${showToast ? "show" : ""}`}>
					<div className="desc">{`💥 ${villan.name} was hit for ${characterNFT.attackDamage}!`}</div>
				</div>
			)}

			{/* Villan */}

			{villan && (
				<div className="villan-container">
					<div className={`villan-content ${attackState}`}>
						<h2>🔥 {villan.name} 🔥</h2>
						<div className="image-content">
							<img
								// src={`https://ipfs.io/ipfs/${villan.imageURI}`}
								src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQczw5NblVSMOzJx0jujbn07S69a2TkJm6kOw&usqp=CAU"
								alt={`villan ${villan.name}`}
							/>
							<div className="health-bar">
								<progress
									value={villan.hp}
									max={villan.maxHp}
								/>
								<p>{`${villan.hp} / ${villan.maxHp} HP`}</p>
							</div>
						</div>
					</div>
					<div className="attack-container">
						<button
							className="cta-button"
							onClick={runAttackAction}
						>
							{`💥 Attack ${villan.name}`}
						</button>
					</div>

					{/* Attacking state loader */}
					{attackState === "attacking" && (
						<div className="loading-indicator">
							<LoadingIndicator />
							<p>Attacking ⚔️</p>
						</div>
					)}
				</div>
			)}

			{/* character NFT */}

			{characterNFT && (
				<div className="players-container">
					<div className="player-container">
						<h2>Your Character</h2>
						<div className="player">
							<div className="image-content">
								<h2>{characterNFT.name}</h2>
								<img
									src={`https://ipfs.io/ipfs/${characterNFT.imageURI}`}
									alt={`Character ${characterNFT.name}`}
								/>
								<div className="health-bar">
									<progress
										value={characterNFT.hp}
										max={characterNFT.maxHp}
									/>
									<p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
								</div>
							</div>
							<div className="stats">
								<h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Arena
