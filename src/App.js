import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Container, Typography, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from 'axios';
import './App.css';

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredData(data.filter(item => item.name.toLowerCase().includes(term)));
  };

  return (
    <Container className="container">
      <header>
        <Typography variant="h4" gutterBottom>
          User List
        </Typography>
      </header>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        className="search-bar"
        value={searchTerm}
        onChange={handleSearch}
      />
      {loading ? (
        <div className="circular-progress">
          <CircularProgress />
        </div>
      ) : (
        <List className="user-list">
          {filteredData.map(item => (
            <ListItem key={item.id} className="user-list-item" button component="a" href={`/user/${item.id}`}>
              <ListItemText primary={item.name} secondary={`Email: ${item.email}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        setLoading(false);
      });
  }, [id]);

  return (
    <Container className="container">
      <header>
        <Typography variant="h4" gutterBottom>
          User Details
        </Typography>
      </header>
      {loading ? (
        <div className="circular-progress">
          <CircularProgress />
        </div>
      ) : (
        user && (
          <div className="user-details">
          <Typography variant="h6" gutterBottom>
  Name: {user.name}
</Typography>
<Typography variant="body1" gutterBottom>
  Email: {user.email}
</Typography>
<Typography variant="body1" gutterBottom>
  Phone: {user.phone}
</Typography>
<Typography variant="body1" gutterBottom>
  Website: {user.website}
</Typography>
<Typography variant="body1" gutterBottom>
  Address: {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
</Typography>
<Typography variant="body1" gutterBottom>
  Company: {user.company.name} - {user.company.catchPhrase}
</Typography>

          </div>
        )
      )}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Container className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<UserDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
