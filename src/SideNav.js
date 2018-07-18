import React, {Component} from 'react';
import './styles.css'

class SideNav extends Component {
    state = {
        query: ''
    };

    render() {
        return (
            <div className="nav" style={{height: window.innerHeight - 48 + "px"}}>
                <div>
                    <input className="input-filter" type="text" placeholder="Filter locations.." id="filter"
                           aria-label="filter search" onChange={this.props.filter}/>
                    <ul className="list-items" aria-label="list of places" role="navigation">
                        {
                            this.props.places.map((mark, index) => {
                                return (<li className="location"
                                            onClick={this.props.openInfoWindow.bind(this, mark)}
                                            value={this.state.query}
                                            key={index}
                                            tabIndex={this.props.isOpen ? -1 : 0}>{mark.title}</li>)

                            })
                        }
                    </ul>
                </div>
                <div>
                    <img  className='powered' src="Foursquare.png" alt="Foresquare logo"/>
                </div>
            </div>
        );
    }
}

export default SideNav