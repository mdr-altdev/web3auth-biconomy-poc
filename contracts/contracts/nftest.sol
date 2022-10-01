// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/access/Ownable.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/utils/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/metatx/ERC2771Context.sol";

contract NFTest is ERC2771Context, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(address trustedForwarder)
        ERC721("NFTest", "MDR")
        ERC2771Context(trustedForwarder)
    {
        address owner = _msgSender();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address sender)
    {
        sender = ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
