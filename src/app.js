/*global google*/
// above is used to skip the error thrown by js-linters about google is not defined.
import React, {Component} from 'react';
import SideNav from './SideNav'
import Header from './header'
import './styles.css'

let places = [];

//FourSquare credentials.
const clientId = 'IZBVJKGTG10ZJYO1LLIGTSYNQEQHVNX0ZNIL5B2O43TAZS4B';
const clientSecret = 'ABYF3EVHENOQOBWNO05EFEEYZI1E11D1PUAQX50MJSD41VRB';

export default class App extends Component {
    state = {
        isOpen: false,
        filterMarkers: [],
        defaultMarkers: [],
        map: '',
        infoWindow: ''
    };

    //fetching local places database
    //bootstrapping google map to HOC
    //taken from http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
    componentDidMount() {
        fetch('places_db.json')
            .then(res => res.json())
            .then(data => {
                    places = data.places;
                    window.initMap = this.initMap;
                }
            );
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBnhAuH_t1lAySIwStH75hrTGlWHEmOUuI&callback=initMap')
    };

    //initialize the google map. register it in state so that it'll be available to other components
    initMap = () => {
        this.setState(() => {
            return {
                map: new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    styles: [
                        {
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#242f3e"
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#746855"
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#242f3e"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.locality",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#d59563"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#d59563"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#263c3f"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#6b9a76"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#38414e"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#212a37"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#9ca5b3"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#746855"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#1f2835"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#f3d19c"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#2f3948"
                                }
                            ]
                        },
                        {
                            "featureType": "transit.station",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#d59563"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#17263c"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#515c6d"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#17263c"
                                }
                            ]
                        }
                    ]
                }),
                infoWindow: new google.maps.InfoWindow({})
            }
        });
        this.setMarker();
        google.maps.event.addDomListener(window, 'resize', () => {
            this.autoRecenterMap()
        });
    };

    //function to deploy markers on the google map
    setMarker = () => {
        let bounds = new google.maps.LatLngBounds();
        let marker = [];
        places.forEach((location, index) => {
            marker.push(new google.maps.Marker({
                map: this.state.map,
                position: {lat: location.lat, lng: location.lng},
                title: location.name,
                animation: window.google.maps.Animation.DROP
            }));
            google.maps.event.addListener(marker[index], 'click', () => {
                this.openInfoWindow(marker[index]);
            });

            //after each marker deployed bound map again to include those markers
            let markerPosition = new google.maps.LatLng(marker[index].position.lat(), marker[index].position.lng());
            bounds.extend(markerPosition);
            this.autoRecenterMap(bounds)
        });
        this.setState({
            filterMarkers: marker,
            defaultMarkers: marker,
        });
    };

    //to recenter map after window resize or changing current marker
    autoRecenterMap = (bounds) => {
        this.state.map.fitBounds(bounds);
        this.state.map.panToBounds(bounds);
    };

    //used to fetch data from FourSquare api
    //handled all possible errors
    fetchData = (marker) => {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180516&ll=${lat},${lng}`;

        this.state.infoWindow.setContent("Getting data");
        fetch(url)
            .then((res) => {
                if (res.status !== 200) {
                    this.state.infoWindow.setContent('Error!');
                    return;
                }
                res.json()
                    .then((data) => {
                        let venue = data.response.venues[0];
                        fetch(`https://api.foursquare.com/v2/venues/${venue.id}/?client_id=${clientId}&client_secret=${clientSecret}&v=20180516`)
                            .then((res1) => {
                                res1.json()
                                    .then(data => {
                                        console.log(data);
                                        try {
                                            let detailedData = data.response.venue;
                                            console.log(detailedData);
                                            this.state.infoWindow.setContent(`<h4>${marker.title}</h4> <br>Ratings : ${detailedData.rating}<br>Likes : ${detailedData.likes.count}`)
                                        }
                                        catch (e) {
                                            console.log(e);
                                            alert('error occurred')
                                        }
                                    })
                            })
                            .catch(e => {
                                console.log(e);
                                alert('error occurred')
                            })
                    })
            })
            .catch(e => {
                console.log(e);
                alert('error occurred')
            });
    };

    //used to display info about the marker/location
    openInfoWindow = (marker) => {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 2000);

        this.state.map.panTo(marker.getPosition());
        this.fetchData(marker);
        this.state.infoWindow.open(this.state.map, marker);

    };

    //used to filter the locations on users input
    filter = (event) => {
        this.state.infoWindow.close();
        let filterLocations = [];
        if (event.target.value === '' || filterLocations.length === 0) {
            this.state.defaultMarkers.forEach((marker) => {
                if (marker.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                    marker.setVisible(true);
                    filterLocations.push(marker);
                }
                else {
                    marker.setVisible(false);
                }
            });
        }
        else {
            this.state.filterMarkers.forEach((marker) => {
                if (marker.title.toLowerCase().indexOf(event.target.value) >= 0) {
                    marker.setVisible(true);
                    filterLocations.push(marker);
                }
                else {
                    marker.setVisible(false);
                }
            });
        }
        this.setState({
            filterMarkers: filterLocations
        })
    };

    //used to hide/show the side bar
    toggleSideNav = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.state.infoWindow.close();
    };

    render() {
        return (
            <div>
                <Header
                    isOpen={this.state.isOpen}
                    toggleSideNav={this.toggleSideNav}
                    aria-label="toggle Navigation"/>

                <div className="container" role="main">
                    {this.state.isOpen &&
                    <SideNav style={{height: window.innerHeight - 48 + "px"}}
                             places={this.state.filterMarkers}
                             openInfoWindow={this.openInfoWindow} filter={this.filter}
                             isOpen={this.props.isOpen}/>
                    }

                    <div className="map-container"
                         role="application"
                         tabIndex="-1">
                        <div id="map" style={{height: window.innerHeight - 48 + "px"}}/>
                    </div>
                </div>
            </div>

        );
    }
}

//taken from http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName('script')[0];
    var script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = () => {
        alert('error occured. please refresh the page.')
    };
    ref.parentNode.insertBefore(script, ref);
}