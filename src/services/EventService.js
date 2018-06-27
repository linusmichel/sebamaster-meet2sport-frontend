"use strict";

import HttpService from "./HttpService";
import UserService from "./UserService";
import SportPlaceService from "./SportPlaceService";
import ActivityService from "./ActivityService";

export default class EventService {

    constructor() {

    }

    static baseURL() {return "http://localhost:3000"; }

    static buildQueryParamsString(filter){
        let queryParams = "";
        if(filter.activity)
            queryParams += "activity=" + filter.activity + "&";
        if(filter.location){
            queryParams += "location=" + filter.location + "&";
        }
        if(filter.start) {
            queryParams += "start=" + filter.start.toISOString() + "&";
        }
        if(filter.end) {
            queryParams += "end=" + filter.end.toISOString() + "&";
        }
        if(filter.participant) {
            queryParams += "participant=" + filter.participant + "&";
        }
        if(filter.noParticipant) {
            queryParams += "noparticipant=" + filter.noParticipant + "&";
        }
        return queryParams;
    };

    static getEvents(filter) {
        let queryParams = EventService.buildQueryParamsString(filter);
        console.log(queryParams);
        return new Promise((resolve, reject) => {
            HttpService.get(`${EventService.baseURL()}` + "/event/resolved?" + queryParams,
                function(data) {
                    resolve(data);
                }, function(textStatus) {
                    reject(textStatus);
                });
        });
    }

    static createEvent(event) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${EventService.baseURL()}` + "/event/", event, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }

    static joinEvent(event){

        let user = UserService.getCurrentUser();
        let userID = user.id;

        return new Promise((resolve, reject) => {
            HttpService.put(`${EventService.baseURL()}` + "/event/join/" + event._id,
                {participant : userID},
                function(data) {
                    resolve(data);
                }, function(textStatus) {
                    reject(textStatus);
                });
        });
    }

    static checkParticipation(event){
        let user = UserService.getCurrentUser();
        let userID = user.id;

        for(let i = 0; i < event.participants.length; i++){
            if(userID === event.participants[i]._id){
                return true;
            }
        }
        return false;
    }

}