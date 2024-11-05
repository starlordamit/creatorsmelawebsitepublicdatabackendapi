// src/pages/Dashboard.js
import React from "react";
import { Typography, Container } from "@mui/material";
import NavBar from "../components/NavBar";

function Dashboard() {
  return (
    <Container>
      <NavBar></NavBar>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Dashboard
      </Typography>
    </Container>
  );
}

export default Dashboard;
