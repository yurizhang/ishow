// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {default as Component} from '../Common/plugs/index.js'; //提供style, classname方法
import local from '../Common/locale';

import TableLayout from './TableLayout'
import normalizeColumns from './normalizeColumns';
import { getLeafColumns, getValueByPath, getColumns, convertToRows } from "./utils";
import '../Common/css/Table.css';
import '../Common/css/Table-column.css';
let tableIDSeed = 1;

function filterData(data, columns) {
  return columns.reduce((preData, column) => {
    const { filterable, filterMultiple, filteredValue, filterMethod } = column;
    if (filterable) {
      if (filterMultiple && Array.isArray(filteredValue) && filteredValue.length) {
        return preData.filter(_data => filteredValue.some(value => filterMethod(value, _data)))
      } else if (filteredValue) {
        return preData.filter(_data => filterMethod(filteredValue, _data));
      }
    }
    return preData;
  }, data);
}


export default class TableStore extends Component{
  static propTypes = {
    style: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripe: PropTypes.bool,
    border: PropTypes.bool,
    fit: PropTypes.bool,
    showHeader: PropTypes.bool,
    highlightCurrentRow: PropTypes.bool,
    currentRowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
    rowClassName: PropTypes.func,
    rowStyle: PropTypes.func,
    rowKey: PropTypes.func,
    emptyText: PropTypes.string,
    defaultExpandAll: PropTypes.bool,
    expandRowKeys:PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    defaultSort: PropTypes.shape({ prop: PropTypes.string, order: PropTypes.oneOf(['ascending', 'descending']) }),
    tooltipEffect:PropTypes.oneOf(['dark', 'light']),
    showSummary: PropTypes.bool,
    sumText: PropTypes.string,
    summaryMethod: PropTypes.func,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectChange: PropTypes.func
  };

  static defaultProps = {
    data: [],
    showHeader: true,
    stripe: false,
    fit: true,
    emptyText: local.t('ishow.table.emptyText'),
    defaultExpandAll: false,
    highlightCurrentRow: false,
    showSummary: false,
    sumText: local.t('ishow.table.sumText'),
  };

  static childContextTypes = {
    store: PropTypes.any,
  };

