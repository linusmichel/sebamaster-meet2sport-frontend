import {Button, Glyphicon, Label, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import React from "react";
import Moment from "react-moment";
import UserService from "../services/UserService";

export default class EventDetailsModal extends React.Component {

    constructor(props) {
        super(props);

        this.createParticipants = this.createParticipants.bind(this);
    }

    createParticipants(){
        let parts = [];
        if(this.props.event) {
            for (let i = 0; i < this.props.event.participants.length; i++) {
                let part = this.props.event.participants[i];
                parts.push(<ListGroupItem key={i}>
                    <Glyphicon glyph={'user'}/>{' ' + part.username}
                    {UserService.getCurrentUser().id === part._id && " (You)"}
                    {this.props.event.creator === part._id && <Glyphicon style={{float : 'right'}} glyph={'star'}/>}
                </ListGroupItem>);
            }
        }
        return parts;
    }

    render() {
        let event = this.props.event;

        return <Modal show={this.props.show} onHide={() => {
                this.props.handleClose();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title componentClass={'h3'}>{event.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{event.activity}</h4>
                    <ListGroup>
                        <ListGroupItem>
                            {'Location: ' + event.sportPlace.name}
                            <p><a target={"_blank"} href={"https://www.google.de/maps/dir//"+event.sportPlace.loc.coordinates[1]+","+event.sportPlace.loc.coordinates[0]}>How to get there?</a></p>
                        </ListGroupItem>
                        <ListGroupItem bsStyle={new Date(event.end)<new Date() ? "danger" : undefined}>
                            {'Time: '}
                            <Moment format="DD.MM.YYYY HH:mm">{event.start}</Moment>
                            {' - '}
                            <Moment format={new Date(event.start).toLocaleDateString() !== new Date(event.end).toLocaleDateString() ? "DD.MM.YYYY HH:mm" : "HH:mm"}>
                                {event.end}
                            </Moment>
                        </ListGroupItem>
                        <ListGroupItem>{event.description}</ListGroupItem>
                    </ListGroup>
                    <hr/>
                    <h4>Participants <span style={{float: 'right'}}><Label bsStyle={event.participants.length < event.maxParticipants ? "success" : "danger"}>
                    {event.participants.length + '/' + event.maxParticipants}
                        </Label></span></h4>
                    <ListGroup>
                        {this.createParticipants()}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    {this.props.joinEvent && <Button bsStyle={'primary'} onClick = {() => {this.props.handleClose(); this.props.joinEvent(event);}}>Join</Button>}
                    {this.props.leaveEvent && <Button bsStyle={'danger'} onClick = {() => {this.props.handleClose(); this.props.leaveEvent(event)}}>Leave</Button>}
                    {' '}
                    <Button onClick={() => {
                        this.props.handleClose();
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>;
    }
}
