var express = require('express');
var router = express.Router();
const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize); 

router.get('/', function(req, res, next) {
    models.driver.findAll({ 
        attributes: { exclude: ["creation_date"] }
      })
      .then(driver => {
         res.send(driver)
      })
      .catch(error => res.status(400).send(error))
})

module.exports = router;