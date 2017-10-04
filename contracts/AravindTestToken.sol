pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract AravindTestToken is MintableToken {
    string public constant name = "AravindToken";
    string public constant symbol = "ART";
    uint8 public constant decimals = 18;
}