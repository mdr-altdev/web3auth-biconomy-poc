// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/access/Ownable.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/utils/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@4.7.3/contracts/metatx/ERC2771Context.sol";

contract NFTest is ERC2771Context, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // The Biconomy SDK requires trustedForwarder to be part of the ABI, so
    // we need to expose this (OpenZeppelin's ERC2771Context makes it private)
    address public immutable trustedForwarder;

    constructor(address _trustedForwarder)
        ERC721("NFTest", "MDR")
        ERC2771Context(_trustedForwarder)
    {
        address owner = _msgSender();
        trustedForwarder = _trustedForwarder;
    }

    // This contract is ultra open bar, anybody can mint anything
    // Do note though that just stacking an onlyOwner on top of that is slightly more
    // complex than using the regular Ownable contract! msg.sender should be _msgSender,
    // so a "custom" onlyOwner should be applied
    function safeMint(address to) public {
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
