// src/components/NavBar.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Styled Components for Enhanced UI
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 250,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ActiveListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.action.selected,
}));

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For user profile menu
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Handle Drawer Toggle
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Handle User Profile Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu Items with Icons
  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Creators", path: "/creator", icon: <PeopleIcon /> },
    { text: "Brands", path: "/brand", icon: <BusinessIcon /> },
    { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          {/* Menu Icon for Mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo or Site Name */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            CreatorsMela
          </Typography>

          {/* Menu Items for Desktop */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
            {/* User Profile Avatar */}
            <Tooltip title="Account settings">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 2 }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer for Mobile View */}
      <StyledDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color:
                      location.pathname === item.path
                        ? "primary"
                        : "textPrimary",
                  }}
                />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </StyledDrawer>

      {/* User Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Add additional profile-related menu items here */}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/settings");
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavBar;
