const path = require('path');

const Users = require('../models').usuarios;

const {body,validationResult}= require('express-validator');

const { parse } = require('querystring');
const  hash = require('../services/hashBcrypt')
// const {hashPassword,comparePassword}= require('../services/hashBcrypt')

//! ATENCION!! Notar que estamos importando User de el UserModel.js pero no estamos usandolo
//! en las proximas clases seguirems trbajando con el modelo User

 

const usersView = (req, res,next) => {
  
  //const users = serviceUser.getUsers();  
   
  //console.log(wUsers)
 // res.render(path.join(__dirname, '../views/users/users.ejs'), { Users }); 
 return  Users.findAll()
  .then( Users => {  
                if( Users ) {res.render(path.join(__dirname, '../views/users/users.ejs'), { Users });}
                else {
                       const err = {}
                      err.status = 404
                      err.messages = [ { msg: "No hay usuarios" } ]
                      return next(err);
                    }
                })
  .catch( error => {
  // console.log(error);
                      const err = {}
                      err.status = 404
                      err.messages = [ { msg: error } ]
                      return next(err);
                    })
}

 

/* 
const userView = (req, res) => {
  const users = serviceUser.getUsers(); 
  const user = users.find(user => user.id == req.params.id);
  res.render(path.join(__dirname, '../views/users/user.ejs'), { user });
} */
const userView = (req, res, next) => {
  // console.log("hola");
  return  Users.findOne({
      where: {
        id: req.params.id
      }
    })
    .then( user => {
      if( user ) {
        res.render(path.join(__dirname, '../views/users/user.ejs'), { user })

      } else {
        const err = {}
        err.status = 404
        err.messages = [ { msg: "Usuario no encontrado" } ]
        return next(err);
      }
    })
    .catch( error => {
      // console.log(error);
      const err = {}
      err.status = 404
      err.messages = [ { msg: error } ]
      return next(err);
    })
}


const addUserView = (req, res) => {
   res.render(path.join(__dirname, '../views/users/addUser.ejs'));
  
}



const addUser = (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const err={}
      err.status = 422
      err.messages = errors.array()
  
      return next(err);
      // res.status(400).json({errors:errors.array()});
      }

    
    //const usr = req.body;
    return  Users.findOne({
                            where: {
                                    email: req.body.email,
                                    }
                          })
    .then( user => {
                    if( user ) {
                      const err = {}
                      err.status = 404
                      err.messages = [ { msg: "Usuario ya existe en la tabla" } ]
                      return next(err);

                    } else {
                            return Users.create({
                                                  nombyApell: req.body.nombyApell,
                                                  fecnac: req.body.fecnac,
                                                  email: req.body.email,
                                                  password:  hash.hashPassword(req.body.password),
                                                  celular: req.body.celular,
                                                  estado: 0
                                                }
                                              ).then( result=> {
                                                                res.redirect('/users');
                                                               }
                                                                )
                                               .catch( error => {
          // console.log(error);
                                                                  const err = {}
                                                                  err.status = 404
                                                                  err.messages = [ { msg: error } ]
                                                                  return next(err);
                                                                }
                                                      )
                            }
                          }
    )
          .catch( error => {
                            const err = {}
                            err.status = 404
                            err.messages = [ { msg: error } ]
                            return next(err);
                            }
                )
}

const deleteUser= async (req, res,next) => {
  
  try{
     
    await Users.destroy({where : {id: req.params.id}});
    
    res.send('usuario Borrado');
    res.status(200).json({id:  req.params.id});
  }
  catch{ error => {
    // console.log(error);
                const err = {}
                err.status = 404
                err.messages = [ { msg: error } ]
                return next(err);
             }

  }

    }

     
const editUserView = (req, res,next) => {
    
    return  Users.findOne({where: {id: req.params.id,}})
    .then( user => {
            if( user ) {
               
              res.render(path.join(__dirname, '../views/users/editUser.ejs'), { user });
              } else {
                      const err = {}
                      err.status = 404
                      err.messages = [ { msg: "Usuario NO existe en la tabla" } ]
                      return next(err);
              }
          })
.catch( error => {
  const err = {}
  err.status = 404
  err.messages = [ { msg: error } ]
  return next(err);
}
) 



}


const editUser = (req, res,next) => {
  
  
  return  Users.findOne({
                          where: {
                                  id: req.body.id,
                                  }
                        })
                        
  .then( user => {
                  if(user) {
                             
                             return user.update({
                                                  nombyApell: req.body.nombyApell,
                                                  fecnac: req.body.fecnac,
                                                  email: req.body.email,
                                                  password:  hash.hashPassword(req.body.password),
                                                  estado:0
                                                 }
                                                 
                             ).then( result=> {res.redirect('/users');
                                                           }
                                    )
                            .catch( error => {
                                const err = {}
                                err.status = 404
                                err.messages = [ { msg: error } ]
                                return next(err);
                              }
                    )
                             
                }})
        .catch( error => {
    // console.log(error);
                          const err = {}
                          err.status = 404
                          err.messages = [ { msg: error } ]
                          return next(err);
                          }
              )

}

 
const login = (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        const err={}
        err.status = 422
        err.messages = errors.array();

        return next(err);
  
    }

 
    return  Users.findOne({
                            where: {
                                    email: req.body.email,
                                    }
                          })
    .then( user => {
                if( user ) 
                {
                  if(hash.comparePassword(req.body.password,user.password  ))
                  {
                   
                   req.session.user = req.body.email; 
                   req.session.admin = true;
                  
                   res.redirect('/index')
                  }
                  else
                  {
                   console.log("ERROR, la contraseña informada no es correcta")
                   
                   const err={}
                   err.status = 422
                   err.messages = [{ values: '',  msg:'ERROR, la contraseña informada no es correcta',param:'',location:'' }]
                   return next(err);
                  }
             
                }
                else
                {
                  console.log("ERROR, usuario no encontrado")
      
                  const err={}
                  err.status = 404
                  err.messages = [{ values: '',  msg:'ERROR, Usuario no encontrado',param:'',location:'' }]
                  return next(err);
            
                }
                }
)
.catch( error => {
// console.log(error);
    const err = {}
    err.status = 404
    err.messages = [ { msg: error } ]
    return next(err);
    }
)

  
  
  
  
}











const logout = (req, res) => {

  req.session.destroy(); //borro la session del lado del servidor.
  //res.cookie('nuevo', 'value', {masAge : 9999});
  res.clearCookie('nuevo'); //borrola cookie del usuario
  res.redirect('/'); 
};

module.exports = {
  usersView,
  userView,
  addUserView,
  addUser,
  deleteUser,
  editUser,
  editUserView,
  
  login,
  logout
  
}


