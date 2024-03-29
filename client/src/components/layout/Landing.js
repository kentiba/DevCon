import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
class Landing extends Component {
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }
    render() {
        return (
            <div className='landing'>
                <div className='dark-overlay landing-inner text-light'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-12 text-center'>
                                <h1 className='display-3 mb-4'>DevCon</h1>
                                <h3 className='mb-4'>
                                    Where all developers meet
                                </h3>
                                <p className='lead'>
                                    {' '}
                                    Create a developer profile/portfolio, share
                                    posts and get help from other developers
                                </p>
                                <hr />

                                <Link
                                    to={'/register'}
                                    className='btn btn-lg btn-info mr-2'
                                >
                                    {' '}
                                    Sign Up
                                </Link>

                                <Link
                                    to={'/login'}
                                    className='btn btn-lg btn-light'
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

export default connect(mapStateToProps)(Landing);
