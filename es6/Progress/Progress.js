var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { default as Component } from '../Common/plugs/index.js'; //提供style, classname方法
import '../Common/css/Progress.css';
// type PathStyle = {
//   strokeDasharray: string,
//   strokeDashoffset: string,
//   transition: string
// };

var Progress = function (_Component) {
  _inherits(Progress, _Component);

  function Progress() {
    _classCallCheck(this, Progress);

    return _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).apply(this, arguments));
  }

  _createClass(Progress, [{
    key: 'relativeStrokeWidth',
    value: function relativeStrokeWidth() {
      var _props = this.props,
          strokeWidth = _props.strokeWidth,
          width = _props.width;

      return (strokeWidth / width * 100).toFixed(1);
    }
  }, {
    key: 'trackPath',
    value: function trackPath() {
      var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth()) / 2, 10);
      return 'M 50 50 m 0 -' + radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 ' + radius * 2 + ' a ' + radius + ' ' + radius + ' 0 1 1 0 -' + radius * 2;
    }
  }, {
    key: 'perimeter',
    value: function perimeter() {
      var radius = 50 - parseFloat(this.relativeStrokeWidth()) / 2;
      return 2 * Math.PI * radius;
    }
  }, {
    key: 'circlePathStyle',
    value: function circlePathStyle() {
      var perimeter = this.perimeter();
      return {
        strokeDasharray: perimeter + 'px,' + perimeter + 'px',
        strokeDashoffset: (1 - this.props.percentage / 100) * perimeter + 'px',
        transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      };
    }
  }, {
    key: 'stroke',
    value: function stroke() {
      var ret = void 0;
      switch (this.props.status) {
        case 'success':
          ret = '#13ce66';
          break;
        case 'exception':
          ret = '#ff4949';
          break;
        default:
          ret = '#20a0ff';
      }
      return ret;
    }
  }, {
    key: 'iconClass',
    value: function iconClass() {
      var _props2 = this.props,
          type = _props2.type,
          status = _props2.status;

      return type === 'line' ? status === 'success' ? 'ishow-icon-circle-check' : 'ishow-icon-circle-cross' : status === 'success' ? 'ishow-icon-check' : 'ishow-icon-close';
    }
  }, {
    key: 'progressTextSize',
    value: function progressTextSize() {
      var _props3 = this.props,
          type = _props3.type,
          strokeWidth = _props3.strokeWidth,
          width = _props3.width;

      return type === 'line' ? 12 + strokeWidth * 0.4 : width * 0.111111 + 2;
    }
  }, {
    key: 'render',
    value: function render() {
      var _className;

      var _props4 = this.props,
          type = _props4.type,
          percentage = _props4.percentage,
          status = _props4.status,
          strokeWidth = _props4.strokeWidth,
          textInside = _props4.textInside,
          width = _props4.width,
          showText = _props4.showText;

      var progress = void 0;
      if (type === 'line') {
        progress = React.createElement(
          'div',
          { className: 'ishow-progress-bar' },
          React.createElement(
            'div',
            {
              className: 'ishow-progress-bar__outer',
              style: { height: strokeWidth + 'px' }
            },
            React.createElement(
              'div',
              {
                className: 'ishow-progress-bar__inner',
                style: { width: percentage + '%' }
              },
              showText && textInside && React.createElement(
                'div',
                { className: 'ishow-progress-bar__innerText' },
                percentage + '%'
              )
            )
          )
        );
      } else {
        progress = React.createElement(
          'div',
          {
            className: 'ishow-progress-circle',
            style: { height: width + 'px', width: width + 'px' }
          },
          React.createElement(
            'svg',
            { viewBox: '0 0 100 100' },
            React.createElement('path', {
              className: 'ishow-progress-circle__track',
              d: this.trackPath(),
              stroke: '#e5e9f2',
              strokeWidth: this.relativeStrokeWidth(),
              fill: 'none'
            }),
            React.createElement('path', {
              className: 'ishow-progress-circle__path',
              d: this.trackPath(),
              strokeLinecap: 'round',
              stroke: this.stroke(),
              strokeWidth: this.relativeStrokeWidth(),
              fill: 'none',
              style: this.circlePathStyle()
            })
          )
        );
      }
      var progressInfo = showText && !textInside && React.createElement(
        'div',
        {
          className: 'ishow-progress__text',
          style: { fontSize: this.progressTextSize() + 'px' }
        },
        status ? React.createElement('i', { className: this.iconClass() }) : percentage + '%'
      );

      return React.createElement(
        'div',
        {
          style: this.style(),
          className: this.className('ishow-progress', 'ishow-progress--' + type, (_className = {}, _defineProperty(_className, 'is-' + status, !!status), _defineProperty(_className, 'ishow-progress--without-text', !showText), _defineProperty(_className, 'ishow-progress--text-inside', textInside), _className))
        },
        progress,
        progressInfo
      );
    }
  }]);

  return Progress;
}(Component);

Progress.defaultProps = {
  type: 'line',
  percentage: 0,
  strokeWidth: 6,
  width: 126,
  showText: true,
  textInside: false
};
export default Progress;


Progress.propTypes = {
  type: PropTypes.oneOf(['line', 'circle']),
  percentage: PropTypes.number,
  status: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  textInside: PropTypes.bool,
  showText: PropTypes.bool
};