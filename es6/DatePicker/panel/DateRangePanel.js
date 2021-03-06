var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Locale from '../../Common/locale';
import Input from '../../Input/Input';
import TimePanel from './TimePanel';
import { MountBody } from '../MountBody';

import { SELECTION_MODES, toDate, prevMonth as _prevMonth, nextMonth as _nextMonth, formatDate, parseDate } from '../utils';
import { DateTable } from '../basic';
import { PopperBase } from './PopperBase';
import { PLACEMENT_MAP } from '../constants';
import '../../Common/css/Date-picker.css';

var _prevYear = function _prevYear(date) {
  var d = toDate(date);
  d.setFullYear(date.getFullYear() - 1);
  return d;
};

var _nextYear = function _nextYear(date) {
  var d = toDate(date);
  d.setFullYear(date.getFullYear() + 1);
  return d;
};

var mapPropsToState = function mapPropsToState(props) {
  var value = props.value;

  var state = {
    rangeState: {
      endDate: null,
      selecting: false
    }
  };
  if (!value) {
    state = Object.assign({}, state, {
      minDate: null,
      maxDate: null,
      date: new Date()
    });
  } else {
    if (value[0] && value[1]) {
      state.minDate = toDate(value[0]);
      state.maxDate = toDate(value[1]);
    }
    if (value[0]) {
      state.date = toDate(value[0]);
    } else {
      state.date = new Date();
    }
  }

  return state;
};

