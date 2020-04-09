document.addEventListener('DOMContentLoaded', function () {
    google.charts.load("current", { packages: ["corechart", 'controls'] });

    new Vue({
        el: '#wrapper',
        delimiters: ['[[', ']]'],
        components: {
            navbar,
            topbar
        },
        data: {

        },
        methods: {
            toggleSideBar: function () {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                };
            },
            pan: function () {
                $("#loading").show();
                $.ajax({
                    url: "/api/pan",
                    method: "GET",
                    contentType: 'application/json',
                    dataType: "json"
                }).done(function (response) {
                    this.add(response.byWeek)
                    this.add1(response.failureByWeek)
                    google.charts.setOnLoadCallback(function () {
                        this.trend(response.panTrend)
                    }.bind(this));
                    // google.charts.setOnLoadCallback(function () {
                    //     this.graph1(response.failureByMonth)
                    // }.bind(this));
                    $("#loading").hide();
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                });
            },
            bass: function (a, b, c) {
                var tltp = "<strong>" + "Date:" + a + "</strong>" + "<br>" + "<strong>" + "Customers:" + b + "</strong>" + "<br>" + "<strong>" + "Diff:" + c + "</strong>" + "<br>";
                return tltp;
            },
            trend: function (r_data) {
                console.log(r_data)
                date = [], count = [], diff = []
                console.log(r_data);
                for (var i = 0; i < r_data.length; i++) {
                    date.push(r_data[i].date)
                    count.push(r_data[i].count)
                    diff.push(r_data[i].diff)
                }
                this.areagraph(date, count, diff)
                var container = document.getElementById('linechart');
                var chart = new google.visualization.AreaChart(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('string', 'Date');
                dataTable.addColumn('number', 'customerCount');
                dataTable.addColumn({
                    type: 'string',
                    role: 'tooltip',
                    p: {
                        html: true
                    }
                });
                var accounts = [];
                for (i = 0; i < count.length; i++) {
                    accounts.push([date[i], count[i], this.bass(date[i], count[i], diff[i])]);
                }
                dataTable.addRows(accounts);
                var chartHeight = '550';
                var options = {
                     is3D: true,
                    tooltip: {
                            isHtml: true
                        },
                    title: 'Ckyc Analysis',
                    hAxis: {title: 'Date',  titleTextStyle: {color: '#333'},
                    slantedText:true, slantedTextAngle:40},
                    explorer: {actions: ["dragToZoom", "rightClickToReset"]},
                    legend: {position: "top"},
                      pointSize: 10,
                      pointShape: { type: 'triangle', rotation: 180 },
                    vAxis: {
                      title: 'Ckyc Customers'
                    },
                    height: chartHeight,
                            width: '100%',
                  };
                   
            
                chart.draw(dataTable, options);
            },
            areagraph: function (date, count, diff) {
                console.log(date)
                document.getElementById("chartarea_2").innerHTML = "<canvas id='canvas21'></canvas>";
                var ctx7 = document.getElementById('canvas21').getContext("2d");
                var urChart = new Chart(ctx7, {
                    type: "bar",
                    data: {
                        labels: date,
                        datasets: [{
                            label: "Total Customers",
                            // pointRadius: 4,
                            // pointBackgroundColor: "rgba(255,255,255,1)",
                            // pointBorderWidth: 2,
                            // fill: false,
                            backgroundColor: "#4e73df",
                            // borderWidth: 2,
                            // borderColor: "#fdc506",
                            data: count
                        },
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: true
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    fontColor: "#8a909d", // this here
                                },
                            }],
                            yAxes: [{
                                ticks: {
                                    // callback: function(tick, index, array) {
                                    //   return (index % 2) ? "" : tick;
                                    // }
                                    fontColor: "#8a909d",
                                    fontFamily: "Roboto, sans-serif"
                                }
                            }]
                        },
                        tooltips: {
                            mode: "index",
                            intersect: false,
                            titleFontColor: "#888",
                            bodyFontColor: "#555",
                            titleFontSize: 12,
                            bodyFontSize: 15,
                            backgroundColor: "rgba(256,256,256,0.95)",
                            displayColors: true,
                            xPadding: 10,
                            yPadding: 7,
                            borderColor: "rgba(220, 220, 220, 0.9)",
                            borderWidth: 2,
                            caretSize: 6,
                            caretPadding: 5
                        }
                    }
                });
            },
            // graph: function (data1) {
            //     var data = new google.visualization.DataTable();
            //     data.addColumn('string', 'Month');
            //     accounts1 = [];
            //     years = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            //     var keys = [];
            //     for (var k in data1) {
            //         keys.push(parseInt(k));
            //         data.addColumn('number', k);
            //     }

            //     for (i = 0; i < 12; i++) {
            //         temp = []
            //         temp.push(years[i]);
            //         for (var l = 0; l < keys.length; l++) {

            //             // console.log(data1[keys[l]])
            //             // console.log(keys[l])
            //             // if i+1  in month:
            //             if (data1[keys[l]].month.includes(i + 1)) {
            //                 var s = data1[keys[l]].month.indexOf(i + 1)
            //                 temp.push(data1[keys[l]].Success[s])
            //             }
            //             else {
            //                 temp.push(0)
            //             }
            //         }
            //         accounts1.push(temp);

            //     }


            //     //   }
            //     console.log(accounts1)
            //     data.addRows(accounts1);
            //     var chartHeight = '650';
            //     var options = {
            //         title: 'NSDL Successdata',
            //         hAxis: {
            //             title: 'Year', titleTextStyle: { color: '#333' },
            //             slantedText: true, slantedTextAngle: 70
            //         },
            //         explorer: { actions: ["dragToZoom", "rightClickToReset"] },
            //         legend: { position: "top" },
            //         pointSize: 10,
            //         pointShape: { type: 'triangle', rotation: 180 },
            //         vAxis: {
            //             title: 'NSDL Successdata'
            //         },
            //         height: chartHeight,
            //         width: '100%',
            //     };

            //     var chart = new google.visualization.LineChart(document.getElementById('linechart'));
            //     chart.draw(data, options);
            //     var columns = [];
            //     var series = {};
            //     for (var i = 0; i < data.getNumberOfColumns(); i++) {
            //         columns.push(i);
            //         if (i > 0) {
            //             series[i - 1] = {};
            //         }
            //     }

            //     var options = {
            //         title: 'NSDL Successdata',
            //         hAxis: {
            //             title: 'Year', titleTextStyle: { color: '#333' },
            //             slantedText: true, slantedTextAngle: 70
            //         },
            //         explorer: { actions: ["dragToZoom", "rightClickToReset"] },
            //         legend: { position: "top" },
            //         pointSize: 10,
            //         pointShape: { type: 'triangle', rotation: 180 },
            //         vAxis: {
            //             title: 'Number Of Customers'
            //         },
            //         height: chartHeight,
            //         width: '100%',
            //         series: series
            //     }

            //     google.visualization.events.addListener(chart, 'select', function () {
            //         var sel = chart.getSelection();
            //         // if selection length is 0, we deselected an element
            //         if (sel.length > 0) {
            //             // if row is undefined, we clicked on the legend
            //             //if (typeof sel[0].row === 'undefined') {
            //             if (sel[0].row === null) {
            //                 var col = sel[0].column;
            //                 if (columns[col] == col) {
            //                     // hide the data series
            //                     columns[col] = {
            //                         label: data.getColumnLabel(col),
            //                         type: data.getColumnType(col),
            //                         calc: function () {
            //                             return null;
            //                         }
            //                     };

            //                     // grey out the legend entry
            //                     series[col - 1].color = '#CCCCCC';
            //                 }
            //                 else {
            //                     // show the data series
            //                     columns[col] = col;
            //                     series[col - 1].color = null;
            //                 }
            //                 var view = new google.visualization.DataView(data);
            //                 view.setColumns(columns);
            //                 chart.draw(view, options);
            //             }
            //         }
            //     });
            // },
            // graph1: function (data1) {
            //     var data = new google.visualization.DataTable();
            //     data.addColumn('string', 'Month');
            //     accounts1 = [];
            //     years = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            //     var keys = [];
            //     for (var k in data1) {
            //         keys.push(parseInt(k));
            //         data.addColumn('number', k);
            //     }

            //     for (i = 0; i < 12; i++) {
            //         temp = []
            //         temp.push(years[i]);
            //         for (var l = 0; l < keys.length; l++) {

            //             // console.log(data1[keys[l]])
            //             // console.log(keys[l])
            //             // if i+1  in month:
            //             if (data1[keys[l]].month.includes(i + 1)) {
            //                 var s = data1[keys[l]].month.indexOf(i + 1)
            //                 temp.push(data1[keys[l]].Failed[s])
            //             }
            //             else {
            //                 temp.push(0)
            //             }
            //         }
            //         accounts1.push(temp);

            //     }


            //     //   }
            //     console.log(accounts1)
            //     data.addRows(accounts1);
            //     var chartHeight = '650';
            //     var options = {
            //         title: 'NSDL FailedData',
            //         hAxis: {
            //             title: 'Year', titleTextStyle: { color: '#333' },
            //             slantedText: true, slantedTextAngle: 70
            //         },
            //         explorer: { actions: ["dragToZoom", "rightClickToReset"] },
            //         legend: { position: "top" },
            //         pointSize: 10,
            //         pointShape: { type: 'triangle', rotation: 180 },
            //         vAxis: {
            //             title: 'NSDL FailedData'
            //         },
            //         height: chartHeight,
            //         width: '100%',
            //     };

            //     var chart = new google.visualization.LineChart(document.getElementById('linechart1'));
            //     chart.draw(data, options);
            //     var columns = [];
            //     var series = {};
            //     for (var i = 0; i < data.getNumberOfColumns(); i++) {
            //         columns.push(i);
            //         if (i > 0) {
            //             series[i - 1] = {};
            //         }
            //     }

            //     var options = {
            //         title: 'NSDL FailedData',
            //         hAxis: {
            //             title: 'Year', titleTextStyle: { color: '#333' },
            //             slantedText: true, slantedTextAngle: 70
            //         },
            //         explorer: { actions: ["dragToZoom", "rightClickToReset"] },
            //         legend: { position: "top" },
            //         pointSize: 10,
            //         pointShape: { type: 'triangle', rotation: 180 },
            //         vAxis: {
            //             title: 'Number Of Customers'
            //         },
            //         height: chartHeight,
            //         width: '100%',
            //         series: series
            //     }

            //     google.visualization.events.addListener(chart, 'select', function () {
            //         var sel = chart.getSelection();
            //         // if selection length is 0, we deselected an element
            //         if (sel.length > 0) {
            //             // if row is undefined, we clicked on the legend
            //             //if (typeof sel[0].row === 'undefined') {
            //             if (sel[0].row === null) {
            //                 var col = sel[0].column;
            //                 if (columns[col] == col) {
            //                     // hide the data series
            //                     columns[col] = {
            //                         label: data.getColumnLabel(col),
            //                         type: data.getColumnType(col),
            //                         calc: function () {
            //                             return null;
            //                         }
            //                     };

            //                     // grey out the legend entry
            //                     series[col - 1].color = '#CCCCCC';
            //                 }
            //                 else {
            //                     // show the data series
            //                     columns[col] = col;
            //                     series[col - 1].color = null;
            //                 }
            //                 var view = new google.visualization.DataView(data);
            //                 view.setColumns(columns);
            //                 chart.draw(view, options);
            //             }
            //         }
            //     });
            // },
            add: function (table_data) {
                let table = document.querySelector("table");
                let data = Object.keys(table_data[0]);
                this.generateTableHead(table, data);
                this.generateTable(table, table_data);
            },
            add1: function (table_data) {
                var table = document.getElementById("table1");

                let data = Object.keys(table_data[0]);
                this.generateTableHead(table, data);
                this.generateTable(table, table_data);
            },
            generateTable: function (table, data) {
                for (let element of data) {
                    let row = table.insertRow();
                    for (key in element) {
                        let cell = row.insertCell();
                        let text;
                        text = document.createTextNode(element[key]);
                        cell.appendChild(text);
                    }
                }
            },
            generateTableHead: function (table, data) {
                let thead = table.createTHead();
                let row = thead.insertRow();
                for (let key of data) {
                    let th = document.createElement("th");
                    th.className = 'thead';
                    let text = document.createTextNode(key);
                    th.appendChild(text);
                    row.appendChild(th);
                }
            }
        },
        created: function () {
            this.pan();
        },
        beforeCreate() {
        }
    });
});
