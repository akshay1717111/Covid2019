document.addEventListener("DOMContentLoaded", function () {

  google.charts.load('current', {
    packages: ['corechart']
  });

  new Vue({
    el: '#wrapper',
    delimeters: ['[[', ']]'],
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
      createTableHeaders: function (data1, headers) {
        var c = 0;
        var htmltext = "";
        for (i in data1) {
          htmltext += "<th style='position: sticky; top: -1px;background: #4e73df'><strong style='color: blanchedalmond;'>" +
            data1[i] +
            "</strong></th>";
        }
        document.getElementById(headers).innerHTML = htmltext;
        htmltext = "";
      },
      createTableRows: function (data2, tbody) {
        var c = 0;
        var htmltext = "";
        htmltext += "<tr>"
        var count1 = Object.keys(data2).length;
        for (var j = 0; j < data2[0].length; j++) {
          for (var i = 0; i < count1; i++) {
            htmltext += "<td>" +
              (data2[i][j]) +
              "</td>";
          }
          htmltext += "</tr>"
        }
        document.getElementById(tbody).innerHTML = htmltext;
        htmltext = "";
      },
      apr_chart: function (random) {
        document.getElementById("chartarea_1").innerHTML = "<canvas id='canvas5'></canvas>";
        var ctx_1 = document.getElementById('canvas5').getContext("2d");
        var fa = random.data[0];
        var handle = random.data[4];
        var handle1 = random.data[9];
        var new_c=[],new_d=[];
        for(var i=0;i<handle.length;i++){
          new_c.push(handle[i].slice(0,-1))
          new_d.push(handle1[i].slice(0,-1))
        }
        console.log(new_c)
        console.log(new_d)
        var urChart = new Chart(ctx_1, {
          type: "line",
          data: {
            labels: fa,
            datasets: [{
              label: "EBV Success/EBV Attempted (%)",
              pointRadius: 4,
              pointBackgroundColor: "rgba(255,255,255,1)",
              pointBorderWidth: 2,
              fill: false,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#fdc506",
              data: new_c
            },
            {
              label: "Auto-approvals /Approvals with EBV (%)",
              fill: false,
              pointRadius: 4,
              pointBackgroundColor: "rgba(255,255,255,1)",
              pointBorderWidth: 2,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#4c84ff",
              data: new_d
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
      drawChart: function (data1) {
        $('#loading').hide();
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Customer_Ap');
        data.addColumn('number', 'Customer_Ap_ebvsucc');
        data.addColumn('number', 'Customer_Autoapprove');
        accounts1 = [];

        for (i = 0; i < data1.data[0].length; i++) {
          accounts1.push([data1.data[0][i].substr(0, 17), data1.data[5][i], data1.data[6][i], data1.data[8][i]]);
        }

        data.addRows(accounts1);
        var chartHeight = '650';
        var options = {
          title: 'EBV',
          isStacked: true,
          hAxis: {
            title: 'Date',
            viewWindow: {
              min: [40, 30, 40],
              max: [40, 30, 40]
            }
          },
          explorer: {
            actions: ["dragToZoom", "rightClickToReset"]
          },
          legend: {
            position: "top"
          },
          vAxis: {
            title: 'Customer count'
          },
          height: chartHeight,
          width: '100%',
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        var columns = [];
        var series = {};
        for (var i = 0; i < data.getNumberOfColumns(); i++) {
          columns.push(i);
          if (i > 0) {
            series[i - 1] = {};
          }
        }

        var options = {
          title: 'Customer History',
          isStacked: true,
          hAxis: {
            title: 'Date',
            viewWindow: {
              min: [40, 30, 40],
              max: [40, 30, 40]
            }
          },
          explorer: {
            actions: ["dragToZoom", "rightClickToReset"]
          },
          legend: {
            position: "top"
          },
          vAxis: {
            title: 'Customer count'
          },
          height: chartHeight,
          width: '100%',
          series: series
        }
        google.visualization.events.addListener(chart, 'select', function () {
          var sel = chart.getSelection();
          // if selection length is 0, we deselected an element
          if (sel.length > 0) {
            // if row is undefined, we clicked on the legend
            //if (typeof sel[0].row === 'undefined') {
            if (sel[0].row === null) {
              var col = sel[0].column;
              if (columns[col] == col) {
                // hide the data series
                columns[col] = {
                  label: data.getColumnLabel(col),
                  type: data.getColumnType(col),
                  calc: function () {
                    return null;
                  }
                };

                // grey out the legend entry
                series[col - 1].color = '#CCCCCC';
              } else {
                // show the data series
                columns[col] = col;
                series[col - 1].color = null;
              }
              var view = new google.visualization.DataView(data);
              view.setColumns(columns);
              chart.draw(view, options);
            }
          }
        });
      }
    },
    created: function () {
      $('#loading').show();
      axios({
        url: "/api/ebv",
        method: "POST",
        contentType: 'application/json',
        dataType: "json"
      }).then(function (response) {
        var headers = "headers";
        var tbody = "tbody";
        this.createTableHeaders(response.data["headers"], headers);
        this.createTableRows(response.data["data"], tbody);
        this.apr_chart(response.data);
        google.charts.setOnLoadCallback(function () {
          this.drawChart(response.data);
        }.bind(this));
        // $(window).resize(function () {
        //   this.drawChart(response.data);
        // }.bind(this));
      }.bind(this)).catch(function (error) {
        document.getElementById("tbody").innerHTML = "Server-Error";
        document.getElementById("headers").innerHTML = "Server-Error";
        document.getElementById("chart_div").innerHTML = "Server-Error";
        document.getElementById("chartarea_1").innerHTML = "Server-Error";
      });
      axios({
        url: "/api/ebv1",
        method: "POST",
        contentType: 'application/json',
        dataType: "json"
      }).then(function (response) {
        var headers = "headers1";
        var tbody = "tbody1";
        this.createTableHeaders(response.data["headers"], headers);
        this.createTableRows(response.data["data"], tbody);
      }.bind(this)).catch(function (error) {
        document.getElementById("tbody1").innerHTML = "Server-Error";
        document.getElementById("headers1").innerHTML = "Server-Error";

      });

      axios({
        url: "/api/ebv2",
        method: "POST",
        contentType: 'application/json',
        dataType: "json"
      }).then(function (response) {
        var headers = "headers2";
        var tbody = "tbody2";
        this.createTableHeaders(response.data["headers"], headers);
        this.createTableRows(response.data["data"], tbody);
      }.bind(this)).catch(function (error) {
        document.getElementById("tbody2").innerHTML = "Server-Error";
        document.getElementById("headers2").innerHTML = "Server-Error";
      });

      axios({
        url: "/api/ebv3",
        method: "POST",
        contentType: 'application/json',
        dataType: "json"
      }).then(function (response) {
        var headers = "headers3";
        var tbody = "tbody3";
        this.createTableHeaders(response.data["headers"], headers);
        this.createTableRows(response.data["data"], tbody);
      }.bind(this)).catch(function (error) {
        document.getElementById("tbody3").innerHTML = "Server-Error";
        document.getElementById("headers3").innerHTML = "Server-Error";

      });

    }
  });

});