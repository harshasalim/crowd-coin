const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//get compiled json files from build directory
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    //Deploying CampaignFactory - parse the json file before sending
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});

    //Deploying the Campaign contract from CampaignFactory deployed instance factory, 100 refers to the  minimum amount to be contributed
    //This does not return anything except for the transaction receipt as it is a send request - so no way to get address of deployed contract
    //Here accounts[0] is the manager
    await factory.methods.createCampaign('100')
        .send({ from: accounts[0], gas: '1000000'});

    //To get address, only way is to call the getDeployedCampaigns function to get the list of all addresses
    //const addresses = await factory.methods.getDeployedCampaigns.call();
    //campaign = addresses[0];
    //Instead of the above two lines, you can use ES2016 syntax - to destructure an array to get first element
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    //Create an instance of the Campaign - which already exists on the local Blockchain
    //Get a JavaScript representation of the contract, which should access the contract existing in the campaignAddress address
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);

});

describe('Campaigns', () => {
    //Check if both contracts were successfully deployed
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    //Check if the correct manager is assigned
    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);    
    });

    //Make sure people who donate money to the campaign successfully become approvers
    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute()
            .send({ value: '200', from: accounts[1]});
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    //Verify that the campaign has a minimum contribution tied to it
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute()
                .send({ value: '5', from: accounts[1]});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    //Verify that manager has the ability to create a payment request
    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[2])
            .send({ from: accounts[0], gas: '1000000'});

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Buy batteries', request.description);
    });

    //Full test run - create request, approve it and finalize it
    //Assert that vendor received money from request
    it('processes requests', async () => {

        let oldBalance = await web3.eth.getBalance(accounts[2]);
        oldBalance = web3.utils.fromWei(oldBalance, 'ether');
        oldBalance = parseFloat(oldBalance);

        await campaign.methods.contribute()
            .send({ from: accounts[1], value: web3.utils.toWei('10', 'ether')});
        
        await campaign.methods
            .createRequest('Buy odometer', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0)
            .send({ from: accounts[1], gas: '1000000'});
        
        await campaign.methods.finalizeRequest(0)
            .send({ from: accounts[0], gas: '1000000'});

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);

        assert(balance - oldBalance > 4);
    });
    //finalize request w/t approving
    //non manager tries to finalize request
});