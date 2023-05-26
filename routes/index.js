const path = require('path');
const usersController = require('../controllers/UsersController');
const ProductosController= require('../controllers/ProductosController');
const {check}= require('express-validator');

module.exports = function(app) {

 
 
  app.get('/', (req, res) => {res.redirect('/index') }  )        

  // app.get('/', (req, res) => {
   
  //                  // res.render(path.join(__dirname, '../views/login.ejs'));
  //                  console.log('inicio ' + req.session.user)
  //                  console.log(req.session)
  //                  if (req.session.user){
  //                   console.log('verdadero')
  //                   res.redirect('/index')
  //                  }
  //                  else
  //                  {
  //                    console.log('false')
  //                    res.redirect('/login1');
  //                  }
  //       } 
  // )        
  
  app.get('/index',(req,res) =>{ 
          //   if (req.session.user){
          //     console.log(req.session)
          //       console.log('tiene  informacion ' +req.session.user )
                res.render(path.join(__dirname, '../views/index.ejs'))
          //     }
          //     else
          //     {
          //       console.log('NO TIENE informacion ')
          //       res.redirect('/login1');
          //     }
            }                
                
                )
  app.get('/login1',(req,res) => res.render(path.join(__dirname, '../views/login.ejs')))
  app.post('/login',[
                    check('email').isEmail()
                      .withMessage('Formato de correo es incorrecto'),
                    check('password')
                      .isLength({min:1})
                      .withMessage('Longitud Minima debe ser de 1  caracteres'),
                    ], usersController.login)  ;

  
 
  app.get('/users', usersController.usersView);

  app.get('/user/:id', usersController.userView)

  

  app.get('/addUserView', usersController.addUserView)

  app.post('/addUser', [
                        check('nombyApell').replace(" ","")
                          .isLength({min:4})
                          .withMessage('Longitud Minima debe ser 4 caracteres'),
                        check('fecnac').isDate()
                           .withMessage('Fecha incorrecta')
                        ,
                        check('email').isEmail()
                          .withMessage('Formato de correo es incorrecto')
                        ], usersController.addUser)

  app.get('/deleteUser/:id', usersController.deleteUser)
  app.post('/editUserView/editUser', usersController.editUser)
  app.get('/editUserView/:id', usersController.editUserView)
  app.get('/logout', usersController.logout)

 
  app.post('/addProducto', [
    check('titulo').isLength({min:4})
      .withMessage('Longitud Minima debe ser 4 caracteres'),
    check('fec_emision').isDate()
       .withMessage('Fecha incorrecta')
    ,
    check('path_imagen').isLength({min:4})
      .withMessage('Debe informar el nombre de la imagen')
    ], ProductosController.addProducto)   

  app.get('/Productos', ProductosController.productosView)
  app.get('/addProductoView', ProductosController.addProductoView)
  }