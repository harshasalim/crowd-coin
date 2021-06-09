import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';

import factory from '../ethereum/factory';

import Layout from '../components/Layout';

import { Link } from '../routes';

//Steps
//Congifure web3 with a provider from metamask
//Tell web3 that a deployed copy of CampaignFactory exists 
//Use the factory instance to retrieve a list of deployed campaigns 
//Use React to show something about each campaign

class CampaignIndex extends Component {
    //In next.js server side rendering is done - code run on next.js server, and the output ui is sent to the client
    //Done inorder to ensure faster loads - to ensure something shows up on the screen 
    //In React normally all the necessary files are sent to client browser, which have to be downloaded and then it is rendered - more time consuming
    //However these files are also sent and downloaded by client incase of next.js 
    //In the time that it takes to download and load them, the already run output will be shown
    //However the componentDidMount does not get exectuted in the next.js server - instead have to use getinitialprops
    //All components whose values are to be rendered - check getInitialProps function tied to it and execute it, and provide the component value as props on the server to that component.
    //Has to be static and we should be able to call that member function without creating an instance of the class.

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route = {`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>),
                fluid: true//ensure that the text sticks to the left side
            };
        });
        return <Card.Group items = {items} />;
    }

    render() {
        return ( <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route = "/campaigns/new">
                        <a>
                            <Button 
                                content = "Create Campaign"
                                icon = "add circle"
                                primary
                                floated = "right" />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>);
    }
}

export default CampaignIndex;
