
const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;

const defaultOptions = {
  xAxis: {
    // maxPlot: 120, // 5 seconds interval for 10 minutes
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
    startTime: (new Date().getTime()) - (UNIX_TIMESTAMP * MINUTE_IN_SECONDS * 10),
    endTime: new Date().getTime(),
  },
  yAxis: {
    plots: 4,
    maxValue: 100,
    minValue: 0,
    fixedMinMax: true,
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
    range: 1000
  },
  common: {
    disconnectThreshold: 20 * UNIX_TIMESTAMP * 10000000,
    identicalDataBehavior: "avg",
    offset: {
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
    }
  }
}

export default defaultOptions;