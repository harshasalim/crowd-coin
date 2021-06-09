import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';

import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';

import { Link } from '../../../routes';

import Campaign from '../../../ethereum/campaign';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        //Solidity does not support returning an array of user defined types like structs -
        //To get a list of all requests, we need to call separately for each request
        //Use the requests count and call each one
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        //Instead of creating a loop and fetching requests one by one, send them all together 
        //Array.fill(num).map(...) - gives all the indices from 0 to num
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map(( element, index) => {
                return campaign.methods.requests(index).call()
            })
        );

        console.log(requests);

        return { address, requests, requestCount, approversCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key = {index}
                id = {index}
                request = {request}
                address = {this.props.address}
                approversCount = {this.props.approversCount}
                />
        })
    }

    render(){
        const { Header, Row, HeaderCell, Body } = Table;

        return(
            <Layout>
                <Link route = {`/campaigns/${this.props.address}`}>
                    <a>Back</a>
                </Link>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated = "right" style = {{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                            <HeaderCell>Notes</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex;