import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

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
  }
}));

const NavBar = (props) => {
  const classes = useStyles();

  return (
    <>
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
    </>
  );
}


export default NavBar;