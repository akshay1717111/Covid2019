document.addEventListener('DOMContentLoaded', function () {
  google.charts.load("current", { packages: ["corechart", 'controls'] });

  new Vue({
    el: '#wrapper',
    delimiters: ['[[', ']]'],
    components: {
      // navbar,
      // topbar
    },
    data: {
      country_name: []
    },
    methods: {
      // toggleSideBar: function () {
      //     $("body").toggleClass("sidebar-toggled");
      //     $(".sidebar").toggleClass("toggled");
      //     if ($(".sidebar").hasClass("toggled")) {
      //         $('.sidebar .collapse').collapse('hide');
      //     };
      // },

      revenue: function () {
        $("#loading").show();
        $.ajax({
          url: 'https://api.thevirustracker.com/free-api?global=stats',
          dataType: 'json',
          success: function (data) {
            this.cards(data)
            $("#loading").hide();
          }.bind(this)
        });
      },
      revenue1: function () {
        // $("#loading").show();
        $.ajax({
          url: "https://covid19.mathdro.id/api/daily",
          method: "GET",
          // contentType: 'application/json',
          dataType: "json"
        }).done(function (response) {
          this.graph(response)

        }.bind(this)).fail(function (error) {
          console.log(error);
          $("#loading").hide();
        });
      },
      revenue2: function () {
        // $("#loading").show();
        $.ajax({
          url: "https://v1.api.covindia.com/states-affected-numbers",
          method: "GET"
        }).done(function (response) {
          google.charts.setOnLoadCallback(function () {
            this.generateindia(response);
          }.bind(this));
          $(window).resize(function () {
            this.generateindia(response);
          }.bind(this));
        }.bind(this)).fail(function (err) {
          console.log(err);
        });
      },
      revenue3: function () {
        $.ajax({
          url: 'https://api.thevirustracker.com/free-api?countryTotals=ALL',
          dataType: 'json',
          success: function (data) {
            this.add(data);
          }.bind(this)
        });
      },
      revenue4: function () {
        // $("#loading").show();
        $.ajax({
          url: "https://v1.api.covindia.com/general",
          method: "GET"
        }).done(function (response) {
          console.log(response)
          $("#count8").html(this.formatNumber(response.deathTotal))
          $("#count9").html(this.formatNumber(response.infectedTotal))
          $("#count10").html(this.formatNumber(response.totalCured))
          $("#count11").html((response.lastUpdatedTime).substr(0, 19))
        }.bind(this)).fail(function (err) {
          console.log(err);
        });
      },
      generateindia: function (values) {
        var data = google.visualization.arrayToDataTable([]);
        data.addColumn('string', 'Label');
        data.addColumn('number', 'noof_cases');
        data.addColumn({
          type: 'string',
          role: 'tooltip',
          p: {
            html: true
          }
        });
        d = {}
        for (var i in values) {
          if (values[i] != 0) {
            d[i] = {
              "district": i,
              "no_of_cases": values[i],
              "tooltip": 'Affected cases:' + values[i]
            }
          }
        }
        d['Andhra Pradesh']['no_of_cases'] = d['Andhra Pradesh']['no_of_cases'] + values['Telangana']
        d['Andhra Pradesh']['tooltip'] = 'Affected cases AP: ' + values['Andhra Pradesh'] + ",Affected cases TS: " + values['Telangana']

        var ab = [],
          cd = [],
          fg = [];
        for (i in d) {
          ab.push(d[i].district)
          cd.push(d[i].no_of_cases)
          fg.push(d[i].tooltip)
        }

        var fin = [];
        for (i = 0; i < ab.length; i++) {
          fin.push([ab[i], cd[i], fg[i]])
        }

        var opts = {
          title: "Corona cases",
          titleStyle: {
            fontSize: 20,
            position: "right"
          },
          region: 'IN',
          backgroundColor: '#ffffff',
          displayMode: 'regions',
          resolution: 'provinces',
          dataMode: 'markers',
          datalessRegionColor: 'ash',
          colorAxis: {
            colors: ['#dbbcba', '#c97671', '#f22216'],
          },
          // width: 450,
          // height: 450,
          strokeColor: '#a8a0a0',
          strokeWeight: 2,
          scale: 1,
        };
        data.addRows(fin);
        var geochart = new google.visualization.GeoChart(document.getElementById('visualization1'));
        geochart.draw(data, opts);
      },
      dropdown: function (box) {
        var countries = [];
        var mo = box.countries;
        for (var i = 0; i < mo.length; i++) {
          countries.push(mo[i].name);
        }
        this.country_name = countries;
      },
      myFunction: function () {
        var reports = document.getElementById("mySelect").value;
        console.log(reports)
      },
      lineChart: function (date, death) {
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
      graph: function (daily) {
        document.getElementById("chartarea_1").innerHTML = "<canvas id='canvas5'></canvas>";
        var ctx_1 = document.getElementById('canvas5').getContext("2d");
        // console.log(daily);
        var new_arr = [], new_arr1 = [], new_arr2 = [];
        for (var i = 0; i < daily.length; i++) {
          new_arr.push(daily[i].reportDate)
          new_arr1.push(daily[i].deaths.total)
          new_arr2.push(daily[i].totalConfirmed)
        }
        this.lineChart(new_arr, new_arr1)
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
        // var dateObj = new Date();
        // var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        // var date = ('0' + (dateObj.getDate() - 1)).slice(-2);
        // var year = dateObj.getFullYear();
        // var shortDate = month + '-' + date + '-' + year;
        // // var obj = JSON.parse(data);
        $("#count0").html(this.formatNumber(data.results[0].total_cases))
        $("#count1").html(this.formatNumber(data.results[0].total_recovered))
        $("#count2").html(this.formatNumber(data.results[0].total_deaths))
        $("#count3").html(this.formatNumber(data.results[0].total_active_cases))
        $("#count4").html(this.formatNumber(data.results[0].total_new_cases_today))
        $("#count5").html(this.formatNumber(data.results[0].total_new_deaths_today))
        $("#count6").html(this.formatNumber(data.results[0].total_serious_cases))
        $("#count7").html(this.formatNumber(data.results[0].total_affected_countries))

      },
      add: function (table_data) {
        var c = table_data.countryitems[0];
        const dateRangeData = Object.keys(c).map(key => c[key]);
        let table = document.querySelector("table");
        let data = Object.keys(dateRangeData[0]);
        this.generateTableHead(table, data);
        this.generateTable(table, dateRangeData);
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
      },
    },
    created: function () {
      this.revenue();
      this.revenue1();
      this.revenue2();
      this.revenue3();
      this.revenue4();
    },
    beforeCreate() {
    }
  });
});
