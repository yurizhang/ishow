'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('../Common/css/Rate.css');

require('../Common/css/Icon.css');

var _index = require('../Common/plugs/index.js');

var _index2 = _interopRequireDefault(_index);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rate = function (_Component) {
  _inherits(Rate, _Component);

  function Rate(props) {
    _classCallCheck(this, Rate);

    var _this = _possibleConstructorReturn(this, (Rate.__proto__ || Object.getPrototypeOf(Rate)).call(this, props));

    _this.state = {
      pointerAtLeftHalf: false,
      currentValue: _this.props.value - 1,
      hoverIndex: -1,
      value: -1
    };
    var _this$props = _this.props,
        iconClasses = _this$props.iconClasses,
        voidIconClass = _this$props.voidIconClass,
        disabledVoidIconClass = _this$props.disabledVoidIconClass,
        colors = _this$props.colors,
        voidColor = _this$props.voidColor,
        disabledVoidColor = _this$props.disabledVoidColor;


    _this.classMap = {
      lowClass: iconClasses[0],
      mediumClass: iconClasses[1],
      highClass: iconClasses[2],
      voidClass: voidIconClass,
      disabledVoidClass: disabledVoidIconClass
    };

    _this.colorMap = {
      lowColor: colors[0],
      mediumColor: colors[1],
      highColor: colors[2],
      voidColor: voidColor,
      disabledVoidColor: disabledVoidColor
    };
    return _this;
  }

  _createClass(Rate, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value && nextProps.value !== this.props.value) {
        this.setState({
          value: nextProps.value
        });
      }
    }
  }, {
    key: 'hasClass',
    value: function hasClass(target, classname) {
      return target.classList.contains(classname);
    }
  }, {
    key: 'setCurrentValue',
    value: function setCurrentValue(e, value) {
      var _props = this.props,
          disabled = _props.disabled,
          allowHalf = _props.allowHalf;

      if (disabled) {
        return;
      }
      /* istanbul ignore if */
      if (allowHalf) {
        e.persist();
        var target = e.target;
        if (this.hasClass(target, 'ishow-rate__item')) {
          target = target.querySelector('.ishow-rate__icon');
        }
        if (this.hasClass(target, 'ishow-rate__decimal')) {
          target = target.parentNode;
        }
        this.setState({
          pointerAtLeftHalf: (e.clientX - target.getBoundingClientRect().left) * 2 <= target.clientWidth,
          currentValue: (e.clientX - target.getBoundingClientRect().left) * 2 <= target.clientWidth ? value - 0.5 : value
        });
      } else {
        this.setState({
          currentValue: value
        });
      }
      this.setState({
        hoverIndex: value
      });
    }
  }, {
    key: 'getValueFromMap',
    value: function getValueFromMap(value, map) {
      var _props2 = this.props,
          lowThreshold = _props2.lowThreshold,
          highThreshold = _props2.highThreshold;

      var result = '';
      if (value <= lowThreshold - 1) {
        result = map.lowColor || map.lowClass;
      } else if (value >= highThreshold - 1) {
        result = map.highColor || map.highClass;
      } else {
        result = map.mediumColor || map.mediumClass;
      }

      return result;
    }
  }, {
    key: 'getIconStyle',
    value: function getIconStyle(item) {
      var disabled = this.props.disabled;
      var currentValue = this.state.currentValue;

      var voidColor = disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
      return {
        color: item <= currentValue ? this.activeColor() : voidColor
      };
    }
  }, {
    key: 'showDecimalIcon',
    value: function showDecimalIcon(item) {
      var _props3 = this.props,
          disabled = _props3.disabled,
          allowHalf = _props3.allowHalf,
          value = _props3.value;
      var _state = this.state,
          pointerAtLeftHalf = _state.pointerAtLeftHalf,
          currentValue = _state.currentValue;

      var showWhenDisabled = disabled && this.valueDecimal() > 0 && item - 1 < value - 1 && item > value - 1;
      /* istanbul ignore next */
      var showWhenAllowHalf = allowHalf && pointerAtLeftHalf && (item - 0.5).toFixed(1) === currentValue.toFixed(1);
      return showWhenDisabled || showWhenAllowHalf;
    }
  }, {
    key: 'classes',
    value: function classes() {
      var currentValue = this.state.currentValue;
      var _props4 = this.props,
          allowHalf = _props4.allowHalf,
          max = _props4.max;

      var result = [];
      var i = 0;
      var threshold = currentValue;
      if (allowHalf && currentValue !== Math.floor(currentValue)) {
        threshold;
      }
      for (; i <= threshold; i++) {
        result.push(this.activeClass());
      }
      for (; i < max; i++) {
        result.push(this.voidClass());
      }
      return result;
    }
  }, {
    key: 'valueDecimal',
    value: function valueDecimal() {
      var value = this.props.value;

      return value * 100 - Math.floor(value) * 100;
    }
  }, {
    key: 'decimalIconClass',
    value: function decimalIconClass() {
      return this.getValueFromMap(this.props.value, this.classMap);
    }
  }, {
    key: 'voidClass',
    value: function voidClass() {
      return this.props.disabled ? this.classMap.disabledVoidClass : this.classMap.voidClass;
    }
  }, {
    key: 'activeClass',
    value: function activeClass() {
      return this.getValueFromMap(this.state.currentValue, this.classMap);
    }
  }, {
    key: 'activeColor',
    value: function activeColor() {
      return this.getValueFromMap(this.state.currentValue, this.colorMap);
    }
  }, {
    key: 'selectValue',
    value: function selectValue(value) {
      var _props5 = this.props,
          disabled = _props5.disabled,
          allowHalf = _props5.allowHalf,
          onChange = _props5.onChange;
      var _state2 = this.state,
          pointerAtLeftHalf = _state2.pointerAtLeftHalf,
          currentValue = _state2.currentValue;

      if (disabled) {
        return;
      }
      if (allowHalf && pointerAtLeftHalf) {
        // this.$emit('input', this.currentValue);
        this.setState({
          value: currentValue
        }, function () {
          onChange && onChange(currentValue + 1);
        });
      } else {
        this.setState({
          currentValue: value,
          value: value
        }, function () {
          onChange && onChange(value + 1);
        });
      }
    }
  }, {
    key: 'decimalStyle',
    value: function decimalStyle() {
      var _props6 = this.props,
          disabled = _props6.disabled,
          allowHalf = _props6.allowHalf;

      var width = '';
      if (disabled) {
        width = (this.valueDecimal() < 50 ? 0 : 50) + '%';
      }
      if (allowHalf) {
        width = '50%';
      }
      return {
        color: this.activeColor(),
        width: width
      };
    }
  }, {
    key: 'showText',
    value: function showText() {
      var _props7 = this.props,
          disabled = _props7.disabled,
          texts = _props7.texts,
          textTemplate = _props7.textTemplate,
          value = _props7.value;
      var currentValue = this.state.currentValue;

      var result = '';
      if (disabled) {
        result = textTemplate.replace(/\{\s*value\s*\}/, value);
      } else {
        result = texts[Math.ceil(currentValue)];
      }
      return result;
    }
  }, {
    key: 'resetCurrentValue',
    value: function resetCurrentValue() {
      var _props8 = this.props,
          disabled = _props8.disabled,
          allowHalf = _props8.allowHalf;
      var value = this.state.value;

      if (disabled) {
        return;
      }
      if (allowHalf) {
        this.setState({
          pointerAtLeftHalf: value !== Math.floor(value)
        });
      }
      this.setState({
        currentValue: value,
        hoverIndex: -1
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props9 = this.props,
          showText = _props9.showText,
          textColor = _props9.textColor,
          disabled = _props9.disabled,
          max = _props9.max;
      var hoverIndex = this.state.hoverIndex;

      return _react2.default.createElement(
        'div',
        { style: this.style(), className: this.className('ishow-rate') },
        [].concat(_toConsumableArray(Array(max))).map(function (v, k) {
          return _react2.default.createElement(
            'span',
            {
              className: 'ishow-rate__item',
              style: { cursor: disabled ? 'auto' : 'pointer' },
              onClick: function onClick() {
                return _this2.selectValue(k);
              },
              onMouseMove: function onMouseMove(e) {
                return _this2.setCurrentValue(e, k);
              },
              onMouseLeave: function onMouseLeave() {
                return _this2.resetCurrentValue();
              },
              key: k
            },
            _react2.default.createElement(
              'i',
              {
                style: _this2.getIconStyle(k),
                className: hoverIndex === k ? 'hover ishow-rate__icon ' + _this2.classes()[k] : 'ishow-rate__icon ' + _this2.classes()[k]
              },
              _this2.showDecimalIcon(k) ? _react2.default.createElement('i', {
                style: _this2.decimalStyle(),
                className: 'ishow-rate__decimal ' + _this2.decimalIconClass()
              }) : null
            )
          );
        }),
        showText ? _react2.default.createElement(
          'span',
          { className: 'ishow-rate__text', style: { color: textColor } },
          this.showText()
        ) : null
      );
    }
  }]);

  return Rate;
}(_index2.default);

