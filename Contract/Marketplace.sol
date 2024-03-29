// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFT is ERC721URIStorage {
    uint public tokenCount;
    uint public itemCount;
   

    struct Item {
        uint itemId;
        uint tokenId;
        uint price;
        address payable seller;
        bool itemview;
    }

    event Offered(
        uint itemId,
        uint tokenId,
        uint price,
        address indexed seller
    );

     event Viewed(
        uint itemId,
        uint tokenId,
        uint price,
        address indexed seller
    );

    mapping(uint => Item) public items;


    constructor() ERC721("Video Token", "VDO"){
    }


    function mint(string memory _tokenURI, uint _price) external returns(uint) {
        tokenCount ++;
        itemCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);

        items[itemCount] = Item (
            itemCount,
            tokenCount,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(
            itemCount,
            tokenCount,
            _price,
            msg.sender
        );
        

        return(tokenCount);
    }


    function purchaseItem(uint _itemId) external payable {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
       
        item.seller.transfer(item.price);


    }

    function viewitem(uint _itemId) external {
        emit Viewed(_itemId, _itemId, items[_itemId].price, items[_itemId].seller);
    }

    
    function getview(uint _itemId) view public returns(bool){
        return(items[_itemId].itemview);
    }

    function setview(uint _itemId)  public {
        items[_itemId].itemview =false;
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + 3))/100);
    }

}