'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

var _TimeSpinner = require('../basic/TimeSpinner');

var _TimeSpinner2 = _interopRequireDefault(_TimeSpinner);

var _locale = require('../../Common/locale');

var _locale2 = _interopRequireDefault(_locale);

var _PopperBase2 = require('./PopperBase');

require('../../Common/css/Date-picker.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapPropsToState = function mapPropsToState(props) {
  var state = {
    format: props.format || 'HH:mm:ss',
    currentDate: props.currentDate || new Date()
  };
  state.isShowSeconds = (state.format || '').indexOf('ss') !== -1;
  return state;
};

var TimePanel = function (_PopperBase) {
  _inherits(TimePanel, _PopperBase);

  _createClass(TimePanel, null, [{
    key: 'propTypes',
    get: function get() {
      return Object.assign({}, {
        selectableRange: _TimeSpinner2.default.propTypes.selectableRange,
        onSelectRangeChange: _TimeSpinner2.default.propTypes.onSelectRangeChange
      }, {
        pickerWidth: _propTypes2.default.number,
        currentDate: _propTypes2.default.instanceOf(Date),
        /*
        onPicked: (value, isKeepPannelOpen)=>()
         @param value: Date|null
        @param isKeepPannelOpen:boolean, should parent close the pannel
        */
        onPicked: _propTypes2.default.func.isRequired,
        // cancel btn is clicked
        //()=>()
        onCancel: _propTypes2.default.func.isRequired
      }, _PopperBase2.PopperBase.propTypes);
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        popperMixinOption: {}
      };
    }
  }]);

  function TimePanel(props) {
    _classCallCheck(this, TimePanel);

    var _this = _possibleConstructorReturn(this, (TimePanel.__proto__ || Object.getPrototypeOf(TimePanel)).call(this, props));

    _this.state = mapPropsToState(props);
    return _this;
  }

  _createClass(TimePanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(mapPropsToState(nextProps));
    }

    // type: string,  one of [hours, minutes, seconds]
    // date: {type: number}

  }, {
    key: 'handleChange',
    value: function handleChange(date) {
      var currentDate = this.state.currentDate;


      if (date.hours !== undefined) {
        currentDate.setHours(date.hours);
      }

      if (date.minutes !== undefined) {
        currentDate.setMinutes(date.minutes);
      }

      if (date.seconds !== undefined) {
        currentDate.setSeconds(date.seconds);
      }
      this.setState({});
      this.handleConfirm(true);
    }
  }, {
    key: 'handleConfirm',
    value: function handleConfirm() {
      var isKeepPannelOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var currentDate = this.state.currentDate;
      var _props = this.props,
          onPicked = _props.onPicked,
          selectableRange = _props.selectableRange;


      var date = new Date((0, _utils.limitRange)(currentDate, selectableRange, 'HH:mm:ss'));
      onPicked(date, isKeepPannelOpen);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          isShowSeconds = _state.isShowSeconds,
          currentDate = _state.currentDate;
      var _props2 = this.props,
          onSelectRangeChange = _props2.onSelectRangeChange,
          selectableRange = _props2.selectableRange;


      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var seconds = currentDate.getSeconds();

      var $t = _locale2.default.t;

      return _react2.default.createElement(
        'div',
        {
          ref: 'root',
          className: 'ishow-time-panel' },
        _react2.default.createElement(
          'div',
          { className: this.classNames('ishow-time-panel__content', { 'has-seconds': isShowSeconds }) },
          _react2.default.createElement(_TimeSpinner2.default, {
            ref: 'spinner',
            onChange: this.handleChange.bind(this),
            isShowSeconds: isShowSeconds,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            selectableRange: selectableRange,
            onSelectRangeChange: onSelectRangeChange
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'ishow-time-panel__footer' },
          _react2.default.createElement(
            'button',
            {
              type: 'button',
              className: 'ishow-time-panel__btn cancel',
              onClick: function onClick() {
                return _this2.props.onCancel();
              } },
            $t('el.datepicker.cancel')
          ),
          _react2.default.createElement(
            'button',
            {
              type: 'button',
              className: 'ishow-time-panel__btn confirm',
              onClick: function onClick() {
                return _this2.handleConfirm();
              } },
            $t('el.datepicker.confirm')
          )
        )
      );
    }
  }]);

  return TimePanel;
}(_PopperBase2.PopperBase);

exports.default = TimePanel;