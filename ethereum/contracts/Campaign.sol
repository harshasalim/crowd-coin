
pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;//Description of the request by manager
        uint value;//How much money to send
        address recipient;//Whom to pay
        bool complete;//Whether the transaction was completed - once true, cannot use this instance of request
        uint approvalCount;//How many people voted yes
        mapping(address => bool) approvals;//who all voted
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;//The mapping is address to bool because, incase of lookup of an address that was not mapped, the default value false will be returned. When we insert to the mapping we insert it as true refering to a valid contribution being made.
    Request[] public requests;
    uint public approversCount;//Since we  cannot iterate over the mapping approvers to get the count 
    
    //Modifier to ensure that the one who calls a function is the manager
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    //Cannot use msg variable here as it is called by anothr contract, not a user
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        //approversCount = 0;
    }
    
    //Allow a person to contribute and become a member/approver
    function contribute() public payable {
        //Ensure they send atleast the minimum contribution
        require(msg.value > minimumContribution);
        if(!approvers[msg.sender]){
            approversCount++;
        }
        approvers[msg.sender] = true;
    }
    
    //Create a new spending request - only manager can call it
    function createRequest(string description, uint value, address recipient) public restricted {
        // Ensure we can't ask for more money than the contract holds
        require(value <= address(this).balance);

        //Do not have to initialize the approvals field - as it is a reference type. Only have to initialize value types.
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        //Request newRequest = Request(description, value, recipient, false) => This is same as above, but ensure relative order is maintained
         requests.push(newRequest);
    }
    
    //approvers can approve or disapprove a request only once, and should should be resilient wrt a large number of approvers
    function approveRequest(uint index) public {
        //Create a storage variable to refer to requests[index] instead of using the long name
        Request storage request = requests[index];
        
        //Ensure that the person calling the function is an approver, if not added to the mapping the default value of false will be shown
        require(approvers[msg.sender]);
        //Ensure that this person has not already approved this particular request
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    //manager calls this to get the request paid out to the vendor
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        //Ensure that it was not already completed/paid
        require(!request.complete);
        //Ensure that 50% min approvals have been obtained
        require(request.approvalCount > approversCount/2);
        
        //request.recipient is an address, so can call certain methods on it 
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns( uint, uint, uint, uint, uint, address) {
        uint completedRequests = 0;
        for( uint i=0;i<requests.length;i++){
            if(requests[i].complete == false){
                completedRequests++;
            }
        }
        return (
            minimumContribution,
            this.balance,
            requests.length,
            completedRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}

//todo

//do not allow them to contribute more than once to same project/ stop adding them as separate users
