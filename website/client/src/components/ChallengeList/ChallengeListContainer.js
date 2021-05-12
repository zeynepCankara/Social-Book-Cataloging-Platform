import React from 'react';
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
import ChallengeFormDialog from '../Common/FormDialogs/ChallengeFormDialog';


const propTypes = {
  id: PropTypes.number.isRequired,
  creator: PropTypes.array.isRequired,
  number_of_participants: PropTypes.number.isRequired,
  challenges: PropTypes.array,
  description: PropTypes.string
};

// use it to test the booklist cards
const defaultProps = {
  id: 1,
  creator: "Librarian",
  description: "See available challenges",
  number_of_participants: 12,
  challenges: [{
    challenge_id: 1,
    name: "Weekly Challenge",
    image: "https://source.unsplash.com/1600x1200/?prize,challenge,flag",
    start_date: "12-02-2021",
    end_date: "15-03-2021",
    type: "open",
    creator_id: 1,
    winner_id: 12
  },
  {
    challenge_id: 2,
    name: "Monthly Challenge",
    image: "https://source.unsplash.com/1600x1200/?prize,challenge,flag",
    start_date: "12-02-2021",
    end_date: "15-03-2021",
    type: "open",
    creator_id: 1,
    winner_id: 12
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

const ChallengeListContainer = (props) => {

  const { id, creator, number_of_participants, challenges, description} = props;
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
              Challenges
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
            {description}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <ChallengeFormDialog text="Create New Challenge" ></ChallengeFormDialog>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {challenges.map((challenge, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={challenge.image}
                    title={challenge.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                    {challenge.name}
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
      <Footer></Footer>
    </React.Fragment>
  );
}

ChallengeListContainer.defaultProps = defaultProps;
ChallengeListContainer.propTypes = propTypes;
export default ChallengeListContainer;