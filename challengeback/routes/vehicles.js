var express = require('express');
var router = express.Router();
const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
const vehicle = require('../models/vehicle.js');
var models = initModels(sequelize); 

//Obtener lista de vehiculos
router.get('/', function(req, res, next) {
    models.vehicle.findAll({ 
        attributes: { exclude: ["creation_date"] }
      })
      .then(vehicle => {
         res.send(vehicle)
      })
      .catch(error => res.status(400).send(error))
})

//Obtener lista de vehiculos por conductor
router.get('/driver/:id',function(req,res,next){
    console.log(req.body)
    var offset = (req.body.page-1)*req.body.limits
    console.log(offset) 
    models.vehicle.findAll({ 
        attributes: { exclude: ["creation_date"] },
        where: {
            driver_id:req.params.id
        },
        order:["id"],
        offset:offset,
        limit:req.body.limits
      })
      .then(vehicle => {
         res.send(vehicle)
      })
      .catch(error => res.status(400).send(error))
})

//Creacion vehiculos
router.post('/crevehicle',function(req,res,next){
    console.log(req.body);
    //console.log(new Date().toISOString().split("T")[0])
    models.vehicle.create({
        driver_id: req.body.driver_id,
        plate: req.body.plate,
        model: req.body.model,
        type: req.body.type,
        capacity: req.body.capacity,
        creation_date: new Date().toISOString().split("T")[0]
    },{ fields: ['driver_id','plate','model','type','capacity','creation_date'] })
    .then(vehicle => {
        res.send("ok")
    })
    .catch(error => res.status(400).send(error))
})

//Editar vehiculos
router.post('/updvehicle/:id',function(req,res,next){
    console.log(req.body);
    models.vehicle.update({
        driver_id: req.body.driver_id,
        plate: req.body.plate,
        model: req.body.model,
        type: req.body.type,
        capacity: req.body.capacity,
    },
    {where: {id:req.params.id}})
    .then(vehicle => {
        res.send("ok")
    })
    .catch(error => res.status(400).send(error))
})

//Eliminar vehiculos
router.delete('/delvehicle/:id',function(req,res,next){
    models.vehicle.destroy({
        where: {
            id:req.params.id
        }
    }).then(vehicle => {
        res.send("ok")
     })
     .catch(error => res.status(400).send(error))
})

module.exports = router;