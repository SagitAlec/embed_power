var express = require('express');
var router = express.Router();
var path = require('path');
const utils = require(__dirname + "/../service/utils.js");
const embedToken = require(__dirname + '/../service/embedConfigService.js');


/* GET default express page. */
router.get('/test', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.send(__dirname);
});


/* GET MS powerbi index page*/
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/index.html'));
});



router.get('/getEmbedToken', async function (req, res) {

  // Validate whether all the required configurations are provided in config.json
  configCheckResult = utils.validateConfig();
  if (configCheckResult) {
      return res.status(400).send({
          "error": configCheckResult
      });
  }
  // Get the details like Embed URL, Access token and Expiry
  let result = await embedToken.getEmbedInfo();

  // result.status specified the statusCode that will be sent along with the result object
  res.status(result.status).send(result);
});

module.exports = router;
