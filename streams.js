Plotly.d3.csv("public_CPA01.csv", function (row1) {
    Plotly.d3.csv("public_CMH24.csv", function (row2) {


                        function unpack(row1, key) {
                            return row1.map(function (row) { return row[key]; });
                        }
                        function unpack(row2, key) {
                            return row2.map(function (row) { return row[key]; });
                        }


                        var trace1 = {
                            type: "scatter",
                            mode: "lines",
                            name: 'Painter Creek',
                            x: unpack(row1, 'rounded_time'),
                            y: unpack(row1, 'level_ft'),
                            line: { color: '00b8ff' }
                        };
                        var trace2 = {
                            type: "scatter",
                            mode: "lines",
                            name: 'Minnehaha Creek',
                            x: unpack(row2, 'rounded_time'),
                            y: unpack(row2, 'level_ft'),
                            line: { color: '1034a6' }
                        };

                        var data = [trace1, trace2];
                        var layout = {
                            title: 'Streams',
                            yaxis: {
                                title: {
                                    text: 'feet'
                                }
                            }
                        };
                        Plotly.newPlot('myDiv', data, layout, {});
                    })
                })
