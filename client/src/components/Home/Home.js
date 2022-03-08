import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, FormControl, InputLabel, Select } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getBooksBySearch } from '../../actions/books';
import Books from '../Books/Books';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const yearQuery = query.get('yearQuery');
  const branchQuery = query.get('branchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [year, setYear] = useState('1');
  const [branch, setBranch] = useState('CS');
  const [tags, setTags] = useState([]);
  const history = useHistory();

  const searchBook = () => {
    if (branch.trim() || year || tags) {
      dispatch(getBooksBySearch({ branch, year, tags: tags.join(',') }));
      history.push(`/books/search?branchQuery=${branch || 'none'}&yearQuery=${year || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchBook();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Books setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="year">Search By Year</InputLabel>
                <Select
                  native
                  value={year}
                  onChange={(e) => setYear(e.target.value)} 
                  name="year" 
                  label="Search By Year" 
                  fullWidth 
                  inputProps={{
                    id: 'year',
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Select>
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="branch">Search By Branch</InputLabel>
                <Select
                  native
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)} 
                  name="branch" 
                  label="Search By Branch" 
                  fullWidth 
                  inputProps={{
                    id: 'branch',
                  }}
                >
                  <option value="CS">CS</option>
                  <option value="IT">IT</option>
                  <option value="Electronics">Electronics</option>
                  <option value="ExTC">ExTC</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Production">Production</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Civil">Civil</option>
                  <option value="Textile">Textile</option>
                </Select>
              </FormControl>
              <ChipInput
                style={{ margin: '10px 8px' , width: '96%' }}
                label="Search By Books"
                value={tags}
                newChipKeys={['Enter', ' ', ',', '.']} 
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip) => handleDeleteChip(chip)}
                variant="outlined"
                blurBehavior='add' 
              />
              <Button onClick={searchBook} className={classes.searchButton} variant="contained" color="primary">Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!branchQuery && !yearQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
