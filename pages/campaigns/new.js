import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';

import Layout from '../../components/Layout';

import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async ( event ) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                    //no need to specify the gas amount, Metamask will do it
                });

            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label = "wei" 
                            type = "text"
                            labelPosition = "right" 
                            value = {this.state.minimumContribution}
                            onChange = { event =>
                                this.setState({ minimumContribution: event.target.value })
                            }/>
                    </Form.Field>
                    <Message error header = "Oops!" content = {this.state.errorMessage} />
                    <Button type = "submit" primary loading = {this.state.loading} disabled = {this.state.loading}>
                        Create
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;