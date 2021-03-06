'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopperBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('../../Common/plugs/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../../Common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //提供style, classname方法


var PopperBase = exports.PopperBase = function (_Component) {
  _inherits(PopperBase, _Component);

  _createClass(PopperBase, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        //()=>HtmlElement
        getPopperRefElement: _propTypes2.default.func,
        popperMixinOption: _propTypes2.default.object
      };
    }
  }]);

  function PopperBase(props) {
    _classCallCheck(this, PopperBase);

    var _this = _possibleConstructorReturn(this, (PopperBase.__proto__ || Object.getPrototypeOf(PopperBase)).call(this, props));

    _utils.PopperReactMixin.call(_this, function () {
      return _this.refs.root;
    }, props.getPopperRefElement, Object.assign({
      boundariesPadding: 0,
      gpuAcceleration: false
    }, props.popperMixinOption));
    return _this;
  }

  return PopperBase;
}(_index2.default);