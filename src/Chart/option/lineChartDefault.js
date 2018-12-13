
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
    tickFormat: function (d) {
      return d;
    },
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
      color: '#000000'
    }
  },
  tooltip: {
    range: 1000
  },
  common: {
    disconnectThreshold: 20 * UNIX_TIMESTAMP * 10000000,
    identicalDataBehavior: "avg"
  }
}

export default defaultOptions;