exports.default = Rate;


Rate.propTypes = {
  colors: _propTypes2.default.array,
  texts: _propTypes2.default.array,
  showText: _propTypes2.default.bool,
  textColor: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  value: _propTypes2.default.number,
  onChange: _propTypes2.default.func,
  textTemplate: _propTypes2.default.string,
  lowThreshold: _propTypes2.default.number,
  highThreshold: _propTypes2.default.number,
  max: _propTypes2.default.number,
  voidColor: _propTypes2.default.string,
  disabledVoidColor: _propTypes2.default.string,
  iconClasses: _propTypes2.default.array,
  voidIconClass: _propTypes2.default.string,
  disabledVoidIconClass: _propTypes2.default.string,
  allowHalf: _propTypes2.default.bool
};

Rate.defaultProps = {
  colors: ['#F7BA2A', '#F7BA2A', '#F7BA2A'], // icon 的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色
  texts: ['极差', '失望', '一般', '满意', '惊喜'], // 辅助文字数组
  showText: false, // 是否显示辅助文字
  textColor: '#1F2D3D', //   辅助文字的颜色
  disabled: false, // 是否为只读
  value: 0, // 星级
  lowThreshold: 2, // 低分和中等分数的界限值，值本身被划分在低分中
  highThreshold: 4, // 高分和中等分数的界限值，值本身被划分在高分中
  max: 5,
  voidColor: '#C6D1DE',
  disabledVoidColor: '#EFF2F7',
  iconClasses: ['ishow-icon-star-on', 'ishow-icon-star-on', 'ishow-icon-star-on'],
  voidIconClass: 'ishow-icon-star-off',
  disabledVoidIconClass: 'ishow-icon-star-on',
  allowHalf: false,
  textTemplate: '{value}'
};