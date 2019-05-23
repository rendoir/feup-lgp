import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../components/header/Header';
import '../styles/App.css';
import {
  defaultLanguage,
  LanguageContext,
  preferedLanguage,
  saveLanguage
} from '../utils/language';

import Backoffice from './Backoffice';
import Conference from './Conference';
import Conferences from './Conferences';
import ConferenceShop from './ConferenceShop';
import ErrorBoundary from './ErrorBoundary';
import Feed from './Feed';
import Landing from './Landing';
import Notifications from './Notifications';
import PostView from './PostView';
import Profile from './Profile';
import SearchResults from './SearchResults';
import Shop from './Shop';
import Talk from './Talk';

type State = {
  language: string;
};

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      language: preferedLanguage ? preferedLanguage : defaultLanguage
    };

    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  public render() {
    return (
      <div className="App">
        <LanguageContext.Provider value={this.state.language}>
          <Router>
            <ErrorBoundary>
              <Header title={'gNet'} onLanguageChange={this.onLanguageChange} />
              <Switch>
                <Route path="/user/:id" component={Profile} />
                {/*<Route path="/user/:id/edit" component={EditProfile} />*/}
                <Route path="/post/:id" component={PostView} />
                <Route path="/admin" component={Backoffice} />
                <Route path="/shop" component={Shop} />
                <Route path="/landing" component={Landing} />
                <Route path="/search" component={SearchResults} />
                <Route path="/talk/:id" component={Talk} />
                <Route path="/conference/:id/shop" component={ConferenceShop} />
                <Route path="/conference/:id" component={Conference} />
                <Route path="/conferences/" component={Conferences} />
                <Route path="/notifications" component={Notifications} />
                <Route component={Feed} /> {/* default */}
              </Switch>
            </ErrorBoundary>
          </Router>
        </LanguageContext.Provider>
      </div>
    );
  }

  public onLanguageChange(lang: string) {
    this.setState({
      language: lang
    });
    saveLanguage(lang);
  }
}

export default App;
