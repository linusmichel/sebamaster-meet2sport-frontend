"use strict";

import React from 'react';

import UserService from '../services/UserService';
import {Grid, Row, Col} from "react-bootstrap";
import Page from "../components/Page";
import UserForm from "../components/UserForm";


export class UserLoginView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    login(user) {
        this.setState({
            error: undefined
        });
        UserService.login(user.username, user.password).then((data) => {
            this.props.history.push("/");
        }).catch((e) => {
            //Regardless of error, always display generic message. "Do not reveal what went wrong during login"
            this.setState({
                error: "Username or password was incorrect. Please try again."
            });
        });
    }

    render() {
        return (
            <Page>
                <Grid>
                    <Row>
                        <Col xsHidden sm={12}>
                            <div style={{height: "65px"}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} smOffset={2} sm={8}>
                            <UserForm onSubmit={(user) => this.login(user)} isLogin={true} error={this.state.error}/>
                        </Col>
                    </Row>
                </Grid>
            </Page>
        );
    }
}