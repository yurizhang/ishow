'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('../Common/plugs/index.js');

var _index2 = _interopRequireDefault(_index);

require('../Common/css/Form.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //提供style, classname方法


var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.state = {
      fields: []
    };
    return _this;
  }

  _createClass(Form, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        component: this
      };
    }
  }, {
    key: 'addField',
    value: function addField(field) {
      this.state.fields.push(field);
    }
  }, {
    key: 'removeField',
    value: function removeField(field) {
      if (field.props.prop) {
        this.state.fields.splice(this.state.fields.indexOf(field), 1);
      }
    }
  }, {
    key: 'resetFields',
    value: function resetFields() {
      this.state.fields.forEach(function (field) {
        field.resetField();
      });
    }
  }, {
    key: 'validate',
    value: function validate(callback) {
      var _this2 = this;

      var valid = true;
      var count = 0;

      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.state.fields.length === 0 && callback) {
        callback(true);
      }

      this.state.fields.forEach(function (field) {
        field.validate('', function (errors) {
          if (errors) {
            valid = false;
          }
          if (typeof callback === 'function' && ++count === _this2.state.fields.length) {
            callback(valid);
          }
        });
      });
    }
  }, {
    key: 'validateField',
    value: function validateField(prop, cb) {
      var field = this.state.fields.filter(function (field) {
        return field.props.prop === prop;
      })[0];

      if (!field) {
        throw new Error('must call validateField with valid prop string!');
      }

      field.validate('', cb);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'form',
        { style: this.style(), className: this.className('ishow-form', this.props.labelPosition && 'ishow-form--labishow-' + this.props.labelPosition, {
            'ishow-form--inline': this.props.inline
          }), onSubmit: this.props.onSubmit },
        this.props.children
      );
    }
  }]);

  return Form;
}(_index2.default);

exports.default = Form;


Form.childContextTypes = {
  component: _propTypes2.default.any
};

Form.propTypes = {
  model: _propTypes2.default.object,
  rules: _propTypes2.default.object,
  labelPosition: _propTypes2.default.oneOf(['right', 'left', 'top']),
  labelWidth: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  labelSuffix: _propTypes2.default.string,
  inline: _propTypes2.default.bool,
  onSubmit: _propTypes2.default.func
};

Form.defaultProps = {
  labelPosition: 'right',
  labelSuffix: ''
};