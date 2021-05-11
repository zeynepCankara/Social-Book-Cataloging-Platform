import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const propTypes = {
  no: PropTypes.number.isRequired,
  booklists: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string
};

// use it to test the booklist cards
const defaultProps = {
  no: 1,
  booklists: [{
    id: 1,
    name: "markup",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12
  },
  {
    id: 2,
    name: "tiktok",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12
  },
  {
    id: 3,
    name: "express",
    owner: "zcankara",
    image: "https://source.unsplash.com/1600x1200/?book,fantastic,movie,start-wars,game-of-thrones",
    creation_date: "11/05/2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nof_followers: 12
  }],
  username: "Zeynep Cankara",
  description: "Bio: Zeynep. 21 y.o. Aspiring eggdog. Senior @Bilkent CS"
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
  link: {
    margin: theme.spacing(1, 1.5),
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
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const BookListContainer = (props) => {
  const { no, booklists, username, description } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            LibRead
          </Typography>
          <nav>
            <Link variant="button" color="textPrimary" href="./home" className={classes.link}>
              Home
            </Link>
            <Link variant="button" color="textPrimary" href="./booklist" className={classes.link}>
              My Lists
            </Link>
            <Link variant="button" color="textPrimary" href="./browse" className={classes.link}>
              Browse
            </Link>
            <Link variant="button" color="textPrimary" href="./community" className={classes.link}>
              Community
            </Link>
            <Link variant="button" color="textPrimary" href="./challenge" className={classes.link}>
              Challenge
            </Link>
            <Link variant="button" color="textPrimary" href="./market" className={classes.link}>
              Market
            </Link>
          </nav>
          <Button href="./login" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

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
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {booklists.map((booklist) => (
              <Grid item key={booklist.toString()} xs={12} sm={6} md={4}>
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
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}

BookListContainer.defaultProps = defaultProps;
BookListContainer.propTypes = propTypes;
export default BookListContainer;