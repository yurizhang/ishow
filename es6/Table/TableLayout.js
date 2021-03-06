var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as React from 'react';
import throttle from 'throttle-debounce/throttle';
import PropTypes from 'prop-types';
import { default as Component } from '../Common/plugs/index.js'; //提供style, classname方法
import { addResizeListener, removeResizeListener } from '../Common/utils/resize-event';

import Table from './Table';

import { getScrollBarWidth, getValueByPath } from "./utils";

var TableLayout = function (_Component) {
  _inherits(TableLayout, _Component);

  function TableLayout(props) {
    _classCallCheck(this, TableLayout);

    var _this = _possibleConstructorReturn(this, (TableLayout.__proto__ || Object.getPrototypeOf(TableLayout)).call(this, props));

    _this.state = {
      height: props.height || props.maxHeight || null, // Table's height or maxHeight prop
      gutterWidth: getScrollBarWidth(), // scrollBar width
      tableHeight: null, // Table's real height
      headerHeight: null, // header's height of Table
      bodyHeight: null, // body's height of Table
      footerHeight: null, // footer's height of Table
      fixedBodyHeight: null, // fixed body's height of Table
      viewportHeight: null, // Table's real height without y scroll bar height
      scrollX: null, // has x scroll bar
      scrollY: null // has y scroll bar
    };

    _this.resizeListener = throttle(50, function () {
      _this.scheduleLayout();
    });
    return _this;
  }

  _createClass(TableLayout, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.el = this.table.el;

      this.scheduleLayout();
      addResizeListener(this.el, this.resizeListener);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var preHeight = this.props.height || this.props.maxHeight;
      var nextHeight = nextProps.height || nextProps.maxHeight;
      if (preHeight !== nextHeight) {
        this.setState({
          height: nextHeight
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(preProps) {
      var _this2 = this;

      if (this.isPropChanged('columns', preProps) || this.isPropChanged('style', preProps) || this.isPropChanged('className', preProps)) {
        this.scheduleLayout();
        return;
      }

      var shouldUpdateHeight = ['height', 'maxHeight', 'data', 'store.expandingRows', 'expandRowKeys', 'showSummary', 'summaryMethod', 'sumText'].some(function (key) {
        return _this2.isPropChanged(key, preProps);
      });
      if (shouldUpdateHeight) {
        this.updateHeight();
        this.updateScrollY();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      removeResizeListener(this.el, this.resizeListener);
    }
  }, {
    key: 'isPropChanged',
    value: function isPropChanged(key, preProps) {
      var prop = getValueByPath(this.props, key);
      var preProp = getValueByPath(preProps, key);
      return prop !== preProp;
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        layout: this
      };
    }
  }, {
    key: 'scheduleLayout',
    value: function scheduleLayout() {
      var _this3 = this;

      this.setState(this.caculateWidth(), function () {
        _this3.updateHeight();
        _this3.updateScrollY();
      });
    }

    // horizontal direction layout

  }, {
    key: 'caculateWidth',
    value: function caculateWidth() {
      var _props = this.props,
          _props$store = _props.store,
          columns = _props$store.columns,
          fixedColumns = _props$store.fixedColumns,
          rightFixedColumns = _props$store.rightFixedColumns,
          fit = _props.fit;
      var gutterWidth = this.state.gutterWidth;

      var bodyMinWidth = columns.reduce(function (pre, col) {
        return pre + (col.width || col.minWidth);
      }, 0);

      var bodyWidth = this.table.el.clientWidth;
      var scrollX = void 0;
      var fixedWidth = void 0;
      var rightFixedWidth = void 0;

      // mutate props (TableStore's state[columns])
      var flexColumns = columns.filter(function (column) {
        return typeof column.width !== 'number';
      });
      if (flexColumns.length && fit) {
        if (bodyMinWidth < bodyWidth - gutterWidth) {
          // no scroll bar
          scrollX = false;

          var totalFlexWidth = bodyWidth - gutterWidth - bodyMinWidth;
          if (flexColumns.length === 1) {
            flexColumns[0].realWidth = flexColumns[0].minWidth + totalFlexWidth;
          } else {
            var allColumnsWidth = flexColumns.reduce(function (pre, col) {
              return pre + col.minWidth;
            }, 0);
            var flexWidthPerPixel = totalFlexWidth / allColumnsWidth;

            var widthWithoutFirst = 0;

            flexColumns.forEach(function (column, index) {
              if (index === 0) return;
              var flexWidth = Math.floor(column.minWidth * flexWidthPerPixel);
              widthWithoutFirst += flexWidth;
              column.realWidth = column.minWidth + flexWidth;
            });

            flexColumns[0].realWidth = flexColumns[0].minWidth + totalFlexWidth - widthWithoutFirst;
          }
        } else {
          // have horizontal scroll bar
          scrollX = true;
          flexColumns.forEach(function (column) {
            column.realWidth = column.minWidth;
          });
        }

        bodyWidth = Math.max(bodyMinWidth, bodyWidth);
      } else {
        scrollX = bodyMinWidth > bodyWidth;
        bodyWidth = bodyMinWidth;
      }

      if (fixedColumns.length) {
        fixedWidth = fixedColumns.reduce(function (pre, col) {
          return pre + col.realWidth;
        }, 0);
      }

      if (rightFixedColumns.length) {
        rightFixedWidth = rightFixedColumns.reduce(function (pre, col) {
          return pre + col.realWidth;
        }, 0);
      }

      return {
        scrollX: scrollX,
        bodyWidth: bodyWidth,
        fixedWidth: fixedWidth,
        rightFixedWidth: rightFixedWidth
      };
    }

    // vertical direction layout

  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var _this4 = this;

      this.setState(function (state) {
        var data = _this4.props.data;
        var scrollX = state.scrollX,
            gutterWidth = state.gutterWidth;


        var noData = !data || !data.length;
        var _table = _this4.table,
            headerWrapper = _table.headerWrapper,
            footerWrapper = _table.footerWrapper;


        var tableHeight = _this4.el.clientHeight;
        var headerHeight = headerWrapper ? headerWrapper.offsetHeight : 0;
        var footerHeight = footerWrapper ? footerWrapper.offsetHeight : 0;
        var bodyHeight = tableHeight - headerHeight - footerHeight + (footerWrapper ? 1 : 0);
        var fixedBodyHeight = bodyHeight - (scrollX ? gutterWidth : 0);
        var viewportHeight = tableHeight - (scrollX && !noData ? gutterWidth : 0);

        return {
          tableHeight: tableHeight,
          headerHeight: headerHeight,
          bodyHeight: bodyHeight,
          footerHeight: footerHeight,
          fixedBodyHeight: fixedBodyHeight,
          viewportHeight: viewportHeight // no useful
        };
      });
    }

    // judge if has scroll-Y bar

  }, {
    key: 'updateScrollY',
    value: function updateScrollY() {
      var _this5 = this;

      this.setState(function (state) {
        var bodyWrapper = _this5.table.bodyWrapper;
        var fixedBodyHeight = state.fixedBodyHeight;


        var body = bodyWrapper.querySelector('.ishow-table__body');
        var scrollY = body.offsetHeight > fixedBodyHeight;

        return {
          scrollY: scrollY
        };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      return React.createElement(Table, Object.assign({
        ref: function ref(table) {
          _this6.table = table;
        }
      }, this.props, {
        layout: this.state
      }));
    }
  }]);

  return TableLayout;
}(Component);

TableLayout.childContextTypes = {
  layout: PropTypes.any
};
export default TableLayout;