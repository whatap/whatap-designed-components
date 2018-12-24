import LineChart from './LineChart'
import ChartMediator from './mediator/ChartMediator'
import PublicLegend from './legend/PublicLegend'

/**
 * Chart Collection for selecting chart dynamically
 */
let ChartCollection = {
  "LineChart": LineChart
}

export { LineChart, ChartMediator, PublicLegend, ChartCollection };