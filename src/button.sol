pragma solidity ^0.8.0;

contract button {
    uint256 private currentprice = 1 ether;
    address private owner;
    address[][] transactions;
    address[] users;
    struct hist {
        address person;
        uint boughtprice;
        uint prevtime;
        uint totaltime;
        bool exists;
    }

    mapping(address => hist) public history; 

    function userexists(address user) public view returns(bool) {
        return history[user].exists;
    }

    function presssButton() external payable{
        uint price = currentprice;
        address prev = owner;
        if (prev != address(0)) {
            history[prev].totaltime = history[prev].totaltime + (block.timestamp - history[prev].prevtime);
        }
        require(msg.value == price, "Price must be equal to the button vaue");

        owner = msg.sender;
        transactions.push([msg.sender, prev]);
        bool contains = false;

        for (uint i = 0; i < users.length; i++) {
            if(users[i] == msg.sender){
                contains = true;
            }
        }

        if (contains == false) {
            users.push(msg.sender);
        }

        currentprice = currentprice * 2;

        if (userexists(msg.sender)) {
            history[msg.sender].boughtprice = currentprice / 2;
            history[msg.sender].prevtime = block.timestamp;
        }
        else {
            history[msg.sender].person = msg.sender;
            history[msg.sender].boughtprice = currentprice / 2;
            history[msg.sender].prevtime = block.timestamp;
            history[msg.sender].exists = true;
        }

        
    }

    function sell() public payable{
        address currowner = owner;
        require(msg.sender == currowner);

        history[msg.sender].totaltime =  history[msg.sender].totaltime + (block.timestamp - history[msg.sender].prevtime);

        owner = address(0);
        transactions.push([msg.sender]);

        payable(msg.sender).transfer(history[msg.sender].totaltime);

    }

    function returntransctions() public view returns(address[][] memory){
        return transactions;
    }

    function returnking() public view returns(address) {
        return owner;
    }

    function returnproce() public view returns(uint) {
        return currentprice;
    }

    function leaderboard() public view returns(hist[] memory){
        hist[] memory board = new hist[](users.length);

        for (uint i = 0; i < users.length; i++){
            board[i] = (history[users[i]]);
        }

        bool keepgoing = true;
        while(keepgoing) {
            uint times = 0;

            for (uint i = 1; i < board.length; i++){
                if(board[i].totaltime > board[i - 1].totaltime){
                    hist memory temp = board[i];
                    board[i] = board[i - 1];
                    board[i - 1] = temp;
                    times = times + 1;
                    i -= 1;
                }
            }

            if (times == 0){
                keepgoing = false;
            }
        }

        return board;

    }

}