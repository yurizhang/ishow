'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('../Common/plugs/index.js');

var _index2 = _interopRequireDefault(_index);

var _transition = require('../Message/transition');

var _transition2 = _interopRequireDefault(_transition);

var _style = require('../Common/style');

var _style2 = _interopRequireDefault(_style);

var _reactClickOutside = require('react-click-outside');

var _reactClickOutside2 = _interopRequireDefault(_reactClickOutside);

var _resizeEvent = require('../Common/resize-event');

var _popper = require('../Common/popper');

var _popper2 = _interopRequireDefault(_popper);

var _Input = require('../Input/Input');

var _Input2 = _interopRequireDefault(_Input);

var _debounce = require('throttle-debounce/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _Scrollbar = require('../Scrollbar');

var _Tag = require('../Tag/Tag');

var _Tag2 = _interopRequireDefault(_Tag);

require('../Common/css/Select.css');

require('../Common/css/Select-dropdown.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //提供style, classname方法


_style2.default.reset('\n  .ishow-select-dropdown {\n    position: absolute !important;\n  }\n');

var sizeMap = {
  'large': 42,
  'small': 30,
  'mini': 22
};

var Select = function (_Component) {
  _inherits(Select, _Component);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _this.state = {
      options: [],
      isSelect: true,
      inputLength: 20,
      inputWidth: 0,
      inputHovering: false,
      filteredOptionsCount: 0,
      optionsCount: 0,
      hoverIndex: -1,
      bottomOverflowBeforeHidden: 0,
      cachedPlaceHolder: props.placeholder || '请选择',
      currentPlaceholder: props.placeholder || '请选择',
      selectedLabel: '',
      selectedInit: false,
      visible: false,
      selected: undefined,
      value: props.value,
      valueChangeBySelected: false,
      voidRemoteQuery: false,
      query: ''
    };

    if (props.multiple) {
      _this.state.selectedInit = true;
      _this.state.selected = [];
    }

    if (props.remote) {
      _this.state.voidRemoteQuery = true;
    }

    _this.debouncedOnInputChange = (0, _debounce2.default)(_this.debounce(), function () {
      _this.onInputChange();
    });
    return _this;
  }

  _createClass(Select, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        component: this
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _resizeEvent.addResizeListener)(this.refs.root, this.resetInputWidth.bind(this));

      this.reference = _reactDom2.default.findDOMNode(this.refs.reference);
      this.popper = _reactDom2.default.findDOMNode(this.refs.popper);

      this.handleValueChange();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var _this2 = this;

      if (props.placeholder !== this.props.placeholder) {
        this.setState({
          currentPlaceholder: props.placeholder
        });
      }

      if (props.value !== this.props.value) {
        this.setState({
          value: props.value
        }, function () {
          _this2.handleValueChange();
        });
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(props, state) {
      if (state.value !== this.state.value) {
        this.onValueChange(state.value);
      }

      if (state.visible !== this.state.visible) {
        if (this.props.onVisibleChange) {
          this.props.onVisibleChange(state.visible);
        }

        this.onVisibleChange(state.visible);
      }

      if (state.query !== this.state.query) {
        this.onQueryChange(state.query);
      }

      if (Array.isArray(state.selected)) {
        if (state.selected.length !== this.state.selected.length) {
          this.onSelectedChange(state.selected);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      //console.log("{ inputWidth: this.reference.getBoundingClientRect().width } ");
      //console.log(this.reference.getBoundingClientRect().width)
      //this.setState({ inputWidth: this.reference.getBoundingClientRect().width });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _resizeEvent.removeResizeListener)(this.refs.root, this.resetInputWidth.bind(this));
    }
  }, {
    key: 'debounce',
    value: function debounce() {
      return this.props.remote ? 300 : 0;
    }
  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside() {
      if (this.state.visible) {
        this.setState({ visible: false });
      }
    }
  }, {
    key: 'handleValueChange',
    value: function handleValueChange() {
      var _this3 = this;

      var multiple = this.props.multiple;
      var _state = this.state,
          value = _state.value,
          options = _state.options;


      if (multiple && Array.isArray(value)) {
        this.setState({
          selected: options.reduce(function (prev, curr) {
            return value.indexOf(curr.props.value) > -1 ? prev.concat(curr) : prev;
          }, [])
        }, function () {
          _this3.onSelectedChange(_this3.state.selected, false);
        });
      } else {
        var selected = options.filter(function (option) {
          return option.props.value === value;
        })[0];

        if (selected) {
          this.setState({ selectedLabel: selected.props.label || selected.props.value });
        }
      }
    }
  }, {
    key: 'onVisibleChange',
    value: function onVisibleChange(visible) {
      var _props = this.props,
          multiple = _props.multiple,
          filterable = _props.filterable;
      var _state2 = this.state,
          query = _state2.query,
          dropdownUl = _state2.dropdownUl,
          selected = _state2.selected,
          selectedLabel = _state2.selectedLabel,
          bottomOverflowBeforeHidden = _state2.bottomOverflowBeforeHidden;


      if (!visible) {
        this.reference.querySelector('input').blur();

        if (this.refs.root.querySelector('.ishow-input__icon')) {
          var elements = this.refs.root.querySelector('.ishow-input__icon');

          for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('is-reverse');
          }
        }

        // this.broadcast('select-dropdown', 'destroyPopper');

        if (this.refs.input) {
          this.refs.input.blur();
        }

        this.resetHoverIndex();

        if (!multiple) {
          if (dropdownUl && selected) {
            var element = _reactDom2.default.findDOMNode(selected);
            bottomOverflowBeforeHidden = element.getBoundingClientRect().bottom - this.popper.getBoundingClientRect().bottom;
          }

          if (selected && selected.props) {
            if (selected.props.value) {
              selectedLabel = selected.currentLabel();
            }
          } else if (filterable) {
            selectedLabel = '';
          }

          this.setState({ bottomOverflowBeforeHidden: bottomOverflowBeforeHidden, selectedLabel: selectedLabel });
        }
      } else {
        var icon = this.refs.root.querySelector('.ishow-input__icon');

        if (icon && !icon.classList.contains('ishow-icon-circle-close')) {
          var _elements = this.refs.root.querySelector('.ishow-input__icon');

          for (var _i = 0; _i < _elements.length; _i++) {
            _elements[_i].classList.add('is-reverse');
          }
        }

        if (this.popperJS) {
          this.popperJS.update();
        }

        if (filterable) {
          query = selectedLabel;

          if (multiple) {
            this.refs.input.focus();
          } else {
            this.refs.reference.focus();

            // this.broadcast('input', 'inputSelect');
          }
        }

        if (!dropdownUl) {
          var dropdownChildNodes = this.popper.childNodes;
          dropdownUl = [].filter.call(dropdownChildNodes, function (item) {
            return item.tagName === 'UL';
          })[0];
        }

        if (!multiple && dropdownUl) {
          if (bottomOverflowBeforeHidden > 0) {
            dropdownUl.scrollTop += bottomOverflowBeforeHidden;
          }
        }

        this.setState({ query: query || '', dropdownUl: dropdownUl });
      }
    }
  }, {
    key: 'onValueChange',
    value: function onValueChange(val) {
      var _this4 = this;

      var multiple = this.props.multiple;
      var _state3 = this.state,
          options = _state3.options,
          valueChangeBySelected = _state3.valueChangeBySelected,
          selectedInit = _state3.selectedInit,
          selected = _state3.selected,
          selectedLabel = _state3.selectedLabel,
          currentPlaceholder = _state3.currentPlaceholder,
          cachedPlaceHolder = _state3.cachedPlaceHolder;


      if (valueChangeBySelected) {
        return this.setState({
          valueChangeBySelected: false
        });
      }

      if (multiple && Array.isArray(val)) {
        this.resetInputHeight();

        selectedInit = true;
        selected = [];
        currentPlaceholder = cachedPlaceHolder;

        val.forEach(function (item) {
          var option = options.filter(function (option) {
            return option.props.value === item;
          })[0];
          if (option) {
            _this4.addOptionToValue(option);
          }
        });

        this.forceUpdate();
      }

      if (!multiple) {
        var option = options.filter(function (option) {
          return option.props.value === val;
        })[0];

        if (option) {
          this.addOptionToValue(option);
          this.setState({ selectedInit: selectedInit, currentPlaceholder: currentPlaceholder });
        } else {
          selected = {};
          selectedLabel = '';
          this.setState({ selectedInit: selectedInit, selected: selected, currentPlaceholder: currentPlaceholder, selectedLabel: selectedLabel }, function () {
            _this4.resetHoverIndex();
          });
        }
      }
    }
  }, {
    key: 'onSelectedChange',
    value: function onSelectedChange(val) {
      var _this5 = this;

      var bubble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var form = this.context.form;
      var _props2 = this.props,
          multiple = _props2.multiple,
          filterable = _props2.filterable,
          onChange = _props2.onChange;
      var _state4 = this.state,
          query = _state4.query,
          hoverIndex = _state4.hoverIndex,
          inputLength = _state4.inputLength,
          selectedInit = _state4.selectedInit,
          currentPlaceholder = _state4.currentPlaceholder,
          cachedPlaceHolder = _state4.cachedPlaceHolder,
          valueChangeBySelected = _state4.valueChangeBySelected;


      if (multiple) {
        if (val.length > 0) {
          currentPlaceholder = '';
        } else {
          currentPlaceholder = cachedPlaceHolder;
        }

        this.setState({ currentPlaceholder: currentPlaceholder }, function () {
          _this5.resetInputHeight();
        });

        valueChangeBySelected = true;

        if (bubble) {
          onChange && onChange(val.map(function (item) {
            return item.props.value;
          }), val);
          form && form.onFieldChange();
        }

        // this.dispatch('form-item', 'el.form.change', val);

        if (filterable) {
          query = '';
          hoverIndex = -1;
          inputLength = 20;

          this.refs.input.focus();
        }

        this.setState({ valueChangeBySelected: valueChangeBySelected, query: query, hoverIndex: hoverIndex, inputLength: inputLength }, function () {
          if (_this5.refs.input) {
            _this5.refs.input.value = '';
          }
        });
      } else {
        if (selectedInit) {
          return this.setState({
            selectedInit: false
          });
        }

        if (bubble) {
          onChange && onChange(val.props.value, val);
          form && form.onFieldChange();
        }
      }
    }
  }, {
    key: 'onQueryChange',
    value: function onQueryChange(query) {
      var _props3 = this.props,
          multiple = _props3.multiple,
          filterable = _props3.filterable,
          remote = _props3.remote,
          remoteMethod = _props3.remoteMethod,
          filterMethod = _props3.filterMethod;
      var _state5 = this.state,
          voidRemoteQuery = _state5.voidRemoteQuery,
          hoverIndex = _state5.hoverIndex,
          options = _state5.options,
          optionsCount = _state5.optionsCount;


      if (this.popperJS) {
        this.popperJS.update();
      }

      if (multiple && filterable) {
        this.resetInputHeight();
      }

      if (remote && typeof remoteMethod === 'function') {
        hoverIndex = -1;
        voidRemoteQuery = query === '';

        remoteMethod(query);

        options.forEach(function (option) {
          option.resetIndex();
        });
      } else if (typeof filterMethod === 'function') {
        filterMethod(query);
      } else {
        this.setState({
          filteredOptionsCount: optionsCount
        }, function () {
          options.forEach(function (option) {
            option.queryChange(query);
          });
        });
      }

      this.setState({ hoverIndex: hoverIndex, voidRemoteQuery: voidRemoteQuery });
    }
  }, {
    key: 'onEnter',
    value: function onEnter() {
      this.popperJS = new _popper2.default(this.reference, this.popper, {
        gpuAcceleration: false
      });
    }
  }, {
    key: 'onAfterLeave',
    value: function onAfterLeave() {
      this.popperJS.destroy();
    }
  }, {
    key: 'optionsAllDisabled',
    value: function optionsAllDisabled(options) {
      return options.length === options.filter(function (item) {
        return item.props.disabled === true;
      }).length;
    }
  }, {
    key: 'iconClass',
    value: function iconClass() {
      return this.showCloseIcon() ? 'circle-close' : this.props.remote && this.props.filterable ? '' : 'caret-top ' + (this.state.visible ? 'is-reverse' : '');
    }
  }, {
    key: 'showCloseIcon',
    value: function showCloseIcon() {
      var criteria = this.props.clearable && this.state.inputHovering && !this.props.multiple && this.state.options.indexOf(this.state.selected) > -1;

      if (!this.refs.root) return false;

      var icon = this.refs.root.querySelector('.ishow-input__icon');

      if (icon) {
        if (criteria) {
          icon.addEventListener('click', this.deleteSelected.bind(this));
          icon.classList.add('is-show-close');
        } else {
          icon.removeEventListener('click', this.deleteSelected.bind(this));
          icon.classList.remove('is-show-close');
        }
      }

      return criteria;
    }
  }, {
    key: 'emptyText',
    value: function emptyText() {
      var _props4 = this.props,
          loading = _props4.loading,
          filterable = _props4.filterable;
      var _state6 = this.state,
          voidRemoteQuery = _state6.voidRemoteQuery,
          options = _state6.options,
          filteredOptionsCount = _state6.filteredOptionsCount;


      if (loading) {
        return '加载中';
      } else {
        if (voidRemoteQuery) {
          this.setState({ voidRemoteQuery: false });
          return false;
        }

        if (filterable && filteredOptionsCount === 0) {
          return '无匹配数据';
        }

        if (options.length === 0) {
          return '无数据';
        }
      }

      return null;
    }
  }, {
    key: 'doDestroy',
    value: function doDestroy() {
      this.refs.popper.doDestroy();
    }
  }, {
    key: 'handleClose',
    value: function handleClose() {
      this.setState({ visible: false });
    }
  }, {
    key: 'toggleLastOptionHitState',
    value: function toggleLastOptionHitState(hit) {
      var selected = this.state.selected;


      if (!Array.isArray(selected)) return;

      var option = selected[selected.length - 1];

      if (!option) return;

      if (hit === true || hit === false) {
        return option.hitState = hit;
      }

      option.hitState = !option.hitState;

      return option.hitState;
    }
  }, {
    key: 'deletePrevTag',
    value: function deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        var selected = this.state.selected;


        selected.pop();

        this.setState({ selected: selected });
      }
    }
  }, {
    key: 'addOptionToValue',
    value: function addOptionToValue(option, init) {
      var _props5 = this.props,
          multiple = _props5.multiple,
          remote = _props5.remote;
      var _state7 = this.state,
          selected = _state7.selected,
          selectedLabel = _state7.selectedLabel,
          hoverIndex = _state7.hoverIndex,
          value = _state7.value;


      if (multiple) {
        if (selected.indexOf(option) === -1 && (remote ? value.indexOf(option.props.value) === -1 : true)) {
          this.selectedInit = !!init;

          selected.push(option);

          this.resetHoverIndex();
        }
      } else {
        this.selectedInit = !!init;

        selected = option;
        selectedLabel = option.currentLabel();
        hoverIndex = option.index;

        this.setState({ selected: selected, selectedLabel: selectedLabel, hoverIndex: hoverIndex });
      }
    }
  }, {
    key: 'managePlaceholder',
    value: function managePlaceholder() {
      var _state8 = this.state,
          currentPlaceholder = _state8.currentPlaceholder,
          cachedPlaceHolder = _state8.cachedPlaceHolder;


      if (currentPlaceholder !== '') {
        currentPlaceholder = this.refs.input.value ? '' : cachedPlaceHolder;
      }

      this.setState({ currentPlaceholder: currentPlaceholder });
    }
  }, {
    key: 'resetInputState',
    value: function resetInputState(e) {
      if (e.keyCode !== 8) {
        this.toggleLastOptionHitState(false);
      }

      this.setState({
        inputLength: this.refs.input.value.length * 15 + 20
      });
    }
  }, {
    key: 'resetInputWidth',
    value: function resetInputWidth() {
      this.setState({
        inputWidth: this.reference.getBoundingClientRect().width
      });
    }
  }, {
    key: 'resetInputHeight',
    value: function resetInputHeight() {
      var inputChildNodes = this.reference.childNodes;
      var input = [].filter.call(inputChildNodes, function (item) {
        return item.tagName === 'INPUT';
      })[0];

      input.style.height = Math.max(this.refs.tags.clientHeight + 6, sizeMap[this.props.size] || 36) + 'px';

      if (this.popperJS) {
        this.popperJS.update();
      }
    }
  }, {
    key: 'resetHoverIndex',
    value: function resetHoverIndex() {
      var _this6 = this;

      var multiple = this.props.multiple;
      var _state9 = this.state,
          hoverIndex = _state9.hoverIndex,
          options = _state9.options,
          selected = _state9.selected;


      setTimeout(function () {
        if (!multiple) {
          hoverIndex = options.indexOf(selected);
        } else {
          if (selected.length > 0) {
            hoverIndex = Math.min.apply(null, selected.map(function (item) {
              return options.indexOf(item);
            }));
          } else {
            hoverIndex = -1;
          }
        }

        _this6.setState({ hoverIndex: hoverIndex });
      }, 300);
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      var _props6 = this.props,
          filterable = _props6.filterable,
          disabled = _props6.disabled;
      var _state10 = this.state,
          query = _state10.query,
          visible = _state10.visible;


      if (filterable && query === '' && visible) {
        return;
      }

      if (!disabled) {
        this.setState({
          visible: !visible
        });
      }
    }
  }, {
    key: 'navigateOptions',
    value: function navigateOptions(direction) {
      var _this7 = this;

      var _state11 = this.state,
          visible = _state11.visible,
          hoverIndex = _state11.hoverIndex,
          options = _state11.options;


      if (!visible) {
        return this.setState({
          visible: true
        });
      }

      var skip = void 0;

      if (options.length !== options.filter(function (item) {
        return item.props.disabled === true;
      }).length) {
        if (direction === 'next') {
          hoverIndex++;

          if (hoverIndex === options.length) {
            hoverIndex = 0;
          }

          if (options[hoverIndex].props.disabled === true || options[hoverIndex].props.groupDisabled === true || !options[hoverIndex].state.visible) {
            skip = 'next';
          }
        }

        if (direction === 'prev') {
          hoverIndex--;

          if (hoverIndex < 0) {
            hoverIndex = options.length - 1;
          }

          if (options[hoverIndex].props.disabled === true || options[hoverIndex].props.groupDisabled === true || !options[hoverIndex].state.visible) {
            skip = 'prev';
          }
        }
      }

      this.setState({ hoverIndex: hoverIndex, options: options }, function () {
        if (skip) {
          _this7.navigateOptions(skip);
        }

        _this7.resetScrollTop();
      });
    }
  }, {
    key: 'resetScrollTop',
    value: function resetScrollTop() {
      var element = _reactDom2.default.findDOMNode(this.state.options[this.state.hoverIndex]);
      var bottomOverflowDistance = element.getBoundingClientRect().bottom - this.popper.getBoundingClientRect().bottom;
      var topOverflowDistance = element.getBoundingClientRect().top - this.popper.getBoundingClientRect().top;

      if (this.state.dropdownUl) {
        var _scrollTop = this.state.dropdownUl.scrollTop;
        if (bottomOverflowDistance > 0) {
          this.setState({
            dropdownUl: { scrollTop: _scrollTop += bottomOverflowDistance }
          });
          //this.state.dropdownUl.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          this.setState({
            dropdownUl: { scrollTop: _scrollTop += topOverflowDistance }
          });
          //this.state.dropdownUl.scrollTop += topOverflowDistance;
        }
      }
    }
  }, {
    key: 'selectOption',
    value: function selectOption() {
      var _state12 = this.state,
          hoverIndex = _state12.hoverIndex,
          options = _state12.options;


      if (options[hoverIndex]) {
        this.onOptionClick(options[hoverIndex]);
      }
    }
  }, {
    key: 'deleteSelected',
    value: function deleteSelected(e) {
      e.stopPropagation();

      if (this.state.selectedLabel !== '') {
        this.setState({
          selected: {},
          selectedLabel: '',
          visible: false
        });

        this.context.form && this.context.form.onFieldChange();

        if (this.props.onChange) {
          this.props.onChange('');
        }

        if (this.props.onClear) {
          this.props.onClear();
        }
      }
    }
  }, {
    key: 'deleteTag',
    value: function deleteTag(tag) {
      var _this8 = this;

      var index = this.state.selected.indexOf(tag);

      if (index > -1 && !this.props.disabled) {
        var selected = this.state.selected.slice(0);

        selected.splice(index, 1);

        this.setState({ selected: selected }, function () {
          if (_this8.props.onRemoveTag) {
            _this8.props.onRemoveTag(tag.props.value);
          }
        });
      }
    }
  }, {
    key: 'handleIconClick',
    value: function handleIconClick(event) {
      if (this.iconClass().indexOf('circle-close') > -1) {
        this.deleteSelected(event);
      } else {
        this.toggleMenu();
      }
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange() {
      if (this.props.filterable && this.state.selectedLabel !== this.state.value) {
        this.setState({
          query: this.state.selectedLabel
        });
      }
    }
  }, {
    key: 'onOptionCreate',
    value: function onOptionCreate(option) {
      var _optionsCount = this.state.optionsCount;
      var _filteredOptionsCount = this.state.filteredOptionsCount;
      this.state.options.push(option);
      this.setState({
        optionsCount: _optionsCount++
      });
      //this.state.optionsCount++;
      this.setState({
        filteredOptionsCount: _filteredOptionsCount++
      });
      //this.state.filteredOptionsCount++;

      this.forceUpdate();
      this.handleValueChange();
    }
  }, {
    key: 'onOptionDestroy',
    value: function onOptionDestroy(option) {
      var _optionsCount = this.state.optionsCount;
      var _filteredOptionsCount = this.state.filteredOptionsCount;
      this.setState({
        optionsCount: _optionsCount--
      });
      //this.state.optionsCount--;
      this.setState({
        filteredOptionsCount: _filteredOptionsCount--
      });
      //this.state.filteredOptionsCount--;

      var index = this.state.options.indexOf(option);

      if (index > -1) {
        this.state.options.splice(index, 1);
      }

      this.state.options.forEach(function (el) {
        if (el !== option) {
          el.resetIndex();
        }
      });

      this.forceUpdate();
      this.handleValueChange();
    }
  }, {
    key: 'onOptionClick',
    value: function onOptionClick(option) {
      var _this9 = this;

      var multiple = this.props.multiple;
      var _state13 = this.state,
          visible = _state13.visible,
          selected = _state13.selected,
          selectedLabel = _state13.selectedLabel;


      if (!multiple) {
        selected = option;
        selectedLabel = option.currentLabel();
        visible = false;
      } else {
        var optionIndex = -1;

        selected = selected.slice(0);

        selected.forEach(function (item, index) {
          if (item === option || item.currentLabel() === option.currentLabel()) {
            optionIndex = index;
          }
        });

        if (optionIndex > -1) {
          selected.splice(optionIndex, 1);
        } else {
          selected.push(option);
        }
      }

      this.setState({ selected: selected, selectedLabel: selectedLabel }, function () {
        if (!multiple) {
          _this9.onSelectedChange(_this9.state.selected);
        }

        _this9.setState({ visible: visible });
      });
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      event.preventDefault();

      if (this.refs.input) {
        this.refs.input.focus();
      }

      this.toggleMenu();
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter() {
      this.setState({
        inputHovering: true
      });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave() {
      this.setState({
        inputHovering: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this10 = this;

      var _props7 = this.props,
          multiple = _props7.multiple,
          size = _props7.size,
          disabled = _props7.disabled,
          filterable = _props7.filterable,
          loading = _props7.loading;
      var _state14 = this.state,
          selected = _state14.selected,
          inputWidth = _state14.inputWidth,
          inputLength = _state14.inputLength,
          query = _state14.query,
          selectedLabel = _state14.selectedLabel,
          visible = _state14.visible,
          options = _state14.options,
          filteredOptionsCount = _state14.filteredOptionsCount,
          currentPlaceholder = _state14.currentPlaceholder;


      return _react2.default.createElement(
        'div',
        { ref: 'root', style: this.style(), className: this.className('ishow-select') },
        multiple && _react2.default.createElement(
          'div',
          { ref: 'tags', className: 'ishow-select__tags', onClick: this.toggleMenu.bind(this), style: {
              maxWidth: inputWidth - 32
            } },
          selected.map(function (el) {
            return _react2.default.createElement(
              _Tag2.default,
              {
                type: 'primary',
                key: el.props.value,
                hit: el.hitState,
                closable: !disabled,
                closeTransition: true,
                onClose: _this10.deleteTag.bind(_this10, el)
              },
              _react2.default.createElement(
                'span',
                { className: 'ishow-select__tags-text' },
                el.currentLabel()
              )
            );
          }),
          filterable && _react2.default.createElement('input', {
            ref: 'input',
            type: 'text',
            className: this.classNames('ishow-select__input', size && 'is-' + size),
            style: { width: inputLength, maxWidth: inputWidth - 42 },
            disabled: disabled,
            defaultValue: query,
            onKeyUp: this.managePlaceholder.bind(this),
            onKeyDown: function onKeyDown(e) {
              _this10.resetInputState(e);

              switch (e.keyCode) {
                case 27:
                  _this10.setState({ visible: false });e.preventDefault();
                  break;
                case 8:
                  _this10.deletePrevTag(e);
                  break;
                case 13:
                  _this10.selectOption();e.preventDefault();
                  break;
                case 38:
                  _this10.navigateOptions('prev');e.preventDefault();
                  break;
                case 40:
                  _this10.navigateOptions('next');e.preventDefault();
                  break;
                default:
                  break;
              }
            },
            onChange: function onChange(e) {
              clearTimeout(_this10.timeout);

              _this10.timeout = setTimeout(function () {
                _this10.setState({
                  query: _this10.state.value
                });
              }, _this10.debounce());
              _this10.setState({ value: e.target.value });
            }
          })
        ),
        _react2.default.createElement(_Input2.default, {
          ref: 'reference',
          value: selectedLabel,
          type: 'text',
          placeholder: currentPlaceholder,
          name: 'name',
          size: size,
          disabled: disabled,
          readOnly: !filterable || multiple,
          icon: this.iconClass() || undefined,
          onChange: function onChange(value) {
            return _this10.setState({ selectedLabel: value });
          },
          onIconClick: this.handleIconClick.bind(this),
          onMouseDown: this.onMouseDown.bind(this),
          onMouseEnter: this.onMouseEnter.bind(this),
          onMouseLeave: this.onMouseLeave.bind(this),
          onKeyUp: this.debouncedOnInputChange.bind(this),
          onKeyDown: function onKeyDown(e) {
            switch (e.keyCode) {
              case 9:
              case 27:
                _this10.setState({ visible: false });e.preventDefault();
                break;
              case 13:
                _this10.selectOption();e.preventDefault();
                break;
              case 38:
                _this10.navigateOptions('prev');e.preventDefault();
                break;
              case 40:
                _this10.navigateOptions('next');e.preventDefault();
                break;
              default:
                break;
            }
          }
        }),
        _react2.default.createElement(
          _transition2.default,
          { name: 'ishow-zoom-in-top', onEnter: this.onEnter.bind(this), onAfterLeave: this.onAfterLeave.bind(this) },
          _react2.default.createElement(
            _index.View,
            { show: visible && this.emptyText() !== false },
            _react2.default.createElement(
              'div',
              { ref: 'popper', className: this.classNames('ishow-select-dropdown', {
                  'is-multiple': multiple
                }), style: {
                  minWidth: inputWidth
                } },
              _react2.default.createElement(
                _index.View,
                { show: options.length > 0 && filteredOptionsCount > 0 && !loading },
                _react2.default.createElement(
                  _Scrollbar.Scrollbar,
                  {
                    viewComponent: 'ul',
                    wrapClass: 'ishow-select-dropdown__wrap',
                    viewClass: 'ishow-select-dropdown__list'
                  },
                  this.props.children
                )
              ),
              this.emptyText() && _react2.default.createElement(
                'p',
                { className: 'ishow-select-dropdown__empty' },
                this.emptyText()
              )
            )
          )
        )
      );
    }
  }]);

  return Select;
}(_index2.default);

Select.childContextTypes = {
  component: _propTypes2.default.any
};

Select.contextTypes = {
  form: _propTypes2.default.any
};

Select.propTypes = {
  value: _propTypes2.default.any,
  size: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  clearable: _propTypes2.default.bool,
  filterable: _propTypes2.default.bool,
  loading: _propTypes2.default.bool,
  remote: _propTypes2.default.bool,
  remoteMethod: _propTypes2.default.func,
  filterMethod: _propTypes2.default.func,
  multiple: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  onVisibleChange: _propTypes2.default.func,
  onRemoveTag: _propTypes2.default.func,
  onClear: _propTypes2.default.func
};

exports.default = (0, _reactClickOutside2.default)(Select);