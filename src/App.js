import React, { useEffect, useState } from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"

// Constants
const TWITTER_HANDLE = "_buildspace"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
	const [curresntAccount, setCurrentAccount] = useState(null)

	const checkWalletConnection = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log("make sure you have Metamsk")
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

	// runs the function once the page loads
	useEffect(() => {
		checkWalletConnection()
	}, [])

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">⚔️ ENDGAME ⚔️</p>
					<p className="sub-text">Avengers in the Metaverse</p>
					<div className="connect-wallet-container">
						<img
							src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
							alt="Monty Python Gif"
						/>
						<button
							className="cta-button connect-wallet-button"
							onClick={connectWallet}
						>
							Connect Wallet To Get Started
						</button>
					</div>
				</div>
				<div className="footer-container">
					<img
						alt="Twitter Logo"
						className="twitter-logo"
						src={twitterLogo}
					/>
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	)
}

export default App
