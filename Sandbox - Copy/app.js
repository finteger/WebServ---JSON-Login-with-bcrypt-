const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
//Use the body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/css'));

app.get('/', (req, res) => {

    try{
       res.render('home.ejs');

    } catch(err){

        res.send('Server error.  Please try again later.');

    }

});



// Sample JSON data to simulate user data
const usersData = require('./users.json');

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Find user in the usersData by username
  const user = usersData.users.find((user) => user.username === username);

    console.log(usersData);

  if (!user) {
    // User not found
    res.status(401).send('Invalid username or password');
    return;
  }

  // Compare the provided password with the hashed password in the user object
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      // Something went wrong during comparison
      console.error('Error while comparing passwords:', err);
      res.status(500).send('Internal server error');
      return;
    }

    if (result) {
      // Passwords match, login successful
      res.send('Logged in successfully');
    } else {
      // Passwords do not match
      res.status(401).send('Invalid username or password');
    }
  });
});

app.post('/register', function (req, res) {
    const { username, password, confirmPassword } = req.body;
  
    // Check if the username already exists
    const existingUser = usersData.users.find((user) => user.username === username);
    if (existingUser) {
      res.status(400).send('Username already exists');
      return;
    }
  
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      res.status(400).send('Passwords do not match');
      return;
    }
  
    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error while hashing password:', err);
        res.status(500).send('Internal server error');
        return;
      }
  
      // Add the new user to the usersData
      usersData.users.push({
        username: username,
        password: hashedPassword
      });
  
      // Save the updated usersData to the JSON file
      fs.writeFile('users.json', JSON.stringify(usersData, null, 2), (err) => {
        if (err) {
          console.error('Error while saving user data:', err);
          res.status(500).send('Internal server error');
        } else {
          res.send('User registered successfully');
        }
      });
    });
  });


app.get('/register', (req, res) =>{
    res.render('register');
})  

const port = 3000;

app.listen(port, () =>{

console.log(`Successfully connected to http://localhost:${port}`);

})