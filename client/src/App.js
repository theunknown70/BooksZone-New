import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import BookDetails from './components/BookDetails/BookDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Chats from './components/Chats/Chats';

const App = () => {
  // const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/books" />} />
          <Route path="/books" exact component={Home} />
          <Route path="/books/search" exact component={Home} />
          <Route path="/books/:id" exact component={BookDetails} />
          <Route path="/auth" exact component={() => (!JSON.parse(localStorage.getItem('profile')) ? <Auth /> : <Redirect to="/books" />)} />
          <Route path="/chats" exact component={() => (JSON.parse(localStorage.getItem('profile')) ? <Chats /> : <Redirect to="/auth" />)} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
