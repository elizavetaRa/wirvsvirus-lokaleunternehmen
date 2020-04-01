import React, { useState, useContext } from "react";

import { NavLink as NavLinkBase } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";

import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import { AuthContext } from 'App.js'


import logo from "assets/img/logo-web.jpg";

const NavLink = ({ to, children }) => <NavLinkBase to={to} style={{ color: 'inherit', textDecoration: 'none' }}>{children}</NavLinkBase>

const MenuBar = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext)
  const [open, setOpen] = useState(false);

  const toggleDrawer = value => () => {
    setOpen(value);
  };

  return (
    <>
      <AppBar position="static" style={{ zIndex: 9999 }}>
        <Container style={{ display: 'flex' }} maxWidth="lg">
          <img src={logo} style={{ height: '70px' }}/>
        <Toolbar style={{  flexGrow: 1 }}>
          <Hidden smDown>
            <NavLink to="/home">
              <Button color="inherit">Home</Button>
            </NavLink>
            <NavLink to="/maps">
              <Button color="inherit">Karte</Button>
            </NavLink>
            {loggedIn && <NavLink to="/profil">
              <Button color="inherit">Profil</Button>
            </NavLink>}
            <NavLink to="/about">
              <Button color="inherit">Über Bleib Lokal!</Button>
            </NavLink>
            {!loggedIn && <NavLink to="/register">
              <Button color="inherit">Login/Registrieren</Button>
            </NavLink>}
          </Hidden>
          <div style={{ flexGrow: 1 }} />
          <Hidden smDown>
            <NavLink to="/impressum">
              <Button size="small" color="inherit">
                Impressum
              </Button>
            </NavLink>
            <NavLink to="/datenschutz">
              <Button size="small" color="inherit">
                Datenschutz
              </Button>
            </NavLink>
            <NavLink to="/agb">
              <Button size="small" color="inherit">
                AGBs
              </Button>
            </NavLink>
            {loggedIn && <NavLink to="/logout">
              <Button color="inherit">logout</Button>
            </NavLink>}
          </Hidden>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Mobile Drawer"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
        </Container>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <List>
          <NavLink to="/home">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </NavLink>
          <NavLink to="/maps">
            <ListItem button>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Karte" />
            </ListItem>
          </NavLink>
          <NavLink to="/about">
            <ListItem button>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Über Bleib Lokal!" />
            </ListItem>
            <Divider />
          </NavLink>

          <NavLink to="/register">
            <ListItem button>
              <ListItemIcon>
                <BusinessCenterIcon />
              </ListItemIcon>
              <ListItemText primary="Registrieren" />
            </ListItem>
            <Divider />
          </NavLink>

          <NavLink to="/impressum">
            <ListItem button>
              <ListItemText primary="Impressum" />
            </ListItem>
          </NavLink>
          <NavLink to="/datenschutz">
            <ListItem button>
              <ListItemText primary="Datenschutz" />
            </ListItem>
          </NavLink>
          <NavLink to="/agb">
            <ListItem button>
              <ListItemText primary="AGBs" />
            </ListItem>
          </NavLink>
        </List>
      </Drawer>
    </>
  );
};

export default MenuBar;
