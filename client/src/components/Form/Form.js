import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createBook, updateBook } from '../../actions/books';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [bookData, setBookData] = useState({ title: '', number: '', college: '', year: '', branch: '', tags: [], selectedFile: '' });
  const book = useSelector((state) => (currentId ? state.books.books.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const clear = () => {
    setCurrentId(0);
    setBookData({ title: '', number: '', college: '', year: '', branch: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!book?.title) clear();
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
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${book?.title}"` : 'Creating a Book'}</Typography>
        <TextField name="title" variant="outlined" label="Price" fullWidth value={bookData.title} onChange={(e) => setBookData({ ...bookData, title: e.target.value })} />
        <TextField name="number" variant="outlined" label="Number" fullWidth value={bookData.number} onChange={(e) => setBookData({ ...bookData, number: e.target.value })} />
        <TextField name="college" variant="outlined" label="College" fullWidth value={bookData.college} onChange={(e) => setBookData({ ...bookData, college: e.target.value })} />
        <TextField name="year" variant="outlined" label="Year" fullWidth value={bookData.year} onChange={(e) => setBookData({ ...bookData, year: e.target.value })} />
        <TextField name="branch" variant="outlined" label="Branch" fullWidth value={bookData.branch} onChange={(e) => setBookData({ ...bookData, branch: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Enter Your Books"
            fullWidth
            value={bookData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setBookData({ ...bookData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
