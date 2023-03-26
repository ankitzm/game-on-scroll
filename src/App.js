import React, { useEffect, useState } from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"
import { ethers } from "ethers"
import SelectCharacter from "./Components/SelectCharacter"
import MyGame from "./utils/MyGame.json" // ABI
import { CONTRACT_ADDRESS, transformCharacterData } from "./utils/constants"
import LoadingIndicator from "./Components/LoadingIndicator"
import Arena from "./Components/Arena"

const App = () => {
	const [currentAccount, setCurrentAccount] = useState(null)
	const [characterNFT, setCharacterNFT] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const checkWalletConnection = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log("make sure you have Metamask")

				// loader if wallet is not connected
				setIsLoading(false)
				return
			} else {
				console.log("we got the ethereum object !!", ethereum)

				const accounts = await ethereum.request({
					method: "eth_accounts",
				})

				if (accounts.length !== 0) {
					const account = accounts[0]
					console.log("Found an authorised account - ", account)
					setCurrentAccount(account)
				} else {
					console.log("Can't find authorised account")
				}
			}
		} catch (error) {
			console.log(error)
		}

		// remove loader after all the logic
		setIsLoading(false)
	}

	// connect wallet
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log("make sure you have Metamsk")
				return
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			})

			console.log("Connected", accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log(error)
		}
	}

	const renderContent = () => {
		if (isLoading) {
			return <LoadingIndicator />
		}

		if (!currentAccount) {
			return (
				<div className="connect-wallet-container">
					<img
						src="https://media.tenor.com/ZwbmKH038isAAAAd/thanos-snap.gif"
						alt="Thanos Snap GIF"
					/>
					<button
						className="cta-button connect-wallet-button"
						onClick={connectWallet}
					>
						Connect Wallet and save the World !!
					</button>
				</div>
			)
		} else if (currentAccount && !characterNFT) {
			return <SelectCharacter setCharaterNFT={setCharacterNFT} />
		} else if (currentAccount && characterNFT) {
			return (
				<Arena
					characterNFT={characterNFT}
					setCharacterNFT={setCharacterNFT}
					currentAccount={currentAccount}
				/>
			)
		}
	}

	const checkNetwork = async () => {
		try {
			const { ethereum } = window
			if (window.ethereum.networkVersion !== "534353") {
				alert("Please connect to Goerli!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	// runs the function once the page loads
	useEffect(() => {
		setIsLoading(true)
		checkWalletConnection()
	}, [])

	useEffect(() => {
		const fetchNFTMetadata = async () => {
			console.log("Checking NFT held by ", currentAccount)

			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const gameContract = new ethers.Contract(
				CONTRACT_ADDRESS,
				MyGame.abi,
				signer,
			)

			const txn = await gameContract.checkIfUserHasNFT()

			if (txn.name) {
				console.log("User has an Avenger NFT")
				setCharacterNFT(transformCharacterData(txn))
			} else {
				console.log("No NFT Character found")
			}

			// set loading state to 'off'
			setIsLoading(false)
		}

		if (currentAccount) {
			console.log("current account", currentAccount)
			fetchNFTMetadata()
		}
	}, [currentAccount])

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⚔️ ENDGAME ⚔️</p>
					<p className="sub-text">Avengers in the Metaverse ⚡</p>
					{renderContent()}
				</div>
				<div className="footer-container">
					<img
						alt="Twitter Logo"
						className="twitter-logo"
						src={twitterLogo}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
