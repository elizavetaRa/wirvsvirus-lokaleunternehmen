import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";

import MenuBar from "components/MenuBar";
import Footer from "components/Footer";

import routes from "routes";
import bgImage from "assets/img/sidebar-wirvsvirus.jpeg";

import { makeStyles } from "@material-ui/core/styles";

const footerHeigth = "48px";

const styles = theme => ({
  AppContainer: {
    position: "relative",
    minHeight: "100vH",
    display: 'flex',
    flexDirection: 'column',
    "&:after": {
      content: '""',
      opacity: 0.5,
      background: `url(${bgImage}) no-repeat center center fixed`,
      backgroundSize: "cover",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: "absolute",
      zIndex: "-1"
    }
  },
  MainContainer: {
    position: "relative",
    paddingBottom: footerHeigth,
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
  },
  MapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: footerHeigth,
    [theme.breakpoints.down('xs')]: {
      bottom: 0
    },
  },
  ContentContainer: {
    padding: "40px",
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      "& .MuiPaper-root": {
        borderRadius: 0
      }
    },
  }
});
const useStyles = makeStyles(styles);

const Default = () => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.AppContainer}>
        <MenuBar />
        <Box className={classes.MainContainer}>
          <Switch>
            {routes.map(({ active, path, Component, fullWidth }) => {
              if (!active) {
                return null;
              }
              if (fullWidth) {
                return (
                  <Route path={path} key={path}>
                    <Box className={classes.MapContainer}>
                      <Component />
                    </Box>
                  </Route>
                );
              }

              return (
                <Route path={path} key={path}>
                  <Container className={classes.ContentContainer} maxWidth="lg">
                    <Component />
                  </Container>
                </Route>
              );
            })}
            <Redirect from="/" to="/home" />
          </Switch>
        </Box>
      </Box>
      <Hidden smDown>
        <Footer />
      </Hidden>
    </>
  );
};

export default Default;
