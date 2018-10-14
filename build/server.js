"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');

var port = 4555;
var app = (0, _express.default)();
app.use(_express.default.static('dist'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
app.listen(port, function () {
  console.log("Server listening on port ".concat(port));
});