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

    struct Villan {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    Villan public villan;
    uint randNonce = 0;

    // Owner address of the contract
    address public owner;

    // default character list
    CharacterAttribute[] defaultCharacters;

    // Unique token Ids
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    // mapping tokenId => NFT attribute
    mapping(uint256 => CharacterAttribute) public nftHolderAttributes;

    // mapping address => NFT tokenId
    mapping(address => uint256) public nftHolders;

    // evnets
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(address sender, uint256 newVillanHp, uint256 newPlayerHp);

    // data passed into the contract when it's first created - inititalising
    constructor(
        string[] memory charName,
        string[] memory charImage,
        uint[] memory charHp,
        uint[] memory charMaxHp,
        uint[] memory charAttackDamage,
        string memory villanName,       // villan data need to be passed in run.js
        string memory villanImageURI,
        uint villanHp,
        uint villanMaxHp,
        uint villanAttackDamage
    ) ERC721("Heroes", "HERO") {

        owner = msg.sender;

        // initialising Villan
        villan = Villan(villanName, villanImageURI, villanHp, villanMaxHp, villanAttackDamage);
        console.log("Initialised Villan %s with hp : %s, img : %s", villan.name, villan.hp, villan.imageURI);

        // loop through all the characters and save in contract
        for (uint i = 0; i < charName.length; i += 1) {
            defaultCharacters.push(
                CharacterAttribute(
                    i,
                    charName[i],
                    charImage[i],
                    charHp[i],
                    charMaxHp[i],
                    charAttackDamage[i]
                )
            );

            CharacterAttribute memory c = defaultCharacters[i];

            console.log(
                "Initialised %s with %s, img %s",
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
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
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

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
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

    function randMod(uint _modulus) internal returns(uint) {
        randNonce++;                                                     // increase nonce
        return uint(keccak256(abi.encodePacked(block.timestamp,                      // an alias for 'block.timestamp'
                                          msg.sender,                    // your address
                                          randNonce))) % _modulus;       // modulo using the _modulus argument
    }
        
    
    function attackVillan() public {
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttribute storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        console.log("Player about to attack - name : %s, hp : %s, AD : %s", player.name, player.hp, player.attackDamage);
        console.log("Villan %s has %s hp` and %s AD", villan.name, villan.hp, villan.attackDamage);

        require(
            player.hp > 0, "Error: charater have less HP"
        );

        require(
            villan.hp > 0, "Error: villan have less HP"
        );

        // attacking villan
        if(villan.hp < player.attackDamage) {
            villan.hp = 0;
            console.log("Villan died");
        } else {
                villan.hp = villan.hp - player.attackDamage;
                console.log("%s got attacked", villan.name);
        }

        // villan attacking back
        if(player.hp < villan.attackDamage) {
            player.hp = 0;
            console.log("Player died");
        } else {
            if (randMod(10) > 3) {
                player.hp = player.hp - villan.attackDamage;
                console.log("%s got attacked", player.name);
            } else {
                console.log("%s missed the attack", villan.name);
            }
        }

        // Console for ease.
        console.log("Player attacked villan. Updated Villan hp: %s", villan.hp);
        console.log("Villan attacked player. Updated player hp: %s\n", player.hp);

        emit AttackComplete(msg.sender, villan.hp, player.hp);
    }

    function checkIfUserHasNFT() public view returns(CharacterAttribute memory) {
        // get tokenID of the character held by the user
        uint256 userNftTokenId = nftHolders[msg.sender];

        if(userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttribute memory emptyStruct;
            return emptyStruct;
        }
    }

    // get default characters
    function getAllDefaultCharacters() public view returns (CharacterAttribute[] memory) {
        return defaultCharacters;
    }

    // retrieve villan data
    function getVillan() public view returns (Villan memory) {
        return villan;
    }

    function reviveVillan() public {
        require(msg.sender == owner, "only the owner can Revive villan");
        villan.hp = villan.maxHp;
        console.log("villan revived to full hp", villan.hp);
    }

}
