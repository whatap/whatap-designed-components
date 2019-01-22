import LineChart from './LineChart'
import EqualizerChart from './EqualizerChart'
import ChartMediator from './mediator/ChartMediator'
import PublicLegend from './legend/PublicLegend'

/**
 * Chart Collection for selecting chart dynamically
 */
let ChartCollection = {
  "LineChart": LineChart,
  "EqualizerChart": EqualizerChart,
}

export { LineChart, ChartMediator, PublicLegend, ChartCollection };