  getChildContext() {
    return {
      store: this,
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      fixedColumns: null, // left fixed columns in _columns
      rightFixedColumns: null, // right fixed columns in _columns
      columnRows: null, // columns to render header
      columns: null, // contain only leaf column
      isComplex: null, // whether some column is fixed
      expandingRows: [],
      hoverRow: null,
      rowKey: props.rowKey,
      defaultExpandAll: props.defaultExpandAll,
      currentRow: null,
      selectable: null,
      selectedRows: null,
      sortOrder: null,
      sortColumn: null,
    };
    [
      'toggleRowSelection',
      'toggleAllSelection',
      'clearSelection',
      'setCurrentRow',
    ].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });

    this._isMounted = false;
  }

  componentWillMount() {
    this.updateColumns(getColumns(this.props));
    this.updateData(this.props);
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    // const { data } = this.props;
    const nextColumns = getColumns(nextProps);

    if (getColumns(this.props) !== nextColumns) {
      this.updateColumns(nextColumns);
    }

    this.updateData(nextProps);
    // if (data !== nextProps.data) {
    //   this.updateData(nextProps);
    // }

  }

  get isAllSelected() {
    const { currentRowKey } = this.props;
    const { selectedRows, data, selectable } = this.state;
    const selectableData = selectable ? data.filter((row, index) => selectable(row, index)) : data;

    if (!selectableData.length) {
      return false;
    }

    if (Array.isArray(currentRowKey)) {
      return currentRowKey.length === selectableData.length;
    }
    return selectedRows.length === selectableData.length;
  }

  // shouldComponentUpdate(nextProps) {
  //   const propsKeys = Object.keys(this.props);
  //   const nextPropsKeys = Object.keys(nextProps);
  //
  //   if (propsKeys.length !== nextPropsKeys.length) {
  //     return true;
  //   }
  //   for (const key of propsKeys) {
  //     if (this.props[key] !== nextProps[key]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  updateColumns(columns) {
    let _columns = normalizeColumns(columns, tableIDSeed++);

    const fixedColumns = _columns.filter(column => column.fixed === true || column.fixed === 'left');
    const rightFixedColumns = _columns.filter(column => column.fixed === 'right');

    let selectable;
    if (_columns[0] && _columns[0].type === 'selection') {
      selectable = _columns[0].selectable;
      if (fixedColumns.length && !_columns[0].fixed) {
        _columns[0].fixed = true;
        fixedColumns.unshift(_columns[0]);
      }
    }

    _columns = [].concat(fixedColumns, _columns.filter(column => !column.fixed), rightFixedColumns);

    this.setState(Object.assign(this.state || {}, {
      fixedColumns,
      rightFixedColumns,
      columnRows: convertToRows(_columns),
      columns: getLeafColumns(_columns),
      isComplex: fixedColumns.length > 0 || rightFixedColumns.length > 0,
      selectable
    }));
  }

  updateData(props) {
    const { data = [], defaultExpandAll, defaultSort } = props;
    const { columns } = this.state;
    const filteredData = filterData(data.slice(), columns);

    let { hoverRow, currentRow, selectedRows, expandingRows } = this.state;
    hoverRow = hoverRow && data.includes(hoverRow) ? hoverRow : null;
    currentRow = currentRow && data.includes(currentRow) ? currentRow : null;

    if (this._isMounted && data !== this.props.data && !columns[0].reserveSelection) {
      selectedRows = [];
    } else {
      selectedRows = (selectedRows && selectedRows.filter(row => data.includes(row))) || [];
    }

    if (!this._isMounted) {
      expandingRows = defaultExpandAll ? data.slice() : [];
    } else {
      expandingRows = expandingRows.filter(row => data.includes(row));
    }

    this.setState(Object.assign(this.state, {
      data: filteredData,
      filteredData,
      hoverRow,
      currentRow,
      expandingRows,
      selectedRows,
    }));

    if ((!this._isMounted || data !== this.props.data) && defaultSort) {
      const { prop, order = 'ascending' } = defaultSort;
      const sortColumn = columns.find(column => column.property === prop);
      this.changeSortCondition(sortColumn, order, false);
    } else {
      this.changeSortCondition(null, null, false);
    }
  }

  setHoverRow(index) {
    if (!this.state.isComplex) return;
    this.setState({
      hoverRow: index
    });
  }

  toggleRowExpanded(row, rowKey) {
    const { expandRowKeys } = this.props;
    let { expandingRows } = this.state;
    if (expandRowKeys) { // controlled expanding status
      const isRowExpanding = expandRowKeys.includes(rowKey);
      this.dispatchEvent('onExpand', row, !isRowExpanding);
      return;
    }

    expandingRows = expandingRows.slice();
    const rowIndex = expandingRows.indexOf(row);
    if (rowIndex > -1) {
      expandingRows.splice(rowIndex, 1);
    } else {
      expandingRows.push(row);
    }

    this.setState({
      expandingRows
    }, () => {
      this.dispatchEvent('onExpand', row, rowIndex === -1);
    });
  }

  isRowExpanding(row, rowKey) {
    const { expandRowKeys } = this.props;
    const { expandingRows } = this.state;

    if (expandRowKeys) {
      return expandRowKeys.includes(rowKey);
    }
    return expandingRows.includes(row);
  }

  setCurrentRow(row = null) {
    const { highlightCurrentRow, currentRowKey } = this.props;
    if (!highlightCurrentRow || currentRowKey) return;

    const { currentRow: oldRow } = this.state;
    this.setState({
      currentRow: row
    }, () => {
      this.dispatchEvent('onCurrentChange', row, oldRow)
    });
  }

  toggleRowSelection(row, isSelected) {
    const { currentRowKey } = this.props;

    if (Array.isArray(currentRowKey)) return;

    const selectedRows = this.state.selectedRows.slice();
    const rowIndex = selectedRows.indexOf(row);

    if (isSelected !== undefined) {
      if (isSelected) {
        rowIndex === -1 && selectedRows.push(row);
      } else {
        rowIndex !== -1 && selectedRows.splice(rowIndex, 1);
      }
    } else {
      rowIndex === -1 ? selectedRows.push(row) : selectedRows.splice(rowIndex, 1)
    }

    this.setState({
      selectedRows
    }, () => {
      this.dispatchEvent('onSelect', selectedRows, row)
      this.dispatchEvent('onSelectChange', selectedRows)
    });
  }

  toggleAllSelection() {
    const { currentRowKey } = this.props;
    if (Array.isArray(currentRowKey)) return;

    let { data, selectedRows, selectable } = this.state;

    if (this.isAllSelected) {
      selectedRows = [];
    } else {
      selectedRows = selectable ? data.filter((data, index) => selectable(data, index)) : data.slice();
    }

    this.setState({
      selectedRows,
    }, () => {
      this.dispatchEvent('onSelectAll', selectedRows)
      this.dispatchEvent('onSelectChange', selectedRows)
    })
  }

  clearSelection() {
    const { currentRowKey } = this.props;
    if (Array.isArray(currentRowKey)) return;

    this.setState({
      selectedRows: [],
    });
  }

  isRowSelected(row, rowKey) {
    const { currentRowKey } = this.props;
    const { selectedRows } = this.state;

    if (Array.isArray(currentRowKey)) {
      return currentRowKey.includes(rowKey);
    }
    return selectedRows.includes(row);
  }

  changeSortCondition(column, order, shouldDispatchEvent = true) {
    if (!column) ({ sortColumn: column, sortOrder: order } = this.state)

    const data = this.state.filteredData.slice();

    if (!column) {
      this.setState({
        data
      });
      return;
    }

    const { sortMethod, property } = column;
    let sortedData;
    if (!order) {
      sortedData = data;
    } else {
      const flag = order === 'ascending' ? 1 : -1;
      if (sortMethod) {
        sortedData = data.sort((a, b) => sortMethod(a, b) ? flag : -flag);
      } else {
        sortedData = data.sort((a, b) => {
          const aVal = getValueByPath(a, property);
          const bVal = getValueByPath(b, property);
          return aVal === bVal ? 0 : aVal > bVal ? flag : -flag;
        });
      }
    }

    this.setState({
      sortColumn: column,
      sortOrder: order,
      data: sortedData,
    }, () => {
      shouldDispatchEvent && this.dispatchEvent('onSortChange', column && order ? { column, prop: column.property, order } : { column: null, prop: null, order: null })
    });
  }

  toggleFilterOpened(column) {
    column.filterOpened = !column.filterOpened;
    this.forceUpdate();
  }

  changeFilteredValue(column, value) {
    column.filteredValue = value;
    const filteredData = filterData(this.props.data.slice(), this.state.columns);
    this.setState(Object.assign(this.state, {
      filteredData
    }), () => {
      this.dispatchEvent('onFilterChange', { [column.columnKey]: value })
    });
    this.changeSortCondition(null, null, false);
  }

  dispatchEvent(name, ...args) {
    const fn = this.props[name];
    fn && fn(...args);
  }

  render()  {
    const renderExpanded = (this.state.columns.find(column => column.type === 'expand') || {}).expandPannel;
    return (
      <TableLayout
        {...this.props}
        renderExpanded={renderExpanded}
        store={this.state}
      />
    )
  }
}
