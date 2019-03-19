import LineChart from './LineChart'
import EqualizerChart from './EqualizerChart'
import HitmapChart from './HitmapChart'
import ChartMediator from './mediator/ChartMediator'
import ArcChart from './ArcChart'
import PublicLegend from './legend/PublicLegend'

/**
 * Chart Collection for selecting chart dynamically
 */
let ChartCollection = {
  "LineChart": LineChart,
  "EqualizerChart": EqualizerChart,
  "ArcChart": ArcChart,
  "HitmapChart": HitmapChart,
}

export { LineChart, HitmapChart, ChartMediator, PublicLegend, ChartCollection };