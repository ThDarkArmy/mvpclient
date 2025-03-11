import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, MenuItem, Menu,   IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
 } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import axios from "../config/AxiosInterceptor";
import { toast } from "react-toastify";
import TitleLogo from "../assets/TitleLogo.png"

// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

const BASE_URL = "http://localhost:8000/api/v1";

// import { global as globalThis } from "global";

// // Polyfill the global object
// if (typeof window.global === "undefined") {
//   window.global = globalThis;
// }

const Header = () => {
  const loggedInUser = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate()
  const [logOutAnchorEl, setLogOutAnchorEl] = useState(null);

  const openLogout = Boolean(logOutAnchorEl);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };
    token && loadNotifications();
  }, []);


  // useEffect(() => {
  //   // Create a WebSocket connection
  //   const socket = new SockJS("http://localhost:8000/ws");
  //   const stompClient = new Client({
  //     webSocketFactory: () => socket,
  //     debug: (str) => console.log(str),
  //     reconnectDelay: 5000,
  //   });

  //   // Connect to the WebSocket server
  //   stompClient.onConnect = (frame) => {
  //     console.log("Connected: " + frame);
  //     // Subscribe to the "/topic/notifications" endpoint
  //     stompClient.subscribe("/topic/notifications", (message) => {
  //       const notification = message.body;
  //       setNotifications((prev) => [...prev, notification]);
  //     });
  //   };

  //   stompClient.onStompError = (frame) => {
  //     console.error("Broker reported error: " + frame.headers["message"]);
  //     console.error("Additional details: " + frame.body);
  //   };

  //   stompClient.activate();

  //   // Cleanup on component unmount
  //   return () => {
  //     stompClient.deactivate();
  //   };
  // }, []);

  

  // Handle click on notifications icon
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mark a notification as read
  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      setError("Failed to mark notification as read.");
    }
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications?.filter((n) => !n.isRead).length;


  const fetchNotifications = async () => {
    try{
      const response = await axios.get(`${BASE_URL}/notifications`);
      return response.data;
    }catch(err){
      toast.error(err.message)
    }
  };
  
  const markNotificationAsRead = async (notificationId) => {
    try{
      const response = await axios.put(`${BASE_URL}/notifications/${notificationId}/read`);
      return response;
    }catch(err){
      toast.error(err.message)
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'transparent', // Transparent background
        boxShadow: 'none', // No shadow
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1100,
        backdropFilter: 'blur(8px)', // Slight blur effect
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent)',
      }}
    >
      <Toolbar>
        {/* Left Side Logo */}
        <Box sx={{
          height: 60,
          width: 60,
          mb: 0.1,
        }} src={TitleLogo} component="img" />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold', ml: 1 }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            First-Buy
          </Link>
        </Typography>

        {/* Right Side Navigation */}
        <Box display="flex">
          <Button
            color="primary"
            variant="text"
            component={Link}
            to="/rewards-dashboard"
            sx={{ marginRight: 2 }}
          >
            Properties
          </Button>
          <Button
            color="primary"
            variant="text"
            component={Link}
            to="/points-dashboard"
            sx={{ marginRight: 2 }}
          >
            Rewards
          </Button>
          <IconButton sx={{ mt: 1, ml: 1, mr: 2, cursor: "pointer" }} color="inherit" onClick={handleClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
         
          {localStorage.getItem('token') ? (
            <Box
              onClick={(event) => setLogOutAnchorEl(event.currentTarget)}
              title="Profile"
              sx={{
                background: `#373b44`,
                paddingRight: 2,
                paddingBottom: 0,
                paddingTop: 0.9,
                paddingLeft: 2,
                borderRadius: 3,
                cursor: "pointer"
              }}
            >
              {" "}
              <Typography
                variant="h6"
                sx={{ color: "ThreeDFace" }}
              >
                {" "}
                {loggedInUser}
              </Typography>
            </Box>
          ) : <Button
            color="primary"
            variant="contained"
            component={Link}
            to="/login"
            sx={{
              borderRadius: 8,
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            Login
          </Button>}

          <Menu
            id="basic-menu"
            anchorEl={logOutAnchorEl}
            open={openLogout}
            onClose={() => setLogOutAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >

            {/* <MenuItem
              onClick={() => {
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem> */}
            <MenuItem
              onClick={() => {
                localStorage.clear();
                setLogOutAnchorEl(null);
                navigate("/login");
              }}
            >
              Log Out
            </MenuItem>

          </Menu>
        </Box>
      </Toolbar>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>

          {loading ? (
            <CircularProgress size={24} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : notifications?.length > 0 ? (
            <List>
              {notifications?.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    backgroundColor: notification.isRead ? "transparent" : "#f0f0f0",
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.message}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No new notifications.</Typography>
          )}
        </Box>
      </Popover>
    </AppBar>
  );
};

export default Header;