var DateRangePanel = function (_PopperBase) {
  _inherits(DateRangePanel, _PopperBase);

  _createClass(DateRangePanel, null, [{
    key: 'propTypes',
    get: function get() {
      return Object.assign({
        // user picked date value
        /*
        value: null | [Date, null | false]
        */
        value: PropTypes.any,
        // ([value1, value2]|null, isKeepPanel)=>()
        onPick: PropTypes.func.isRequired,
        isShowTime: PropTypes.bool,
        // Array[{text: String, onClick: (picker)=>()}]
        shortcuts: PropTypes.arrayOf(PropTypes.shape({
          text: PropTypes.string.isRequired,
          // ()=>()
          onClick: PropTypes.func.isRequired
        })),
        // (Date)=>bool, if true, disabled
        disabledDate: PropTypes.func,
        firstDayOfWeek: PropTypes.range(0, 6),
        //()=>HtmlElement
        getPopperRefElement: PropTypes.func,
        popperMixinOption: PropTypes.object
      }, PopperBase.propTypes);
    }
  }]);

  function DateRangePanel(props) {
    _classCallCheck(this, DateRangePanel);

    var _this = _possibleConstructorReturn(this, (DateRangePanel.__proto__ || Object.getPrototypeOf(DateRangePanel)).call(this, props));

    _this.state = Object.assign({
      minTimePickerVisible: false,
      maxTimePickerVisible: false,
      minPickerWidth: 0, // not used in code right now, due to some reason, for more details see comments in DatePannel that marked with todo.
      maxPickerWidth: 0
    }, mapPropsToState(props));
    return _this;
  }

  _createClass(DateRangePanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(mapPropsToState(nextProps));
    }
  }, {
    key: 'handleRangePick',
    value: function handleRangePick(_ref, isClose) {
      var minDate = _ref.minDate,
          maxDate = _ref.maxDate;
      var _props = this.props,
          isShowTime = _props.isShowTime,
          onPick = _props.onPick;

      this.setState({ minDate: minDate, maxDate: maxDate });
      if (!isClose) return;
      if (!isShowTime) {
        onPick([minDate, maxDate], false);
      }
    }
  }, {
    key: 'prevYear',
    value: function prevYear() {
      var date = this.state.date;

      this.setState({
        date: _prevYear(date)
      });
    }
  }, {
    key: 'nextYear',
    value: function nextYear() {
      var date = this.state.date;

      this.setState({
        date: _nextYear(date)
      });
    }
  }, {
    key: 'prevMonth',
    value: function prevMonth() {
      this.setState({
        date: _prevMonth(this.state.date)
      });
    }
  }, {
    key: 'nextMonth',
    value: function nextMonth() {
      this.setState({
        date: _nextMonth(this.state.date)
      });
    }
  }, {
    key: 'handleChangeRange',


    //todo: wired way to do sth like this? try to come up with a better option
    value: function handleChangeRange(_ref2) {
      var endDate = _ref2.endDate;
      var _state = this.state,
          rangeState = _state.rangeState,
          minDate = _state.minDate;

      if (endDate <= minDate) endDate = null;

      rangeState.endDate = endDate;
      this.setState({
        maxDate: endDate
      });
    }
  }, {
    key: 'handleShortcutClick',
    value: function handleShortcutClick(shortcut) {
      shortcut.onClick();
    }
  }, {
    key: 'setTime',
    value: function setTime(date, value) {
      var oldDate = new Date(date.getTime());
      var hour = value.getHours();
      var minute = value.getMinutes();
      var second = value.getSeconds();
      oldDate.setHours(hour);
      oldDate.setMinutes(minute);
      oldDate.setSeconds(second);
      return new Date(oldDate.getTime());
    }
  }, {
    key: 'handleMinTimePick',
    value: function handleMinTimePick(pickedDate, isKeepPanel) {
      var minDate = this.state.minDate || new Date();
      if (pickedDate) {
        minDate = this.setTime(minDate, pickedDate);
      }
      this.setState({ minDate: minDate, minTimePickerVisible: isKeepPanel, rangeState: { selecting: true } });
    }
  }, {
    key: 'handleMaxTimePick',
    value: function handleMaxTimePick(pickedDate, isKeepPanel) {
      var _state2 = this.state,
          minDate = _state2.minDate,
          maxDate = _state2.maxDate;

      if (!maxDate) {
        var now = new Date();
        if (now >= minDate) {
          maxDate = new Date();
        }
      }

      if (maxDate && pickedDate) {
        maxDate = this.setTime(maxDate, pickedDate);
      }
      this.setState({
        maxDate: maxDate,
        maxTimePickerVisible: isKeepPanel,
        rangeState: { selecting: false }
      });
    }
  }, {
    key: 'handleDateChange',
    value: function handleDateChange(value, type) {
      var parsedValue = parseDate(value, 'yyyy-MM-dd');
      var _state3 = this.state,
          minDate = _state3.minDate,
          maxDate = _state3.maxDate;

      if (parsedValue) {
        var target = new Date(type === 'min' ? minDate : maxDate);
        if (target) {
          target.setFullYear(parsedValue.getFullYear());
          target.setMonth(parsedValue.getMonth(), parsedValue.getDate());
        }
        if (type === 'min') {
          if (target < maxDate) {
            this.setState({ minDate: new Date(target.getTime()) });
          }
        } else {
          if (target > minDate) {
            maxDate = new Date(target.getTime());
            if (minDate && minDate > maxDate) {
              minDate = null;
            }
            this.setState({ minDate: minDate, maxDate: maxDate });
          }
        }
      }
    }
  }, {
    key: 'handleTimeChange',
    value: function handleTimeChange(value, type) {
      var parsedValue = parseDate(value, 'HH:mm:ss');
      if (parsedValue) {
        var target = new Date(type === 'min' ? this.minDate : this.maxDate);
        if (target) {
          target.setHours(parsedValue.getHours());
          target.setMinutes(parsedValue.getMinutes());
          target.setSeconds(parsedValue.getSeconds());
        }
        var _state4 = this.state,
            minDate = _state4.minDate,
            maxDate = _state4.maxDate;

        if (type === 'min') {
          if (target < maxDate) {
            minDate = new Date(target.getTime());
          }
        } else {
          if (target > minDate) {
            maxDate = new Date(target.getTime());
          }
        }
        this.setState(_defineProperty({
          minDate: minDate,
          maxDate: maxDate
        }, type + 'TimpickerVisisble', false));
      }
    }
  }, {
    key: 'handleClear',
    value: function handleClear() {
      var onPick = this.props.onPick;

      var minDate = null,
          maxDate = null,
          date = new Date();

      this.setState({ minDate: minDate, maxDate: maxDate, date: date });
      onPick([], false);
    }
  }, {
    key: 'handleConfirm',
    value: function handleConfirm() {
      var _state5 = this.state,
          minDate = _state5.minDate,
          maxDate = _state5.maxDate;

      this.props.onPick([minDate, maxDate], false);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          shortcuts = _props2.shortcuts,
          disabledDate = _props2.disabledDate,
          firstDayOfWeek = _props2.firstDayOfWeek,
          isShowTime = _props2.isShowTime;
      var _state6 = this.state,
          date = _state6.date,
          rangeState = _state6.rangeState,
          minDate = _state6.minDate,
          maxDate = _state6.maxDate,
          minTimePickerVisible = _state6.minTimePickerVisible,
          maxTimePickerVisible = _state6.maxTimePickerVisible,
          minPickerWidth = _state6.minPickerWidth,
          maxPickerWidth = _state6.maxPickerWidth;

      var rightDate = this.rightDate;

      var t = Locale.t;
      var leftLabel = date.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (date.getMonth() + 1));
      var rightLabel = rightDate.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (rightDate.getMonth() + 1));

      return React.createElement(
        'div',
        {
          ref: 'root',
          className: this.classNames('ishow-picker-panel ishow-date-range-picker', {
            'has-sidebar': shortcuts,
            'has-time': isShowTime
          })
        },
        React.createElement(
          'div',
          { className: 'ishow-picker-panel__body-wrapper' },
          Array.isArray(shortcuts) && React.createElement(
            'div',
            { className: 'ishow-picker-panel__sidebar' },
            shortcuts.map(function (e, idx) {
              return React.createElement(
                'button',
                {
                  key: idx,
                  type: 'button',
                  className: 'ishow-picker-panel__shortcut',
                  onClick: function onClick() {
                    return _this2.handleShortcutClick(e);
                  } },
                e.text
              );
            })
          ),
          React.createElement(
            'div',
            { className: 'ishow-picker-panel__body' },
            isShowTime && React.createElement(
              'div',
              { className: 'ishow-date-range-picker__time-header' },
              React.createElement(
                'span',
                { className: 'ishow-date-range-picker__editors-wrap' },
                React.createElement(
                  'span',
                  { className: 'ishow-date-range-picker__time-picker-wrap' },
                  React.createElement(Input, {
                    size: 'small',
                    ref: 'minInput',
                    placeholder: Locale.t('el.datepicker.startDate'),
                    className: 'ishow-date-range-picker__editor',
                    value: this.minVisibleDate,
                    onChange: function onChange(value) {
                      return _this2.handleDateChange(value, 'min');
                    }

                  })
                ),
                React.createElement(
                  'span',
                  { className: 'ishow-date-range-picker__time-picker-wrap' },
                  React.createElement(Input, {
                    size: 'small',
                    ref: 'timeIptStart',
                    placeholder: Locale.t('el.datepicker.startTime'),
                    className: 'ishow-date-range-picker__editor',
                    value: this.minVisibleTime,
                    onFocus: function onFocus() {
                      _this2.setState({
                        minTimePickerVisible: !minTimePickerVisible
                      });
                    },
                    onChange: function onChange(value) {
                      return _this2.handleTimeChange(value, 'min');
                    }
                  }),
                  minTimePickerVisible && React.createElement(
                    MountBody,
                    null,
                    React.createElement(TimePanel, {
                      pickerWidth: minPickerWidth,
                      ref: 'minTimePicker',
                      currentDate: minDate,
                      onPicked: this.handleMinTimePick.bind(this),
                      getPopperRefElement: function getPopperRefElement() {
                        return ReactDOM.findDOMNode(_this2.refs.timeIptStart);
                      },
                      popperMixinOption: {
                        placement: PLACEMENT_MAP[this.props.align] || PLACEMENT_MAP.left
                      },
                      onCancel: function onCancel() {
                        return _this2.setState({ minTimePickerVisible: false });
                      }
                    })
                  )
                )
              ),
              React.createElement('span', { className: 'ishow-icon-arrow-right' }),
              React.createElement(
                'span',
                { className: 'ishow-date-range-picker__editors-wrap is-right' },
                React.createElement(
                  'span',
                  { className: 'ishow-date-range-picker__time-picker-wrap' },
                  React.createElement(Input, {
                    size: 'small',
                    placeholder: Locale.t('el.datepicker.endDate'),
                    className: 'ishow-date-range-picker__editor',
                    value: this.maxVisibleDate,
                    readOnly: !minDate,
                    onChange: function onChange(value) {
                      return _this2.handleDateInput(value, 'max');
                    }
                  })
                ),
                React.createElement(
                  'span',
                  { className: 'ishow-date-range-picker__time-picker-wrap' },
                  React.createElement(Input, {
                    size: 'small',
                    ref: 'maxInput',
                    placeholder: Locale.t('el.datepicker.endTime'),
                    className: 'ishow-date-range-picker__editor',
                    value: this.maxVisibleTime,
                    onFocus: function onFocus() {
                      if (minDate) {
                        _this2.setState({
                          maxTimePickerVisible: !maxTimePickerVisible
                        });
                      }
                    },
                    readOnly: !minDate,
                    onChange: function onChange(value) {
                      return _this2.handleTimeChange(value, 'max');
                    }
                  }),
                  maxTimePickerVisible && React.createElement(
                    MountBody,
                    null,
                    React.createElement(TimePanel, {
                      pickerWidth: maxPickerWidth,
                      ref: 'maxTimePicker',
                      currentDate: maxDate,
                      onPicked: this.handleMaxTimePick.bind(this),
                      getPopperRefElement: function getPopperRefElement() {
                        return ReactDOM.findDOMNode(_this2.refs.maxInput);
                      },
                      popperMixinOption: {
                        placement: PLACEMENT_MAP[this.props.align] || PLACEMENT_MAP.left
                      },
                      onCancel: function onCancel() {
                        return _this2.setState({ maxTimePickerVisible: false });
                      }
                    })
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'ishow-picker-panel__content ishow-date-range-picker__content is-left' },
              React.createElement(
                'div',
                { className: 'ishow-date-range-picker__header' },
                React.createElement('button', {
                  type: 'button',
                  onClick: this.prevYear.bind(this),
                  className: 'ishow-picker-panel__icon-btn ishow-icon-d-arrow-left' }),
                React.createElement('button', {
                  type: 'button',
                  onClick: this.prevMonth.bind(this),
                  className: 'ishow-picker-panel__icon-btn ishow-icon-arrow-left' }),
                React.createElement(
                  'div',
                  null,
                  leftLabel
                )
              ),
              React.createElement(DateTable, {
                selectionMode: SELECTION_MODES.RANGE,
                date: date,
                value: minDate,
                minDate: minDate,
                maxDate: maxDate,
                rangeState: rangeState,
                disabledDate: disabledDate,
                onChangeRange: this.handleChangeRange.bind(this),
                onPick: this.handleRangePick.bind(this),
                firstDayOfWeek: firstDayOfWeek
              })
            ),
            React.createElement(
              'div',
              { className: 'ishow-picker-panel__content ishow-date-range-picker__content is-right' },
              React.createElement(
                'div',
                { className: 'ishow-date-range-picker__header' },
                React.createElement('button', {
                  type: 'button',
                  onClick: this.nextYear.bind(this),
                  className: 'ishow-picker-panel__icon-btn ishow-icon-d-arrow-right' }),
                React.createElement('button', {
                  type: 'button',
                  onClick: this.nextMonth.bind(this),
                  className: 'ishow-picker-panel__icon-btn ishow-icon-arrow-right' }),
                React.createElement(
                  'div',
                  null,
                  rightLabel
                )
              ),
              React.createElement(DateTable, {
                selectionMode: SELECTION_MODES.RANGE,
                date: rightDate,
                value: maxDate,
                minDate: minDate,
                maxDate: maxDate,
                rangeState: rangeState,
                disabledDate: disabledDate,
                onChangeRange: this.handleChangeRange.bind(this),
                onPick: this.handleRangePick.bind(this),
                firstDayOfWeek: firstDayOfWeek
              })
            )
          )
        ),
        isShowTime && React.createElement(
          'div',
          { className: 'ishow-picker-panel__footer' },
          React.createElement(
            'a',
            { href: 'javascript:;',
              className: 'ishow-picker-panel__link-btn',
              onClick: function onClick() {
                return _this2.handleClear();
              } },
            '\u6E05\u9664'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'ishow-picker-panel__btn',
              onClick: function onClick() {
                return _this2.handleConfirm();
              },
              disabled: this.btnDisabled },
            '\u786E\u5B9A'
          )
        )
      );
    }
  }, {
    key: 'rightDate',
    get: function get() {
      return _nextMonth(this.state.date);
    }
  }, {
    key: 'minVisibleDate',
    get: function get() {
      var minDate = this.state.minDate;

      return minDate ? formatDate(minDate) : '';
    }
  }, {
    key: 'maxVisibleDate',
    get: function get() {
      var _state7 = this.state,
          maxDate = _state7.maxDate,
          minDate = _state7.minDate;

      var d = maxDate || minDate;
      return d ? formatDate(d) : '';
    }
  }, {
    key: 'minVisibleTime',
    get: function get() {
      var minDate = this.state.minDate;

      return minDate ? formatDate(minDate, 'HH:mm:ss') : '';
    }
  }, {
    key: 'maxVisibleTime',
    get: function get() {
      var _state8 = this.state,
          maxDate = _state8.maxDate,
          minDate = _state8.minDate;

      var d = maxDate || minDate;
      return d ? formatDate(d, 'HH:mm:ss') : '';
    }
  }, {
    key: 'btnDisabled',
    get: function get() {
      var _state9 = this.state,
          minDate = _state9.minDate,
          maxDate = _state9.maxDate,
          selecting = _state9.rangeState.selecting;

      return !(minDate && maxDate && !selecting);
    }
  }]);

  return DateRangePanel;
}(PopperBase);

export default DateRangePanel;


DateRangePanel.defaultProps = {};