// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract MyGame {
    // character feature struct
    struct CharacterAttribute {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint atttackDamage;
    }

    // default character list
    CharacterAttribute[] defaultCharaters;

    // data passed into the contract when it's first created - inititalising
    constructor(
        string[] memory charName,
        string[] memory charImage,
        uint[] memory charHp,
        uint[] memory charMaxHp,
        uint[] memory charAttackDamage
    ) {
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
    }
}
