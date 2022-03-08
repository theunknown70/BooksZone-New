import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, InputLabel, Select, FormControl } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createBook, updateBook } from '../../actions/books';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [bookData, setBookData] = useState({ price: '', location: '', college: '', year: '', branch: '', tags: [], selectedFile: '' });
  const book = useSelector((state) => (currentId ? state.books.books.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const clear = () => {
    setCurrentId(0);
    setBookData({ price: '', location: '', college: '', year: '', branch: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!book?.price) clear();
    if (book) setBookData(book);
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createBook({ ...bookData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updateBook(currentId, { ...bookData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to post your Book.
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    setBookData({ ...bookData, tags: [...bookData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setBookData({ ...bookData, tags: bookData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" validate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
      <Typography variant="h6">{currentId ? `Editing "${book?.price}"` : 'Creating a Book'}</Typography>
      <FormControl required variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="college">College</InputLabel>
        <Select
          native
          value={bookData.college}
          onChange={(e) => setBookData({ ...bookData, college: e.target.value })}
          name="college" 
          label="College" 
          fullWidth 
          inputProps={{
            id: 'college',
          }}
        >
          <option aria-label="None" value="" />
          <option value="VJTI">VJTI</option>
        </Select>
      </FormControl>
      <FormControl required variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="year">Year</InputLabel>
        <Select
          native
          value={bookData.year}
          onChange={(e) => setBookData({ ...bookData, year: e.target.value })}
          name="year" 
          label="Year" 
          fullWidth 
          inputProps={{
            id: 'year',
          }}
        >
          <option aria-label="None" value="" />
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>
        </FormControl>
        <FormControl required variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="branch">Branch</InputLabel>
        <Select
          native
          value={bookData.branch}
          onChange={(e) => setBookData({ ...bookData, branch: e.target.value })}
          name="branch" 
          label="Branch" 
          fullWidth 
          inputProps={{
            id: 'branch',
          }}
        >
          <option aria-label="None" value="" />
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
        <div style={{ padding: '5px 0', width: '96%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Enter Your Books *"
            fullWidth
            value={bookData.tags} 
            newChipKeys={['Enter', ' ', ',', '.']} 
            blurBehavior='add' 
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)} 
          />
        </div>
        <TextField type="number" required name="price" variant="outlined" label="Price" fullWidth value={bookData.price} onChange={(e) => setBookData({ ...bookData, price: e.target.value })} />
        <TextField required name="location" variant="outlined" label="Location" fullWidth value={bookData.location} onChange={(e) => setBookData({ ...bookData, location: e.target.value })} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setBookData({ ...bookData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
