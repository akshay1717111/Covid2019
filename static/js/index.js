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
            country_name:[]
        },
        methods: {
            toggleSideBar: function () {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                };
            },

            revenue: function () {
                $("#loading").show();
                $.ajax({
                    url: "http://covid19.mathdro.id/api",
                    method: "GET",
                    // contentType: 'application/json',
                    dataType: "json"
                }).done(function (response) {
                    //this.add(response)
                    this.cards(response)
                    // google.charts.setOnLoadCallback(function () {
                    //     this.trend(response)
                    // }.bind(this));
                    $("#loading").hide();
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                });
            },
            revenue1: function () {
                $("#loading").show();
                $.ajax({
                    url: "https://covid19.mathdro.id/api/daily",
                    method: "GET",
                    // contentType: 'application/json',
                    dataType: "json"
                }).done(function (response) {
                this.graph(response)
                    $("#loading").hide();
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                });
            },
            revenue2: function () {
                $("#loading").show();
                $.ajax({
                    url: "https://covid19.mathdro.id/api/countries",
                    method: "GET",
                    // contentType: 'application/json',
                    dataType: "json"
                }).done(function (response) {
                    this.dropdown(response)
                    $("#loading").hide();
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                });
            },
            dropdown:function(box){
                var countries=[];
                 var mo = box.countries;
                 for(var i=0;i<mo.length;i++){
                    countries.push(mo[i].name);
                 }
                 this.country_name=countries;
            },
            myFunction:function(){
                var reports = document.getElementById("mySelect").value;
                console.log(reports)
            },
            lineChart:function(date,death){
                document.getElementById("chartarea_2").innerHTML = "<canvas id='canvas6'></canvas>";
                var ctx_2 = document.getElementById('canvas6').getContext("2d");
                var urChart = new Chart(ctx_2, {
                    type: "line",
                    data: {
                      labels: date,
                      datasets: [
                      {
                        label: "Deaths",
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: "#e74a3b",
                        pointBorderWidth: 2,
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: "#e74a3b",
                        data: death
                      }
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
            graph:function(daily){
                document.getElementById("chartarea_1").innerHTML = "<canvas id='canvas5'></canvas>";
                var ctx_1 = document.getElementById('canvas5').getContext("2d");
                // console.log(daily);
                var new_arr=[],new_arr1=[],new_arr2=[];
                for(var i=0;i<daily.length;i++){
                    new_arr.push(daily[i].reportDate)
                    new_arr1.push(daily[i].deaths.total)
                    new_arr2.push(daily[i].totalConfirmed)
                }
                this.lineChart(new_arr,new_arr2)
                var urChart = new Chart(ctx_1, {
                    type: "line",
                    data: {
                      labels: new_arr,
                      datasets: [
                      {
                        label: "ConfirmedCases",
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: "#f6c23e",
                        pointBorderWidth: 2,
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: "#f6c23e",
                        data: new_arr2
                      }
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
            formatNumber: function (num) {
                return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            },
            
            cards: function (data) {
                var dateObj = new Date();
                var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
                var date = ('0' + (dateObj.getDate() - 1)).slice(-2);
                var year = dateObj.getFullYear();
                var shortDate = month + '-' + date + '-' + year;
                // console.log(shortDate)
                // var obj = JSON.parse(data);
                $("#count0").html(this.formatNumber(data.confirmed.value))
                $("#count1").html(this.formatNumber(data.recovered.value))
                $("#count2").html(this.formatNumber(data.deaths.value))
            }
            // bass: function (a, b, c, d) {
            //     var tltp = "<strong>" + "App_Date:" + a + "</strong>" + "<br>" + "<strong>" + "CAD:" + b + "</strong>" + "<br>" + "<strong>" + "Loans:" + c + "</strong>" + "<br>" + "<strong>" + "Opened:" + d + "</strong>" + "<br>";
            //     return tltp;
            // },
            // trend: function (r_data) {
            //     date = [], count = [], pay = [],withdraw=[];
            //     for (var i = 0; i < r_data.length; i++) {
            //         date.push(r_data[i].App_Date)
            //         count.push(r_data[i].CAD)
            //         pay.push(r_data[i].Loans)
            //         withdraw.push(r_data[i].Opened)
            //     }
            //     date.reverse();
            //     count.reverse();
            //     pay.reverse();
            //     withdraw.reverse();
            //     var container = document.getElementById('linechart');
            //     var chart = new google.visualization.LineChart(container);
            //     var dataTable = new google.visualization.DataTable();
            //     dataTable.addColumn('string', 'Date');
            //     dataTable.addColumn('number', 'CAD');
            //     dataTable.addColumn({
            //         type: 'string',
            //         role: 'tooltip',
            //         p: {
            //             html: true
            //         }
            //     });
            //     var accounts = [];
            //     for (i = 0; i < count.length; i++) {
            //         accounts.push([date[i], count[i], this.bass(date[i], count[i], pay[i],withdraw[i])]);
            //     }
            //     dataTable.addRows(accounts);
            //     var chartHeight = '550';
            //     var options = {
            //          is3D: true,
            //         tooltip: {
            //                 isHtml: true
            //             },
            //         title: 'Tracker',
            //         hAxis: {title: 'Date',  titleTextStyle: {color: '#333'},
            //         slantedText:true, slantedTextAngle:40},
            //         explorer: {actions: ["dragToZoom", "rightClickToReset"]},
            //         legend: {position: "top"},
            //           pointSize: 10,
            //           pointShape: { type: 'triangle', rotation: 180 },
            //         vAxis: {
            //           title: 'CAD'
            //         },
            //         height: chartHeight,
            //                 width: '100%',
            //       };


            //     chart.draw(dataTable, options);
            // },
            // add: function (table_data) {
            //     let table = document.querySelector("table");
            //     let data = Object.keys(table_data[0]);
            //     this.generateTableHead(table, data);
            //     this.generateTable(table, table_data);
            // },
            // generateTable: function (table, data) {
            //     for (let element of data) {
            //         let row = table.insertRow();
            //         for (key in element) {
            //             let cell = row.insertCell();
            //             let text;
            //             text = document.createTextNode(element[key]);
            //             cell.appendChild(text);
            //         }
            //     }
            // },
            // generateTableHead: function (table, data) {
            //     let thead = table.createTHead();
            //     let row = thead.insertRow();
            //     for (let key of data) {
            //         let th = document.createElement("th");
            //         th.className = 'thead';
            //         let text = document.createTextNode(key);
            //         th.appendChild(text);
            //         row.appendChild(th);
            //     }
            // }
        },
        created: function () {
            this.revenue();
            this.revenue1();
            this.revenue2();
        },
        beforeCreate() {
        }
    });
});
