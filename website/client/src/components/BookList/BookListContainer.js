import React from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';

import NavBar from '../Common/NavBar';
import Footer from '../Common/Footer';
import FormDialog from '../Common/FormDialogs/FormDialog';



const propTypes = {
  no: PropTypes.number.isRequired,
  booklists: PropTypes.array.isRequired,
  books: PropTypes.array,
  username: PropTypes.string.isRequired,
  description: PropTypes.string
};

// will be retrieved from the database
const defaultProps = {
  no: 1,
  username: "Zeynep Cankara",
  description: "Zeynep C. 21 yo. Aspiring eggdog. Bookworm in free time. To the moon.",
  books: [{
    book_id: 1,
    genre: "sci-fi",
    year: 1999,
    name: "Foundation",
    author_id: 1
  },
  {
    book_id: 2,
    genre: "fantasy",
    year: 2021,
    name: "Lord of the Rings",
    author_id: 2
  },
  {
    book_id: 3,
    genre: "sci-fi",
    year: 2020,
    name: "Foundation II",
    author_id: 1
  }],
  booklists: [{
    id: 1,
    name: "markup",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12,
    books: [{
      book_id: 1,
      genre: "sci-fi",
      year: 1999,
      name: "Foundation",
      author_id: 1
    },
    {
      book_id: 2,
      genre: "fantasy",
      year: 2021,
      name: "Lord of the Rings",
      author_id: 2
    },
    {
      book_id: 3,
      genre: "sci-fi",
      year: 2020,
      name: "Foundation II",
      author_id: 1
    }]
  },
  {
    id: 2,
    name: "tiktok",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12,
    books: [{
      book_id: 1,
      genre: "sci-fi",
      year: 1999,
      name: "Foundation",
      author_id: 1
    },
    {
      book_id: 2,
      genre: "fantasy",
      year: 2021,
      name: "Lord of the Rings",
      author_id: 2
    },
    {
      book_id: 3,
      genre: "sci-fi",
      year: 2020,
      name: "Foundation II",
      author_id: 1
    }]
  },
  {
    id: 3,
    name: "express",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12,
    books: [{
      book_id: 1,
      genre: "sci-fi",
      year: 1999,
      name: "Foundation",
      author_id: 1
    },
    {
      book_id: 2,
      genre: "fantasy",
      year: 2021,
      name: "Lord of the Rings",
      author_id: 2
    },
    {
      book_id: 3,
      genre: "sci-fi",
      year: 2020,
      name: "Foundation II",
      author_id: 1
    }]
  }]
};


const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  }
}));

const BookListContainer = (props) => {
  const { no, booklists, username, description, books } = props;

  const history = useHistory();

  const routeChange = (booklist) =>{
    let path = `${booklist}`;
    history.push(path);
  }

  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar></NavBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              My Book Lists
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
            {description}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <FormDialog text="Create Book List" books={books}></FormDialog>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {booklists.map((booklist, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={booklist.image}
                    title={booklist.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                    {booklist.name}
                    </Typography>
                    <Typography>
                    {booklist.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary"
                      onClick={() => routeChange(booklist.name)}>
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Footer></Footer>
    </React.Fragment>
  );
}

BookListContainer.defaultProps = defaultProps;
BookListContainer.propTypes = propTypes;
export default BookListContainer;