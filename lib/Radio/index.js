'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _RadioButton = require('./RadioButton');

var _RadioButton2 = _interopRequireDefault(_RadioButton);

var _RadioGroup = require('./RadioGroup');

var _RadioGroup2 = _interopRequireDefault(_RadioGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Radio2.default.Button = _RadioButton2.default;
_Radio2.default.Group = _RadioGroup2.default;

exports.default = _Radio2.default;