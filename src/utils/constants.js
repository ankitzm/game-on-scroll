const CONTRACT_ADDRESS = "0xA607A2A31915ff27cd52871aB450047CC1c88a2b"
// scrollAlpha --  0xA607A2A31915ff27cd52871aB450047CC1c88a2b

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
