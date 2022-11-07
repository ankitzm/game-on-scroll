const CONTRACT_ADDRESS = "0xF47B526290fd0A314EE2789cCb42739831748954"
// goerli --  0x01d0168841ad9a67f6b83E2b4507c44716c84D51

const transformCharacterData = characterData => {
	return {
		name: characterData.name,
		imageURI: characterData.imageURI,
		hp: characterData.hp.toNumber(),
		maxHp: characterData.maxHp.toNumber(),
		attackDamage: characterData.attackDamage.toNumber(),
	}
}

export { CONTRACT_ADDRESS, transformCharacterData }
