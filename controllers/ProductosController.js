const path = require('path');

const Productos = require('../models').productos;

const {body,validationResult}= require('express-validator');

const { parse } = require('querystring');



const addProducto = (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const err={}
      err.status = 422
      err.messages = errors.array()
      return next(err);
      // res.status(400).json({errors:errors.array()});
      }

    
    //const usr = req.body;
    return  Productos.findOne({
                            where: {
                                    titulo: req.body.titulo,
                                    }
                          })
    .then( Producto => {
                    if( Producto ) {
                      const err = {}
                      err.status = 404
                      err.messages = [ { msg: "Producto ya existe en la tabla" } ]
                      return next(err);

                    } else {
                            return Productos.create({
                                                  titulo: req.body.titulo,
                                                  desc_reducida:   req.body.desc_reducida,
                                                  comentario: req.body.comentario,
                                                  fec_emision: req.body.fec_emision,
                                                  path_imagen: req.body.path_imagen,
                                                  estado: 0
                                                }
                                              ).then( result=> {
                                                                res.redirect('/Productos');
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

const addProductoView = (req, res) => {
    res.render(path.join(__dirname, '../views/Productos/addProducto.ejs'));
   
 }

const productosView = (req, res,next) => {
  
   return  Productos.findAll()
    .then( Productos => {  
                  if( Productos ) {res.render(path.join(__dirname, '../views/Productos/Productos.ejs'), { Productos });}
                  else {
                         const err = {}
                        err.status = 404
                        err.messages = [ { msg: "No hay Productos " } ]
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
  
module.exports = {
    productosView,
    addProducto  ,
    addProductoView
  }