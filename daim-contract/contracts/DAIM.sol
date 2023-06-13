// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// NFT contract
contract DAIM is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    // using String for Strings;
    // data variables and structs
    uint public startUpCounter = 0;
    uint public reqCounter = 0;
    uint public buyCounter = 0;
    address public admin;

    Counters.Counter private _tokenIdCounter;
    uint256 TOTAL_STARTUP_PARTS = 10000; // each part = 0.01%

    mapping(uint => uint) public tokenPriceMap;

    struct InvestRequest {
        uint reqId;
        address investor;
        uint startupId;
        uint parts;
        uint amountPayed;
        bool completed;
    }
    struct BuyRequest {
        uint reqId;
        uint tokenId;
        address tokenOwner;
        address buyee;
        uint amountPayed;
        bool completed;
    }
    struct Startup {
        uint startupId;
        string name;
        address founder;
        uint revenue;
        //
        string businessModel;
        uint totalFunding;
        uint profit;
    }
    InvestRequest[] public investRequests;
    BuyRequest[] public buyRequests;
    Startup[] public startups;
    mapping(address => string) public investors;
    // mapping(uint => uint) public tokensForSale;
    uint[] public tokensForSale;
    mapping(uint => bool) public tokensForSaleMap;

    // modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier isInvestor() {
        require(bytes(investors[msg.sender]).length != 0);
        _;
    }

    // code
    constructor() ERC721("DAIM-NFT", "DAIM") {
        admin = msg.sender;
        _tokenIdCounter.increment(); // Start mint at ID 1
    }

    function createStartup(string memory name, address startupOwner) public {
        Startup storage newStartup = startups.push();
        newStartup.name = name;
        newStartup.startupId = startUpCounter;
        newStartup.founder = startupOwner;
        startUpCounter += 1;
    }

    function getStartupByID(
        uint startupId
    ) public view returns (Startup memory) {
        require(startupId < startups.length);
        return startups[startupId];
    }

    function registerAsInvestor(string memory name) public {
        require(bytes(name).length != 0);
        require(bytes(investors[msg.sender]).length == 0);
        investors[msg.sender] = name;
    }

    function getStartupsCount() public view returns (uint256) {
        return startups.length;
    }

    function getReqCount() public view returns (uint256) {
        return investRequests.length;
    }

    function getBuyReqCount() public view returns (uint256) {
        return buyRequests.length;
    }

    function getTokensForSaleCount() public view returns (uint256) {
        return tokensForSale.length;
    }

    function createInvestRequest(
        uint startupId,
        uint parts
    ) public payable isInvestor {
        require(startupId < startUpCounter);
        InvestRequest storage newReq = investRequests.push();
        newReq.reqId = reqCounter;
        newReq.investor = msg.sender;
        newReq.startupId = startupId;
        newReq.parts = parts;
        newReq.amountPayed = msg.value;
        newReq.completed = false;
        reqCounter += 1;
    }

    function approveInvestRequest(uint reqId) public {
        InvestRequest storage request = investRequests[reqId];
        require(msg.sender == startups[request.startupId].founder);
        require(request.completed != true);
        uint tokenId = _tokenIdCounter.current();
        tokenPriceMap[tokenId] = request.amountPayed;
        mintTokenSafely(request.investor, request.startupId, request.parts);
        payable(msg.sender).transfer(request.amountPayed);
        request.completed = true;
        //think about metadata
    }

    function rejectInvestRequest(uint reqId) public {
        InvestRequest storage request = investRequests[reqId];
        require(msg.sender == startups[request.startupId].founder);
        require(request.completed != true);
        payable(request.investor).transfer(request.amountPayed);
        request.completed = true;
    }

    function putYourShareForSale(uint tokenId) public isInvestor {
        require(ownerOf(tokenId) == msg.sender);
        require(tokensForSaleMap[tokenId] != true);
        tokensForSaleMap[tokenId] = true;
        tokensForSale.push(tokenId);
    }

    function createBuyRequest(uint tokenId) public payable isInvestor {
        require(tokensForSaleMap[tokenId] == true);
        BuyRequest storage newReq = buyRequests.push();
        newReq.reqId = buyCounter;
        newReq.tokenId = tokenId;
        newReq.tokenOwner = ownerOf(tokenId);
        newReq.buyee = msg.sender;
        newReq.amountPayed = msg.value;
        newReq.completed = false;
        buyCounter += 1;
    }

    function approveBuyRequest(uint reqId) public {
        BuyRequest storage request = buyRequests[reqId];
        require(request.tokenOwner == msg.sender);
        require(request.completed != true);
        payable(msg.sender).transfer(request.amountPayed);
        request.completed = true;
        tokensForSaleMap[request.tokenId] = false;
        //think about transfer nft
        tokenPriceMap[request.tokenId] = request.amountPayed;
        safeTransferFrom(msg.sender, request.buyee, request.tokenId);
    }

    function rejectbuyRequest(uint reqId) public {
        BuyRequest storage request = buyRequests[reqId];
        require(request.tokenOwner == msg.sender);
        require(request.completed != true);
        payable(request.buyee).transfer(request.amountPayed);
        request.completed = true;
    }

    function mintTokenSafely(address to, uint startupId, uint parts) public {
        uint tokenId = _tokenIdCounter.current();
        string memory separator = "_";
        string memory temp = string.concat(
            Strings.toString(startupId),
            separator
        );
        string memory uri = string.concat(temp, Strings.toString(parts));
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenIdCounter.increment();
    }

    // these functions are overrides required by Solidity for the imported files.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
