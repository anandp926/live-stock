import React, { Component } from "react"
import {
    Sparklines,
    SparklinesLine,
    SparklinesReferenceLine
} from "react-sparklines"
export default class Graph extends Component {
    render() {
        let graphData = []

        if (this.props) {
            graphData = this.props.stock.history.map(stock => stock.price)
        }
        return (
            <div id='graph'>
                <Sparklines
                    data={graphData}
                    limit={5}
                    width={100}
                    height={20}
                    margin={5}
                >
                    <SparklinesLine color='blue' />
                    <SparklinesReferenceLine type='mean' />
                </Sparklines>
            </div>
        )
    }
}
