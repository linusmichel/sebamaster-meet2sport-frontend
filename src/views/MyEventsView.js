"use strict";

import React from 'react';

import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap';
import EventFilter from '../components/EventFilter';
import EventMap from '../components/EventMap';
import Page from '../components/Page';

import EventService from '../services/EventService';
import EventCardStack from "../components/EventCardsStack";
import EventDetailsModal from "../components/EventDetailsModal";
import InfoModal from "../components/InfoModal";
import UserService from "../services/UserService";


export class MyEventsView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events : undefined,
            showDetails : false,
            selectedEvent : undefined,
            info : {
                showInfo : false,
                body : undefined,
                type : undefined
            },
            filter : undefined,
            radius : undefined
        };

        this.loadEvents = this.loadEvents.bind(this);
        this.leaveEvent = this.leaveEvent.bind(this);
        this.showInfoModal = this.showInfoModal.bind(this);
        this.hideInfoModal = this.hideInfoModal.bind(this);
        this.showEventDetails= this.showEventDetails.bind(this);
        this.hideEventDetails= this.hideEventDetails.bind(this);
    }

    componentWillMount(){
        this.loadEvents();
    }

    loadEvents(){
        let filter = {};
        filter.start = new Date();
        filter.participant = UserService.getCurrentUser().id;
        EventService.getEvents(filter).then((data) => {
            this.setState({futureEvents : data});
        }).catch((e) => {
            console.error(e);
            this.showInfoModal(e, "danger");
        });
        filter.start = undefined;
        filter.end = new Date();
        EventService.getEvents(filter).then((data) => {
            this.setState({pastEvents : data});
        }).catch((e) => {
            console.error(e);
            this.showInfoModal(e, "danger");
        });
    }

    leaveEvent(event){
        EventService.leaveEvent(event).then((data) => {
            this.showInfoModal(<div><h4>{"Successfully left event!"}</h4>
                <p>{event.name + ' @ ' + event.sportPlace.name}</p>
                <Button bsStyle = {'success'} onClick={() => {this.props.history.push('/joinevent');}}>Join Other Event</Button>
            </div>, "success");
            this.loadEvents();
        }).catch((e) => {
            console.log(e);
            this.showInfoModal(e, "danger");
        });
    }


    render() {
        return (
            <Page>
                {this.state.showDetails && <EventDetailsModal event = {this.state.selectedEvent} show={this.state.showDetails}
                                                              handleClose = {this.hideEventDetails} leaveEvent = {this.leaveEvent} />}
                {this.state.info.showInfo && <InfoModal show={this.state.info.showInfo} info={this.state.info.body}
                                                        type={this.state.info.type} handleClose={this.hideInfoModal}/>}
                <Grid>
                    <Row>
                        <Col xs={12} sm={12}><PageHeader style={{marginTop : '10px',}}>
                            <small>My Events</small>
                        </PageHeader></Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12}><EventCardStack title={"Upcoming events"} events = {this.state.futureEvents} showEventDetails = {this.showEventDetails} leaveEvent={this.leaveEvent}/></Col>
                        <Col xs={12} sm={12}><EventCardStack title={"Past events"} events = {this.state.pastEvents} showEventDetails = {this.showEventDetails}/></Col>
                    </Row>
                </Grid>
            </Page>
        );
    }

    showInfoModal(body, type){
        let info = this.state.info;
        info.showInfo = true;
        info.body = body;
        info.type = type;
        this.setState({info : info});
    }

    hideInfoModal(){
        let info = this.state.info;
        info.showInfo = false;
        this.setState({info : info});
    }

    showEventDetails(event){
        this.setState({
            showDetails : true,
            selectedEvent : event
        });
    }

    hideEventDetails(){
        this.setState({
            showDetails : false,
            selectedEvent : undefined
        });
    }
}
