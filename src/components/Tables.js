import React, { Component } from 'react';
import Heatmap from 'highcharts/modules/heatmap'
import ReactHighchart from 'react-highcharts'

Heatmap(ReactHighchart.Highcharts)

class Tables extends Component {
    render() {

        const { scenarios, timePeriods, indicatorCategories, values } = this.props;

        let chosenTimePeriod = timePeriods[0];
        let chosenIndicatorCategory = indicatorCategories[0];

        let chosenScenarios = [scenarios[0], scenarios[1], scenarios[2], scenarios[4]];
        let chosenIndicators = [chosenIndicatorCategory.indicators[0], chosenIndicatorCategory.indicators[1], chosenIndicatorCategory.indicators[2], chosenIndicatorCategory.indicators[3]];

        let chosenValueSeries = [];
        let chosenScenarioNames = [];
        let chosenIndicatorNames = [];

        // These loops go through the choices given by the user and pushes all the values for the current settings to an array
        // which is later looped through to create the displayable data series
        // NOTE: User must have chosen: scenarios, indicators and a time period
        chosenScenarios.forEach(scenario => {
            chosenScenarioNames.push(scenario.name);
            let chosenValues = [];
            chosenIndicators.forEach(indicator => {
                values.forEach(value => {
                    if (value.scenarioId === scenario.id) {
                        if (value.indicatorId === indicator.id) {
                            if (value.timePeriodId === chosenTimePeriod.id) {
                                chosenValues.push(value.value);
                            }
                        }
                    }
                });
            });
            chosenValueSeries.push(chosenValues);
        });

        chosenIndicators.forEach(indicator => {
            chosenIndicatorNames.push(indicator.name);
        });

        // This loops through the users scenario choices and creates series objects to be shown with the data pairing of the scenario/indicator combinations
        // DataSet is formatted like this: one cell = [col, row, data]
        let dataSet = [];

        let col = 0;
        let row = 0;
        chosenScenarios.forEach(scenario => {
            let dataObj = [];
            chosenIndicators.forEach(indicator => {
                dataObj = [col, row, chosenValueSeries[col][row]];
                dataSet.push(dataObj);

                if (row >= chosenIndicators.length - 1) {
                    row = 0;
                } else {
                    row++;
                }

            });

            if (col >= chosenScenarios.length - 1) {
                col = 0;
            } else {
                col++;
            }
        });

        const config = {
            chart: {
                type: 'heatmap',
                marginTop: 80,
                marginBottom: 80,
                margin: 120,
                plotBorderWidth: 1
            },
            title: {
                text: chosenTimePeriod.yearStart + '-' + chosenTimePeriod.yearEnd
            },
            subtitle: {
                text: 'Source: http://melatupa.azurewebsites.net/'
            },
            xAxis: {
                opposite: true,
                categories: chosenScenarioNames,
                title: "Chosen scenarios"
            },
            yAxis: {
                categories: chosenIndicatorNames,
                title: "Chosen indicators",
            },
            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: '#000000'
            },
            legend: {
                enabled: false,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> <br><b>' +
                        this.point.value + '</b> <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                }
            },
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: dataSet,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }]
        };

        return (
            <div>
                <ReactHighchart config={config} />
            </div>
        )
    }
}

export default Tables