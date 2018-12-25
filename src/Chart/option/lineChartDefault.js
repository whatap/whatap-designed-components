import moment from 'moment';

const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;
const TEN_MINUTE_IN_MILLIS = 10 * MINUTE_IN_SECONDS * UNIX_TIMESTAMP;

const defaultOptions = {
  xAxis: {
    maxPlot: 140, // 5 seconds interval for 10 minutes
    axisLine: {
      display: true,
      color: '#000000',
    },
    plotLine: {
      display: true,
      color: '#d9e2eb'
    },
    tick: {
      display: true,
      color: '#000000'
    },
    isFixed: false,
    timeDiff: TEN_MINUTE_IN_MILLIS,
  },
  yAxis: {
    maxPlots: false,
    maxValue: 10,
    minValue: 0,
    fixedMin: true,
    fixedMax: true,
    axisLine: {
      display: true,
      color: '#000000'
    },
    plotLine: {
      display: true,
      color: '#d9e2eb'
    },
    tick: {
      display: true,
      color: '#000000',
      format: function (d) {
        return d;
      }
    }
  },
  tooltip: {
    range: 1000,
    time: {
      format: function (d) {
        return moment.unix(d / 1000).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    value: {
      format: function (d) {
        return d.toFixed(1);
      }
    }
  },
  common: {
    disconnectThreshold: 20 * UNIX_TIMESTAMP,
    identicalDataBehavior: "avg",
    offset: {
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
    },
    drawHelper: false,
  }
}

export default defaultOptions;