"use strict";

import React from 'react';

import {PageHeader,Grid, Row, Col,Panel, Glyphicon, Button, FormControl, ControlLabel, FormGroup} from 'react-bootstrap';
import Page from '../components/Page';
import DateTimeField from "../components/DateTimeField";
import EventCardStack from "../components/EventCardsStack";


export class MyEventsView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    render() {
            return (
                <Page>
                     <Grid>
                        <Row>
                            <Col xs={12} sm={12}><PageHeader style={{marginTop: '10px',}}>
                                <small>My Events</small>
                            </PageHeader>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={3}>
                                <Panel>

                                    <Panel.Heading>
                                        <Panel.Title componentClass="h3"><Glyphicon glyph={'plus'} /> Filter Events </Panel.Title>
                                    </Panel.Heading>
                                    <Panel.Body>
                                        <Row>
                                            <Col xs={12} sm={12} md={15} lg={15}>
                                                <FormGroup controlId="setName">
                                                    <ControlLabel>Activity</ControlLabel>
                                                    <FormControl
                                                        type= "text"
                                                        placeholder="Activity">
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={15} lg={15}>
                                                <FormGroup controlId="setName">
                                                    <ControlLabel>Location</ControlLabel>
                                                    <FormControl
                                                        type= "text"
                                                        placeholder="Location">
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={15} lg={15}>
                                                <ControlLabel>Start Date</ControlLabel>
                                                <DateTimeField>
                                                </DateTimeField>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={15} lg={15}>
                                                <ControlLabel>End Date</ControlLabel>
                                                <DateTimeField>
                                                </DateTimeField>
                                            </Col>
                                        </Row>
                                        <Col xs={15} sm={15}>
                                            <Button bsStyle ='primary'>Search</Button>
                                            {' '}
                                        </Col>
                                    </Panel.Body>
                                </Panel>
                            </Col>
                            <Col xsHidden sm={12} md={9}>
                                <EventCardStack>

                                </EventCardStack>
                            </Col>
                        </Row>
                    </Grid>
                </Page>
            );
        }
    
}
