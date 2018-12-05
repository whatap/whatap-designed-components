
const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;

const defaultOptions = {
  xAxis: {
    maxPlot: 600, // 5 seconds interval for 10 minutes
    interval: 5,
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
    maxValue: 80,
    minValue: 40,
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
  common: {
    disconnectThreshold: 20 * UNIX_TIMESTAMP
  }
}

export default defaultOptions;