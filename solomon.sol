pragma solidity >=0.7.0 <0.9.0;

contract Solomon {


    uint price;
    address payable buyer;

    // setter of Buyer
    function setBuyer(address payable _buyer) public {
        buyer = _buyer;
    }
    function transfer_before() payable public {
        // cloud.transfer(msg.value);

        price += msg.value;
    }

    function transfer_3days(address payable seller) payable public{
        seller.transfer(msg.value);
    }
}
