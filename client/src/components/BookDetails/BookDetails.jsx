import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, Chip, Button } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { getOrCreateChat } from 'react-chat-engine'

import { getBook, getBooksBySearch } from '../../actions/books';
import useStyles from './styles';

const Book = () => {
  const { book, books, isLoading } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  useEffect(() => {
    dispatch(getBook(id));
  }, [id]);

  useEffect(() => {
    if (book) {
      dispatch(getBooksBySearch({ branch: 'none', year: 'none', tags: book?.tags.join(',') }));
    }
  }, [book]);

	const createDirectChat = () => {
		getOrCreateChat(
			{userName: user?.result?.name, userSecret: user?.result?.googleId, projectID: `${process.env.REACT_APP_PROJECT_ID}`},
			{is_direct_chat: true, usernames: [book?.name]},
		)
    history.push('/chats')
	}

  if (!book) return null;

  const openBook = (_id) => history.push(`/books/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedBooks = books.filter(({ _id }) => _id !== book._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{`₹${book.price} /-`}</Typography>
          <div className={classes.root}>
          {book.tags.map((tag) => {let icon = <MenuBookIcon />; return(<Chip icon={icon} color="primary" variant="outlined" label={tag} />)})}
          </div>
          <Paper className={classes.cardsmall} raised elevation={3}>
          <Typography gutterBottom variant="body1" component="p">{`College: ${book.college}`}</Typography>
          </Paper>
          <Paper className={classes.cardsmall} raised elevation={3}>
          <Typography gutterBottom variant="body1" component="p">{`Year: ${book.year}`}</Typography>
          </Paper>
          <Paper className={classes.cardsmall} raised elevation={3}>
          <Typography gutterBottom variant="body1" component="p">{`Branch: ${book.branch}`}</Typography>
          </Paper>
          <Typography variant="h6">Created by: {book.name}</Typography>
          <Typography variant="body1">{moment(book.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          {user?.result?.name && user?.result?.googleId !== book?.creator ? <Button variant="contained" color="primary" onClick={() => createDirectChat()}>{`Chat with ${book.name}`}</Button> : user?.result?.name ? '' : 'Please Sign In to Chat'}
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={book.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={book.price} />
        </div>
      </div>
      {!!recommendedBooks.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedBooks}>
            {recommendedBooks.map(({ price, name, tags, likes, selectedFile, _id }) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openBook(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{`₹${price} /-`}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <div className={classes.root}>
                  {tags.map((tag) => <Chip variant="outlined" size="small" label={tag} />)}
                </div>  
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                <img src={selectedFile} width="200px" style={{borderRadius: '10px'}} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default Book;
