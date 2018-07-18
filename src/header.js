import React, {Component} from 'react';
import './styles.css'

class SideNav extends Component {
    render() {
        return (
            <div className="top-bar">
                <div onClick={this.props.toggleSideNav}
                     aria-label="toggle Navigation" className='toggle-nav'>
                    {this.props.isOpen ?
                        <i className="material-icons">
                            close
                        </i> :
                        <i className="material-icons">
                            menu
                        </i>
                    }
                </div>
                <div className='title'>
                    Neighborhood Map
                </div>
            </div>


        );

    }
}

export default SideNav