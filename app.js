require("dotenv").config();
let express = require('express');
let app = express();
let sequelize = require('./db');

let user = require('./controllers/usercontroller');
let poll = require('./controllers/pollcontroller');
let responses = require('./controllers/pollrespcontroller');

sequelize.sync();
// sequelize.sync({force:true}) //to force reset db in pgAdmin

app.use(require('./middleware/headers'));
app.use(express.json());

// /****
//  *  EXPOSED route *
//  ****/
 app.use('/user', user);

 /****
  *  PROTECTED route * - need a token
  ****/
 app.use('/poll', poll);
 app.use('/responses', responses);
 

 app.listen(3000, function(){
     console.log('App is listening on port 3000');
 }) 