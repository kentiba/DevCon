import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser} from '../../store/actions/authAction';
import {clearCurrentProfile} from '../../store/actions/profileAction';

class Navbar extends Component {
    onClick = () => {
        this.props.clearCurrentProfile();
        this.props.logoutUser();
    };
    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                    <Link to={'/dashboard'} className='nav-link'>
                        Dashboard
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to={'/feed'} className='nav-link'>
                        Post Feed
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to={'/'} className='nav-link' onClick={this.onClick}>
                        <img
                            className='rounded-circle'
                            src={user.avatar}
                            alt={user.name}
                            style={{width: '25px', marginRight: '5px'}}
                            title='you must have a Gravatar connected to your email to display an image'
                        />
                        Log Out
                    </Link>
                </li>
            </ul>
        );
        const guestLinks = (
            <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                    <Link to={'/register'} className='nav-link'>
                        Sign Up
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to={'/login'} className='nav-link'>
                        Login
                    </Link>
                </li>
            </ul>
        );
        return (
            <nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-4'>
                <div className='container'>
                    <Link to={'/'} className='navbar-brand'>
                        DevCon
                    </Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-toggle='collapse'
                        data-target='#mobile-nav'
                    >
                        <span className='navbar-toggler-icon' />
                    </button>

                    <div className='collapse navbar-collapse' id='mobile-nav'>
                        <ul className='navbar-nav mr-auto'>
                            <li className='nav-item'>
                                <Link to={'/profiles'} className='nav-link'>
                                    Developers
                                </Link>
                            </li>
                        </ul>

                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser()),
        clearCurrentProfile: () => dispatch(clearCurrentProfile()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navbar);
