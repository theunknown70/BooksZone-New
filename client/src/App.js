import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import BookDetails from './components/BookDetails/BookDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/books" />} />
          <Route path="/books" exact component={Home} />
          <Route path="/books/search" exact component={Home} />
          <Route path="/books/:id" exact component={BookDetails} />
          <Route path="/auth" exact component={() => (!user ? <Auth /> : <Redirect to="/books" />)} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
