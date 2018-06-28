
import React from "react";
import { Button, Glyphicon, ListGroup, ListGroupItem } from "react-bootstrap";

const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");


export default class LocationMap extends React.PureComponent {

    constructor(props) {
        super(props);
        this.onFirstPlaceChanged = this.onFirstPlaceChanged.bind(this);
    }

    onFirstPlaceChanged(place) {
        if (place) {
            const sportLocation = {
                name: place.formatted_address.includes(place.name) ? place.formatted_address: place.name + ' (' + place.formatted_address + ')',
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
            }
            this.props.onLocationSet(sportLocation);
        }
    }

    render() {
        const MapWithASearchBox = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC022vcczx-Uvw4FXrky0qbXtApe1Vi3GU&v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `400px` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            lifecycle({
                componentWillMount() {
                    const refs = {}

                    this.setState({
                        bounds: null,
                        center: {
                            lat: 48.137154, lng: 11.576124
                        },
                        markers: [],
                        onMapMounted: ref => {
                            refs.map = ref;
                        },
                        onSearchBoxMounted: ref => {
                            refs.searchBox = ref;
                        },
                        onPlacesChanged: () => {
                            const places = refs.searchBox.getPlaces();
                            const bounds = new google.maps.LatLngBounds();

                            places.forEach(place => {
                                if (place.geometry.viewport) {
                                    bounds.union(place.geometry.viewport)
                                } else {
                                    bounds.extend(place.geometry.location)
                                }
                            });
                            const nextMarkers = places.map(place => ({
                                position: place.geometry.location,
                            }));
                            const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                            this.setState({
                                center: nextCenter,
                                //only the first marker
                                markers: [nextMarkers[0]],
                            });
                            return places[0];
                        },
                    })
                },
            }),
            withScriptjs,
            withGoogleMap
        )(props =>
            <GoogleMap
                ref={props.onMapMounted}
                defaultZoom={13}
                center={props.center}
            >
                <SearchBox
                    ref={props.onSearchBoxMounted}
                    bounds={props.bounds}
                    controlPosition={google.maps.ControlPosition.TOP_LEFT}
                    onPlacesChanged={e => this.onFirstPlaceChanged(props.onPlacesChanged())}
                >
                    <input
                        type="text"
                        placeholder="Search"
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `240px`,
                            height: `32px`,
                            marginTop: `27px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                        }}
                    />
                </SearchBox>
                {props.markers.map((marker, index) =>
                    <Marker key={index} position={marker.position} />
                )}
            </GoogleMap>
        );

        return <MapWithASearchBox />;
    }
}