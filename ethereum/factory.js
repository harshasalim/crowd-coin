import web3 from './web3';

//Import the compiled contract
import CampaignFactory from './build/CampaignFactory.json';

//Create a contract instance that refers to the specific instance where we had already deployed this contract to, and export it 
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xD871602B94313b3EB97e4adcfAfD2b8D972b2737'
);

export default instance;
