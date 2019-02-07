import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PublicLegend } from '../../Chart'
import ColorSelector from '../../Chart/helper/ColorSelector'
import { CoreFunc } from '../../core'

function objectCompare (object1, object2) {
  // Return if value is not an object
  if (typeof object1 !== 'object') {
    object1 = {};
  }
  if (typeof object2 !== 'object') return ;
  return JSON.stringify(object1) === JSON.stringify(object2);
}

class PublicLegendWrapper extends Component {

  static defaultProps = {
    btnClassSelected: {
      border: '1px solid black'
    },
    btnClassUnselected: {
      border: '1px solid black'
    }
  }
  
  constructor(props) {
    super(props);

    this.legend = new PublicLegend();
    this.colorSelector = ColorSelector.instance;
  }

  componentDidMount() {
    const { data } = this.props;

    console.log("plw")
    console.log(data);
    this.legend.loadData(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data, updateData } = this.props;

    if (!objectCompare(data, nextProps.data)) {
      this.legend.loadData(nextProps.data);
    }

    if (!objectCompare(updateData, nextProps.updateData)) {
      this.legend.loadData(nextProps.updateData);
    }
  }

  selectLegend = (id) => {
    this.legend.handleClick(id);
  }
  
  render() {
    let that = this;
    const { wrapperClass, btnClassSelected, btnClassUnselected } = this.props;

    return (
      <div>
        { this.legend.dataset.map((ds) => {
          let dsColor = that.colorSelector.getColorFromId(ds.id, "wh")
          let colorValue = CoreFunc.formatRgb(dsColor.rgb, dsColor.alpha);
          return (
            <button 
              // className={ds.focused ? btnClassSelected: btnClassUnselected}
              style={ds.focused ? {backgroundColor: colorValue} : {backgroundColor: 'grey'}}
              onClick={() => that.selectLegend(ds.id)}
            >
              {ds.label}
            </button>
          )
        })}
      </div>
    )
  }
}

export default PublicLegendWrapper;