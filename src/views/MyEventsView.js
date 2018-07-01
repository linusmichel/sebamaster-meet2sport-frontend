"use strict";

import React from 'react';

import {PageHeader,Grid, Row, Col,Panel, Glyphicon, Button, FormControl, ControlLabel, FormGroup} from 'react-bootstrap';
import Page from '../components/Page';
import EventCardStack from "../components/EventCardsStack";
import EventFilter from "../components/EventFilter";
import UserService from "../services/UserService";
import EventService from "../services/EventService";






export class MyEventsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events : undefined,
            showDetails : false,
           info : {
                showInfo : false,
                body : undefined,
                type : undefined
            },
            filter : undefined,
            center : {
                lat : undefined,
                lng : undefined
            },
            radius : undefined
        };
        this.loadEvents = this.loadEvents.bind(this);
        this.updateCenter = this.updateCenter.bind(this);
        this.showInfoModal = this.showInfoModal.bind(this);
        this.showEventDetails= this.showEventDetails.bind(this);
        this.leaveEvent=this.leaveEvent.bind(this)
    }
    componentWillMount(){

    }


    showInfoModal(body, type){
        let info = this.state.info;
        info.showInfo = true;
        info.body = body;
        info.type = type;
        this.setState({info : info});
    }

    loadEvents(filter){
        filter.participant = UserService.getCurrentUser().id;
        this.setState({filter : filter});
        EventService.getEvents(filter).then((data) => {
            this.setState({events : data});
        }).catch((e) => {
            console.error(e);
            this.showInfoModal(e, "danger");
        });
}

    updateCenter(loc, rad){
        this.setState({center : loc, radius : rad});
    }
    showEventDetails(event){
        this.setState({
            showDetails : true,
            selectedEvent : event
        });
    }

    leaveEvent(event){
        this.setState({
            filter: this.state.filter,

        });
        EventService.leaveEvent(event).then((message) => {

            filter.splice(event);
            this.setState({
                filter: this.state.filter,

            });
        }).catch((e) => {
            console.error(e);
        });
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
                                <EventFilter onFilterSubmit = {this.loadEvents} locationCallback = {this.updateCenter}/>
                            </Col>
                            <Col xsHidden sm={12} md={9}>
                                <EventCardStack events = {this.state.events} showEventDetails = {this.showEventDetails} joinEvent={this.leaveEvent}>

                                </EventCardStack>


                            </Col>
                        </Row>
                    </Grid>
                </Page>
            );
        }
    }
