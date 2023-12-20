import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import DocumentationView from "./views/DocumentationView";
import TimersView from "./views/TimersView";
import AddTimersView from "./views/AddTimersView";
import TimersProvider from "./utils/TimersProvider";

const Container = styled.div`
  background: #f0f6fb;
  height: 100vh;
  overflow: auto;
`;

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Timers</Link>
        </li>
        <li>
          <Link to="/docs">Documentation</Link>
        </li>
        <div style={{
          backgroundColor: '#c0c0c0',
          padding: 10,
          borderRadius: 10,
          width: "fit-content",
        }}>
          <Link style={{ textDecoration: "None"}}to="/add">Add Timers</Link>
        </div>

        <div style={{
          backgroundColor: '#c0c0c0',
          padding: 10,
          borderRadius: 10,
          width: "fit-content",
        }}>
          <Link style={{ textDecoration: "None"}}to="/">Home</Link>
        </div>
        
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <TimersProvider>
      <Container>
        <Router>
          <Nav />
          <Routes>
            <Route path="/docs" element={<DocumentationView />} />
            <Route path="/" element={<TimersView />} />
            <Route path="/add" element={<AddTimersView />} />
            <Route path="/edit/:timerId" element={<AddTimersView />} />
          </Routes>
        </Router>
      </Container>
    </TimersProvider>
  );
};

export default App;
