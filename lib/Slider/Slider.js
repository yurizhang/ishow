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

require('../Common/css/Slider.css');

var _InputNumber = require('../Input-number/InputNumber');

var _InputNumber2 = _interopRequireDefault(_InputNumber);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //提供style, classname方法


var Slider = function (_Component) {
  _inherits(Slider, _Component);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

    _this.state = {
      firstValue: 0,
      secondValue: 0,
      oldValue: 0,
      precision: 0,
      inputValue: 0,
      dragging: false
    };
    return _this;
  }

  _createClass(Slider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        component: this
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          range = _props.range,
          value = _props.value,
          min = _props.min,
          max = _props.max,
          step = _props.step;
      var _state = this.state,
          firstValue = _state.firstValue,
          secondValue = _state.secondValue,
          oldValue = _state.oldValue,
          inputValue = _state.inputValue,
          precision = _state.precision;


      if (range) {
        if (Array.isArray(value)) {
          firstValue = Math.max(min, value[0]);
          secondValue = Math.min(max, value[1]);
        } else {
          firstValue = min;
          secondValue = max;
        }

        oldValue = [firstValue, secondValue];
      } else {
        if (typeof value !== 'number' || isNaN(value)) {
          firstValue = min;
        } else {
          firstValue = Math.min(max, Math.max(min, value));
        }

        oldValue = firstValue;
      }

      var precisions = [min, max, step].map(function (item) {
        var decimal = ('' + item).split('.')[1];
        return decimal ? decimal.length : 0;
      });

      precision = Math.max.apply(null, precisions);
      inputValue = inputValue || firstValue;

      this.setState({ firstValue: firstValue, secondValue: secondValue, oldValue: oldValue, inputValue: inputValue, precision: precision });
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(props, state) {
      if (props.min !== this.props.min || props.max !== this.props.max) {
        this.setValues();
      }

      if (props.value !== this.props.value) {
        var oldValue = this.state.oldValue;


        if (this.state.dragging || Array.isArray(this.props.value) && Array.isArray(props.value) && Array.isArray(oldValue) && this.props.value.every(function (item, index) {
          return item === oldValue[index];
        })) {
          return;
        } else if (!this.props.range && typeof props.value === 'number' && !isNaN(props.value)) {
          this.setState({
            firstValue: props.value
          });
        }

        this.setValues();
      }
    }
  }, {
    key: 'valueChanged',
    value: function valueChanged() {
      var range = this.props.range;
      var _state2 = this.state,
          firstValue = _state2.firstValue,
          oldValue = _state2.oldValue;


      if (range && Array.isArray(oldValue)) {
        return ![this.minValue(), this.maxValue()].every(function (item, index) {
          return item === oldValue[index];
        });
      } else {
        return firstValue !== oldValue;
      }
    }
  }, {
    key: 'setValues',
    value: function setValues() {
      var _props2 = this.props,
          range = _props2.range,
          value = _props2.value,
          min = _props2.min,
          max = _props2.max;
      var _state3 = this.state,
          firstValue = _state3.firstValue,
          secondValue = _state3.secondValue,
          oldValue = _state3.oldValue,
          inputValue = _state3.inputValue;


      if (range && Array.isArray(value)) {
        if (value[1] < min) {
          inputValue = [min, min];
        } else if (value[0] > max) {
          inputValue = [max, max];
        } else if (value[0] < min) {
          inputValue = [min, value[1]];
        } else if (value[1] > max) {
          inputValue = [value[0], max];
        } else {
          firstValue = value[0];
          secondValue = value[1];

          if (this.valueChanged()) {
            this.onValueChanged([this.minValue(), this.maxValue()]);

            oldValue = value.slice();
          }
        }
      } else if (!range && typeof value === 'number' && !isNaN(value)) {
        if (value < min) {
          inputValue = min;
        } else if (value > max) {
          inputValue = max;
        } else {
          inputValue = firstValue;

          if (this.valueChanged()) {
            this.onValueChanged(firstValue);

            oldValue = firstValue;
          }
        }
      }

      this.forceUpdate();
    }
  }, {
    key: 'setPosition',
    value: function setPosition(percent) {
      var _props3 = this.props,
          range = _props3.range,
          min = _props3.min,
          max = _props3.max;
      var _state4 = this.state,
          firstValue = _state4.firstValue,
          secondValue = _state4.secondValue;


      var targetValue = min + percent * (max - min) / 100;

      if (!range) {
        this.refs.button1.setPosition(percent);return;
      }

      var button = void 0;

      if (Math.abs(this.minValue() - targetValue) < Math.abs(this.maxValue() - targetValue)) {
        button = firstValue < secondValue ? 'button1' : 'button2';
      } else {
        button = firstValue > secondValue ? 'button1' : 'button2';
      }

      this.refs[button].setPosition(percent);
    }
  }, {
    key: 'onSliderClick',
    value: function onSliderClick(event) {
      if (this.props.disabled || this.state.dragging) return;

      if (this.props.vertical) {
        var sliderOffsetBottom = this.refs.slider.getBoundingClientRect().bottom;
        this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize() * 100);
      } else {
        var sliderOffsetLeft = this.refs.slider.getBoundingClientRect().left;
        this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize() * 100);
      }

      this.setValues();
    }

    /* Watched Methods */

  }, {
    key: 'onValueChanged',
    value: function onValueChanged(val) {
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }
  }, {
    key: 'onInputValueChanged',
    value: function onInputValueChanged(e) {
      var _this2 = this;

      this.setState({
        inputValue: e || 0,
        firstValue: e || 0
      }, function () {
        _this2.setValues();
      });
    }
  }, {
    key: 'onFirstValueChange',
    value: function onFirstValueChange(e) {
      if (this.state.firstValue !== e) {
        this.state.firstValue = e;
        this.forceUpdate();
        this.setValues();
      }
    }
  }, {
    key: 'onSecondValueChange',
    value: function onSecondValueChange(e) {
      if (this.state.secondValue !== e) {
        this.state.secondValue = e;
        this.forceUpdate();
        this.setValues();
      }
    }

    /* Computed Methods */

  }, {
    key: 'sliderSize',
    value: function sliderSize() {
      return parseInt(this.props.vertical ? this.refs.slider.offsetHeight : this.refs.slider.offsetWidth, 10);
    }
  }, {
    key: 'stops',
    value: function stops() {
      var _this3 = this;

      var _props4 = this.props,
          range = _props4.range,
          min = _props4.min,
          max = _props4.max,
          step = _props4.step;
      var firstValue = this.state.firstValue;


      var stopCount = (max - min) / step;
      var stepWidth = 100 * step / (max - min);
      var result = [];

      for (var i = 1; i < stopCount; i++) {
        result.push(i * stepWidth);
      }

      if (range) {
        return result.filter(function (step) {
          return step < 100 * (_this3.minValue() - min) / (max - min) || step > 100 * (_this3.maxValue() - min) / (max - min);
        });
      } else {
        return result.filter(function (step) {
          return step > 100 * (firstValue - min) / (max - min);
        });
      }
    }
  }, {
    key: 'minValue',
    value: function minValue() {
      return Math.min(this.state.firstValue, this.state.secondValue);
    }
  }, {
    key: 'maxValue',
    value: function maxValue() {
      return Math.max(this.state.firstValue, this.state.secondValue);
    }
  }, {
    key: 'runwayStyle',
    value: function runwayStyle() {
      return this.props.vertical ? { height: this.props.height } : {};
    }
  }, {
    key: 'barStyle',
    value: function barStyle() {
      return this.props.vertical ? {
        height: this.barSize(),
        bottom: this.barStart()
      } : {
        width: this.barSize(),
        left: this.barStart()
      };
    }
  }, {
    key: 'barSize',
    value: function barSize() {
      return this.props.range ? 100 * (this.maxValue() - this.minValue()) / (this.props.max - this.props.min) + '%' : 100 * (this.state.firstValue - this.props.min) / (this.props.max - this.props.min) + '%';
    }
  }, {
    key: 'barStart',
    value: function barStart() {
      return this.props.range ? 100 * (this.minValue() - this.props.min) / (this.props.max - this.props.min) + '%' : '0%';
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          vertical = _props5.vertical,
          showInput = _props5.showInput,
          showStops = _props5.showStops,
          showInputControls = _props5.showInputControls,
          range = _props5.range,
          step = _props5.step,
          disabled = _props5.disabled,
          min = _props5.min,
          max = _props5.max;
      var _state5 = this.state,
          inputValue = _state5.inputValue,
          firstValue = _state5.firstValue,
          secondValue = _state5.secondValue;


      return _react2.default.createElement(
        'div',
        { className: this.className('el-slider', {
            'is-vertical': vertical,
            'el-slider--with-input': showInput
          }) },
        showInput && !range && _react2.default.createElement(_InputNumber2.default, {
          ref: 'input',
          className: 'el-slider__input',
          defaultValue: inputValue,
          value: firstValue,
          step: step,
          disabled: disabled,
          controls: showInputControls,
          min: min,
          max: max,
          size: 'small',
          onChange: this.onInputValueChanged.bind(this)
        }),
        _react2.default.createElement(
          'div',
          { ref: 'slider', style: this.runwayStyle(), className: this.classNames('el-slider__runway', {
              'show-input': showInput,
              'disabled': disabled
            }), onClick: this.onSliderClick.bind(this) },
          _react2.default.createElement('div', {
            className: 'el-slider__bar',
            style: this.barStyle() }),
          _react2.default.createElement(_button2.default, { ref: 'button1', vertical: vertical, value: firstValue, onChange: this.onFirstValueChange.bind(this) }),
          range && _react2.default.createElement(_button2.default, { ref: 'button2', vertical: vertical, value: secondValue, onChange: this.onSecondValueChange.bind(this) }),
          showStops && this.stops().map(function (item, index) {
            return _react2.default.createElement('div', { key: index, className: 'el-slider__stop', style: vertical ? { 'bottom': item + '%' } : { 'left': item + '%' } });
          })
        )
      );
    }
  }]);

  return Slider;
}(_index2.default);

exports.default = Slider;


Slider.childContextTypes = {
  component: _propTypes2.default.any
};

Slider.propTypes = {
  min: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  max: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  step: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.arrayOf(_propTypes2.default.number)]),
  showInput: _propTypes2.default.bool,
  showInputControls: _propTypes2.default.bool,
  showTooltip: _propTypes2.default.bool,
  showStops: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  range: _propTypes2.default.bool,
  vertical: _propTypes2.default.bool,
  height: _propTypes2.default.string,
  formatTooltip: _propTypes2.default.func,
  onChange: _propTypes2.default.func
};

Slider.defaultProps = {
  showTooltip: true,
  showInputControls: true,
  min: 0,
  max: 100,
  step: 1,
  value: 0
};