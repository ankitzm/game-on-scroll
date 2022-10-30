// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Base64 helper function
import "./libraries/Base64.sol";

import "hardhat/console.sol";

contract MyGame is ERC721 {
    // character feature struct
    struct CharacterAttribute {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    // default character list
    CharacterAttribute[] defaultCharaters;

    // Unique token Ids
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    // mapping tokenId => NFT attribute
    mapping(uint256 => CharacterAttribute) public nftHolderAttributes;

    // mapping address => NFT tokenId
    mapping(address => uint256) public nftHolders;

    // data passed into the contract when it's first created - inititalising
    constructor(
        string[] memory charName,
        string[] memory charImage,
        uint[] memory charHp,
        uint[] memory charMaxHp,
        uint[] memory charAttackDamage
    ) ERC721("Heroes", "HERO") {
        // loop through all the characters and save in contract
        for (uint i = 0; i < charName.length; i += 1) {
            defaultCharaters.push(
                CharacterAttribute(
                    i,
                    charName[i],
                    charImage[i],
                    charHp[i],
                    charMaxHp[i],
                    charAttackDamage[i]
                )
            );

            CharacterAttribute memory c = defaultCharaters[i];

            console.log(
                "Initialised % with %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }

        _tokenIds.increment();
    }

    function mintCharacterNFT(uint _characterIndex) external {
        // get current tokenId
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId); // assign tokenId to current caller(user)

        nftHolderAttributes[newItemId] = CharacterAttribute({
            characterIndex: _characterIndex,
            name: defaultCharaters[_characterIndex].name,
            imageURI: defaultCharaters[_characterIndex].imageURI,
            hp: defaultCharaters[_characterIndex].hp,
            maxHp: defaultCharaters[_characterIndex].maxHp,
            attackDamage: defaultCharaters[_characterIndex].attackDamage
        });

        console.log(
            "Minted NFT w/ tokenId %s and charater %s",
            newItemId,
            _characterIndex
        );

        // Keep an easy way to see who owns what NFT.
        nftHolders[msg.sender] = newItemId;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttribute memory charAttr = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttr.hp);
        string memory strMaxHp = Strings.toString(charAttr.maxHp);
        string memory strAttackDamage = Strings.toString(charAttr.attackDamage);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttr.name,
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttr.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,'} ]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}
