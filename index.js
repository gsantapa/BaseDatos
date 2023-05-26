const express = require('express');
const path = require('path');
const port = 3000;
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');


const bcrypt = require('bcrypt');

const unDia =1000 * 60  * 60 * 24

const app = express();
const session = require('express-session'); 


app.use(session({name:"nuevo",
                secret:"123456",
                saveUninitialized: false,
                cookie: { 
                           maxAge: unDia},
                resave:true}
              )
      );

app.use(cookieParser());


app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());


app.use(bodyParser.urlencoded({ extended: false }));
 




routes(app);

app.use((err,req,res,next)=>{
 
  console.log("errors: ", err);
  res.status(err.status).render(path.join(__dirname,'./views/error.ejs'),{err});
});
app.use(( err,req,res,next)=>{
  res.status(404).render(path.join(__dirname,'./views/error.ejs'),{err: {status:404, messages:[{msg:'page not found'}]}});
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
