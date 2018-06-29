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
import EventListModal from "../components/EventListModal";


export class JoinEventView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events : undefined,
            showDetails : false,
            showList : false,
            selectedEvent : undefined,
            selectedEvents : undefined,
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
        this.joinEvent = this.joinEvent.bind(this);
        this.updateCenter = this.updateCenter.bind(this);
        this.showInfoModal = this.showInfoModal.bind(this);
        this.hideInfoModal = this.hideInfoModal.bind(this);
        this.showEventDetails= this.showEventDetails.bind(this);
        this.hideEventDetails= this.hideEventDetails.bind(this);
        this.showEventList= this.showEventList.bind(this);
        this.hideEventList= this.hideEventList.bind(this);
    }

    componentWillMount(){

    }

    loadEvents(filter){
        filter.noParticipant = UserService.getCurrentUser().id;
        this.setState({filter : filter});
        EventService.getEvents(filter).then((data) => {
            this.setState({events : data});
        }).catch((e) => {
            console.error(e);
            this.showInfoModal(e, "danger");
        });
    }

    joinEvent(event){
        EventService.joinEvent(event).then((data) => {
            this.showInfoModal(<div><h4>{"Successfully joined event!"}</h4>
                <p>{event.name + ' @ ' + event.sportPlace.name}</p>
                <Button bsStyle = {'success'} onClick={() => {this.props.history.push('/myevents');}}>Go to My Events</Button>
            </div>, "success");
            this.loadEvents(this.state.filter);
        }).catch((e) => {
            console.log(e);
            this.showInfoModal(e, "danger");
        });
    }

    updateCenter(loc, rad){
        this.setState({center : loc, radius : rad});
    }

    render() {
        return (
            <Page>
                {this.state.showDetails && <EventDetailsModal event = {this.state.selectedEvent} show={this.state.showDetails}
                                                              handleClose = {this.hideEventDetails} joinEvent = {this.joinEvent} />}
                {this.state.showList && <EventListModal events = {this.state.selectedEvents} show={this.state.showList}
                                                              handleClose = {this.hideEventList} showEventDetails = {this.showEventDetails} />}
                {this.state.info.showInfo && <InfoModal show={this.state.info.showInfo} info={this.state.info.body}
                                                        type={this.state.info.type} handleClose={this.hideInfoModal}/>}
                <Grid>
                    <Row>
                        <Col xs={12} sm={12}><PageHeader style={{marginTop : '10px',}}>
                            <small>Join Event</small>
                        </PageHeader></Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={3}><EventFilter onFilterSubmit = {this.loadEvents} locationCallback = {this.updateCenter} /></Col>
                        <Col xsHidden sm={12} md={9}>
                            <EventMap events = {this.state.events} center = {this.state.center} radius = {this.state.radius}
                                      showEventDetails = {this.showEventDetails}
                                      showEventList = {this.showEventList}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12}><EventCardStack title = {"Events"} events = {this.state.events} showEventDetails = {this.showEventDetails} joinEvent={this.joinEvent}/></Col>
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

    showEventList(events){
        this.setState({
            showList : true,
            selectedEvents : events
        });
    }

    hideEventList(){
        this.setState({
            showList : false,
            selectedEvents : undefined
        });
    }
}
