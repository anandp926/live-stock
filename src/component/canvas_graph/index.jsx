import React, { Component } from "react"
import CanvasJSReact from "./canvasjs/canvasjs.react"

export default class Graph extends Component {
    dataPoints = []

    componentDidMount() {
        let chart = this.chart
        chart.render()
    }

    render() {
        let options;
        if(this.props.stock !== undefined){
            if (this.props.stock.history) {
                this.dataPoints = this.props.stock.history.map(stock => {
                    return {
                        x: new Date(stock.time),
                        y: stock.price
                    }
                })
            }
            options = {
                theme: "light2",
                title: {
                    text: `Stock Price of ${this.props.stockKey}`
                },
                axisY: {
                    title: "Price in USD",
                    prefix: "$",
                    includeZero: false
                },
                data: [
                    {
                        type: "line",
                        xValueFormatString: "hh mm ss",
                        yValueFormatString: "$#,##0.00",
                        dataPoints: this.dataPoints
                    }
                ]
            }
        }
        var CanvasJSChart = CanvasJSReact.CanvasJSChart
        
        if(this.props.stock !== undefined && options !== undefined){
            return (
            <div id='graph'>
                <CanvasJSChart
                    options={options}
                    onRef={ref => (this.chart = ref)}
                />
            </div>
        )
        }else {
            return null
        }
        
    }
}
