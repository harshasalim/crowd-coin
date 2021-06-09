import React, { Component } from 'react';
import { Button, Message, Table } from 'semantic-ui-react';

import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        loadingA: false,
        loadingF: false,
        errorMessage: ''
    };

    onApprove = async () => {
        this.setState({ loadingA: true, errorMessage: ''});
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id)
                .send({ from: accounts[0] });
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loadingA: false });

    };

    onFinalize = async () => {
        this.setState({ loadingF: true, errorMessage: ''});
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id)
                .send({ from: accounts[0] });
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loadingF: false });

    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount >= approversCount / 2;

        return ( 
            <Row disabled = {request.complete} positive = {readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei( request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    { request.complete ? null : 
                        (<Button basic color="green" onClick={this.onApprove} loading = {this.state.loadingA} disabled = {this.state.loadingA}>Approve</Button>)}
                </Cell>
                <Cell>
                    { request.complete ? null :
                        (<Button basic color="teal" onClick={this.onFinalize} loading = {this.state.loadingF} disabled = {this.state.loadingF}>Finalize</Button>)}
                </Cell>
                <Cell error = {!!this.state.errorMessage}>
                {!!this.state.errorMessage?<Message error header = "Oops!" content = {this.state.errorMessage}/>:null}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;