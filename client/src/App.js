import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

import PrivateRoutes from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/not-found/NotFound';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className='App'>
                    <Navbar />
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/profiles' component={Profiles} />
                        <Route exact path='/not-found' component={NotFound} />
                        <Route
                            exact
                            path='/profile/:handle'
                            component={Profile}
                        />
                        <PrivateRoutes
                            exact
                            path='/dashboard'
                            component={Dashboard}
                        />
                        <PrivateRoutes
                            exact
                            path='/create-profile'
                            component={CreateProfile}
                        />
                        <PrivateRoutes
                            exact
                            path='/edit-profile'
                            component={EditProfile}
                        />
                        <PrivateRoutes
                            exact
                            path='/add-experience'
                            component={AddExperience}
                        />

                        <PrivateRoutes
                            exact
                            path='/add-education'
                            component={AddEducation}
                        />

                        <PrivateRoutes exact path='/feed' component={Posts} />

                        <PrivateRoutes
                            exact
                            path='/post/:id'
                            component={Post}
                        />
                    </Switch>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
