// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTComics is Ownable, ERC1155Supply {
  // the contract-level metadata uri
  string private _contractURI;

  // mapping from tokenId to tokenURI
  mapping(uint256 => string) private _tokenURI;

  // mapping from tokenId to their minting price
  mapping(uint256 => uint256) private _mintingPrice;

  // mapping from tokenId to their maximum supply
  mapping(uint256 => uint256) private _maxSupply;

  // the fee details
  uint256 private constant _FEE_PERCENTAGE = 1000;
  uint256 private constant _ONE_HUNDRED_PERCENT = 10000;

  // the fee receiver address
  address payable private _feeReceiver;

  // the address to receive the majority
  address payable private _mainReceiver;

  constructor(
    string memory __contractURI,
    address payable __feeReceiver,
    address payable __mainReceiver
  ) ERC1155("") {
    _contractURI = __contractURI;
    _feeReceiver = __feeReceiver;
    _mainReceiver = __mainReceiver;
  }

  /**
   * @dev change the URL for the storefront-level metadata
   */
  function setContractURI(string memory __contractURI) public onlyOwner {
    _contractURI = __contractURI;
  }

  /**
   * @dev changes the main receiver address
   */
  function setMainReceiver(address payable __mainReceiver) public onlyOwner {
    _mainReceiver = __mainReceiver;
  }

  /**
   * @dev allow owner to create new tokens
   *
   * @param __tokenId the id of the new token
   * @param __tokenURI the new token URI
   * @param __mintingPrice the minting price
   * @param __maxSupply the maximum supply for the new token
   */
  function createNFT(
    uint256 __tokenId,
    string memory __tokenURI,
    uint256 __mintingPrice,
    uint256 __maxSupply
  ) public onlyOwner {
    require(!_exists(__tokenId), "Token already exists");

    _tokenURI[__tokenId] = __tokenURI;
    _mintingPrice[__tokenId] = __mintingPrice;
    _maxSupply[__tokenId] = __maxSupply;
  }

  /**
   * @dev allow user to mint tokens
   *
   * @param id the id of the token to buy
   */
  function buyNFT(uint256 id) public payable {
    require(_exists(id), "Token does not exist");
    require(_maxSupply[id] > totalSupply(id), "Token max supply reached");
    require(msg.value == _mintingPrice[id], "Wrong value sent");

    if (msg.value > 0) {
      _handlePayment(msg.value);
    }

    _mint(_msgSender(), id, 1, "");
  }

  /**
   * @dev returns a URL for the storefront-level metadata for the contract.
   */
  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  /**
   * @dev Indicates whether any token exist with a given id, or not.
   */
  function exists(uint256 id) public view override returns (bool) {
    return bytes(_tokenURI[id]).length != 0;
  }

  /**
   * @dev Returns the URI for token type `id`.
   */
  function uri(
    uint256 id
  ) public view virtual override returns (string memory) {
    require(_exists(id), "Token does not exist");
    return _tokenURI[id];
  }

  /**
   * @dev handle the payment to distribute price between mainReceiver and feeReceiver
   */
  function _handlePayment(uint256 price) private {
    uint256 fee = (price * _FEE_PERCENTAGE) / _ONE_HUNDRED_PERCENT;
    _mainReceiver.transfer(price - fee);
    _feeReceiver.transfer(fee);
  }

  /**
   * @dev Indicates whether any token exist with a given id, or not.
   */
  function _exists(uint256 id) private view returns (bool) {
    return bytes(_tokenURI[id]).length != 0;
  }
}
