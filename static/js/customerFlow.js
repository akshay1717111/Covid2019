document.addEventListener('DOMContentLoaded', function () {

  google.charts.load('current', {
    packages: ['corechart']
  });

  new Vue({
    el: '#wrapper',
    delimiters: ['[[', ']]'],
    components: {
      navbar,
      topbar,
    },
    data: {
      main_arr: []
    },
    methods: {
      get_data: function () {
        $('#loading').show();
        axios({
          url: "/api/new/customerFlow",
          method: "POST",
          contentType: 'application/json',
          dataType: "json"
        }).then(function (response) {
          $('#loading').hide();
          this.dy_data(response)
        }.bind(this)).catch(function (error) {
          $('#loading').hide();
          $("tbody").text('Server-Error')
          $("headers").text('Server-Error')
          $("headers1").text('Server-Error')
          $("tbody1").text('Server-Error')
          $("chartarea_1").text('Server-Error')
        });
      },
      toggleSideBar: function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      },
      dy_data: function (response) {
        var arr1 = [];
        var arr2 = [];
        for (var k = 0; k < response.data["data"][0].length; k++) {
          var kl = [];
          for (var l = 0; l < response.data["headers"].length; l++) {
            kl.push(response.data["data"][l][k]);

          }
          if ((kl[0].toString()).includes('-')) {
            arr2.push(kl);
          }
          else {
            arr1.push(kl);
          }
        }
        this.createTableHeaders(response.data["headers"]);

        this.createTableRows(arr1);

        google.charts.setOnLoadCallback(

          //this.apr_chart2(arr1)
        );
        var reports1 = document.getElementById("mySelect").value;
        this.createTableHeaders1(response.data["headers"]);

        this.createTableRows1(arr2, reports1);
        this.apr_chart(arr2, reports1)
        this.main_arr = arr2;
      },
      myFunction: function () {
        var reports = document.getElementById("mySelect").value;
        var data = this.main_arr;
        this.createTableRows1(data, reports)
        this.apr_chart(data, reports)

      },
      createTableHeaders1: function (data1) {
        var c = 0;
        var htmltext = "";
        for (var i = 0; i < data1.length - 1; i++) {
          htmltext += "<th style='position: sticky; top: -1px;background: #4e73df'><strong style='color: blanchedalmond;'>" +
            data1[i] +
            "</strong></th>";
        }
        document.getElementById("headers1").innerHTML = htmltext;
        htmltext = "";
      },
      createTableRows1: function (data2, Rep) {
        var c = 0;
        var htmltext = "";
        htmltext += "<tr>"
        var count1 = Object.keys(data2).length;
        for (var j = 0; j < data2.length; j++) {
          if (data2[j][0].includes(Rep + '-')) {
            for (var i = 0; i < data2[0].length - 1; i++) {
              htmltext += "<td>" +
                (data2[j][i]) +
                "</td>";
            }
          }
          htmltext += "</tr>"
        }
        document.getElementById("tbody1").innerHTML = htmltext;
        htmltext = "";
      },
      downloadreport: function () {
        var filename = "customerflow_ebv" + ".csv";
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        for (var i = 0; i < rows.length; i++) {
          var row = [], cols = rows[i].querySelectorAll("td, th");
          for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
          csv.push(row.join(","));
        }
        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
      },
      downloadCSV: function (csv, filename) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], { type: "text/csv" });

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
      },
      createTableHeaders: function (data1) {
        var c = 0;
        var htmltext = "";
        for (var i = 0; i < data1.length - 1; i++) {
          htmltext += "<th style='position: sticky; top: -1px;background: #4e73df'><strong style='color: blanchedalmond;'>" +
            data1[i] +
            "</strong></th>";
        }
        document.getElementById("headers").innerHTML = htmltext;
        htmltext = "";
      },
      createTableRows: function (data2) {
        var c = 0;
        var htmltext = "";
        htmltext += "<tr>"
        var count1 = Object.keys(data2).length;
        for (var j = 0; j < data2.length; j++) {
          if (data2[j][0] == 'app') {
            htmltext += "<tr style='background-color: lightgray; color: black;'>";
          }
          else if (data2[j][0] == '1') {
            htmltext += "<tr style='background-color: lightblue; color: black;'>";
          }
          else if (data2[j][0] == '3') {
            htmltext += "<tr style='background-color: lightpink; color: black;'>";
          }
          else if (data2[j][0] == 'overall') {
            htmltext += "<tr style='background-color: lightgreen; color: black;'>";
          }
          else {
            htmltext += "<tr>";
          }
          for (var i = 0; i < data2[0].length - 1; i++) {
            htmltext += "<td>" +
              (data2[j][i]) +
              "</td>";
          }
          htmltext += "</tr>"
        }
        document.getElementById("tbody").innerHTML = htmltext;
        htmltext = "";
      },
      apr_chart: function (data, reports) {
        var new_arr = [];
        var new1 = [];
        var new2 = [];
        var new3 = [];
        for (var j = 0; j < data.length; j++) {
          if (data[j][0].includes(reports + '-')) {
            new_arr.push(data[j][0])
            new1.push(data[j][6].toString().substr(0, 2))
            new2.push(data[j][7].toString().substr(0, 2))
            new3.push(data[j][8].toString().substr(0, 2))
          }
        }
        document.getElementById('name').innerHTML = reports;
        document.getElementById("chartarea_1").innerHTML = "<canvas id='canvas5'></canvas>";
        var ctx_1 = document.getElementById('canvas5').getContext("2d");
        var urChart = new Chart(ctx_1, {
          type: "line",
          data: {
            labels: new_arr,
            datasets: [{
              label: "EBV_Attempted/Total(%)",
              pointRadius: 4,
              pointBackgroundColor: "rgba(255,255,255,1)",
              pointBorderWidth: 2,
              fill: false,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#fdc506",
              data: new1
            },
            {
              label: "EBV_Success(%)",
              fill: false,
              pointRadius: 4,
              pointBackgroundColor: "rgba(255,255,255,1)",
              pointBorderWidth: 2,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#4c84ff",
              data: new2
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
      apr_chart2: function (data) {
        console.log(data)
        var new_arr = [];
        var new1 = [];

        for (var j = 0; j < data.length; j++) {

          new_arr.push(data[j][1])
          new1.push(data[j][6].toString().slice(0, -1))

        }
        console.log(new_arr)
        console.log(new1)
        data.addColumn('string', 'Month');
        accounts1 = [];
        years = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var keys = [];
        for (var k in data1) {
          keys.push(parseInt(k));
          data.addColumn('number', k);
        }

        for (i = 0; i < 12; i++) {
          temp = []
          temp.push(years[i]);
          for (var l = 0; l < keys.length; l++) {

            console.log(data1[keys[l]])
            // console.log(keys[l])
            // if i+1  in month:
            if (data1[keys[l]].month.includes(i + 1)) {
              var s = data1[keys[l]].month.indexOf(i + 1)
              temp.push(data1[keys[l]].Success[s])
            }
            else {
              temp.push(0)
            }
          }
          accounts1.push(temp);

        }


        //   }
        console.log(accounts1)
        data.addRows(accounts1);
        var chartHeight = '650';
        var options = {
          title: 'NSDL Successdata',
          hAxis: {
            title: 'Year', titleTextStyle: { color: '#333' },
            slantedText: true, slantedTextAngle: 70
          },
          explorer: { actions: ["dragToZoom", "rightClickToReset"] },
          legend: { position: "top" },
          pointSize: 10,
          pointShape: { type: 'triangle', rotation: 180 },
          vAxis: {
            title: 'NSDL Successdata'
          },
          height: chartHeight,
          width: '100%',
        };

        var chart = new google.visualization.LineChart(document.getElementById('chartarea_new'));
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
          title: 'NSDL Successdata',
          hAxis: {
            title: 'Year', titleTextStyle: { color: '#333' },
            slantedText: true, slantedTextAngle: 70
          },
          explorer: { actions: ["dragToZoom", "rightClickToReset"] },
          legend: { position: "top" },
          pointSize: 10,
          pointShape: { type: 'triangle', rotation: 180 },
          vAxis: {
            title: 'Number Of Customers'
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
              }
              else {
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
        // document.getElementById("chartarea_new").innerHTML = "<canvas id='canvas6'></canvas>";
        // var ctx7 = document.getElementById('canvas6').getContext("2d");
        // var urChart = new Chart(ctx7, {
        //   type: "line",
        //   data: {
        //     labels: new_arr,
        //     datasets: [{
        //       label: "EBV_Attempted/Total(%)",
        //       pointRadius: 4,
        //       pointBackgroundColor: "rgba(255,255,255,1)",
        //       pointBorderWidth: 2,
        //       fill: false,
        //       backgroundColor: "transparent",
        //       borderWidth: 2,
        //       borderColor: "#fdc506",
        //       data: new1
        //     },
        //     ]
        //   },
        //   options: {
        //     responsive: true,
        //     maintainAspectRatio: false,
        //     legend: {
        //       display: true
        //     },
        //     scales: {
        //       xAxes: [{
        //         gridLines: {
        //           display: false,
        //         },
        //         ticks: {
        //           fontColor: "#8a909d", // this here
        //         },
        //       }],
        //       yAxes: [{
        //         ticks: {
        //           // callback: function(tick, index, array) {
        //           //   return (index % 2) ? "" : tick;
        //           // }
        //           fontColor: "#8a909d",
        //           fontFamily: "Roboto, sans-serif"
        //         }
        //       }]
        //     },
        //     tooltips: {
        //       mode: "index",
        //       intersect: false,
        //       titleFontColor: "#888",
        //       bodyFontColor: "#555",
        //       titleFontSize: 12,
        //       bodyFontSize: 15,
        //       backgroundColor: "rgba(256,256,256,0.95)",
        //       displayColors: true,
        //       xPadding: 10,
        //       yPadding: 7,
        //       borderColor: "rgba(220, 220, 220, 0.9)",
        //       borderWidth: 2,
        //       caretSize: 6,
        //       caretPadding: 5
        //     }
        //   }
        // });
      },
    },
    created: function () {
      this.get_data();
    }
  });
});
