document.addEventListener('DOMContentLoaded', function () {
  google.charts.load('current', {
    'packages': ['timeline', 'corechart']
  });

  new Vue({
    el: '#wrapper',
    delimeters: ['[[', ']]'],
    components: {
      navbar,
      topbar
    },
    data: {
      raw: "",
      began: new Date().toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10)
    },
    methods: {
      toggleSideBar: function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      },
      myFunctionOnLoad: function () {
        $('#loading').show();
        var c = {
          "StartDate": this.began,
          'EndDate': this.end
        }
        $.ajax({
          url: "/agent_login_history",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(c),
          dataType: "json"
        }).done(function (response) {
          $('#loading').hide();
          r_data = response;
          google.charts.setOnLoadCallback(function () {
            this.drawChart(r_data.agentLoginHistory)
          }.bind(this));
          $(window).resize(function () {
            this.drawChart(r_data.agentLoginHistory)
          }.bind(this));
          google.charts.setOnLoadCallback(function () {
            this.drawChart1(r_data.crmDataDict)
          }.bind(this));
          this.addduration(r_data.agentLoginHistory)
          document.getElementById('Duration').innerHTML = this.began + "<i class='fa fa-check-circle'></i>";
        }.bind(this)).fail(function (error) {
          $('#loading').hide();
          document.getElementById("timeline1").innerHTML = "Server-Error";
          document.getElementById("chartarea_2").innerHTML = "Server-Error";
          document.getElementById("chartarea_1").innerHTML = "Server-Error";
        });
        setTimeout(function () { this.myFunctionOnLoad() }.bind(this), 420000)
      },
      getDuration: function (a) {
        var v = parseInt(a.substr(6, 2)) / 3600;
        var f = parseInt(a.substr(3, 2)) / 60;
        var c = parseInt(a.substr(0, 2));
        return v + f + c;
      },
      drawChart1: function (insert) {
        var container = document.getElementById("bar_google");
        var chart = new google.visualization.ColumnChart(container);
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'TotalCalls');
        var m1 = {}
        for (var i = 0; i < insert.AgentName.length; i++) {
          //var a = i.toString();
          m1[i] = {
            'name': insert.AgentName[i],
            'total': insert.CallNo[i]
          };
        }
        var vix1 = [],
          jobname1 = [];
        for (var i in m1) {
          vix1.push(m1[i].name);
          jobname1.push(m1[i].total);
        }
        var accounts1 = [];
        //Pushing data as rows into accounts array
        for (i = 0; i < jobname1.length; i++) {
          accounts1.push([vix1[i], jobname1[i]]);
        }
        data.addRows(accounts1);
        var view = new google.visualization.DataView(data);
        var options = {
          title: "CRM DATA",
          hAxis: {
            title: 'Agent Name', titleTextStyle: { color: '#333' },
            slantedText: true, slantedTextAngle: 70,
            titleTextStyle: { bold: 'true' }
          },
          vAxis: {
            title: 'Number of calls',
            titleTextStyle: { bold: 'true' },

          },
          width: '150%',
          height: 700,
          bar: {
            groupWidth: "200%"
          },
          legend: { position: "top" },
        };

        google.visualization.events.addListener(chart, 'select', function () {
          selection = chart.getSelection();
          if (selection.length > 0) {
            this.dynamic_table(data.getValue(selection[0].row, 0))
          }
        }.bind(this));
        chart.draw(view, options);
      },
      dynamic_table: function (names) {
        document.getElementById("myModalLabel3").innerHTML = names;
        var s = {
          'AgentName': names,
          'StartDate': this.began,
          'EndDate': this.end
        };
        console.log(s);
        $.ajax({
          url: "/crm_data",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(s),
          dataType: "json"
        }).done(function (response) {
          this.modal_bardata(response);
        }.bind(this)).fail(function (error) {
          console.log("check your connection or url" + error)
        });
      },
      modal_bardata: function (ds) {
        document.getElementById('total_time').innerHTML = ds.TalkTime;
        document.getElementById('total_call').innerHTML = ds.TotalCalls;
        var h = '';
        var c = ds.BatchName;
        var e = ds.Disposition;
        for (let i = 0; i < e.Disposition.length; i++) {
          h += i + 1 + "." + "<b>" + e.Disposition[i] + "&nbsp;" + '(' + e.counts[i] + ')' + "</b>" + "<br>";
        }
        document.getElementById('disposition').innerHTML = h;

        h = '';
        for (let i = 0; i < c.BatchName.length; i++) {
          h += i + 1 + "." + "<b>" + c.BatchName[i] + "&nbsp;" + '(' + c.counts[i] + ')' + "</b>" + "<br>";
        }
        document.getElementById('Batches').innerHTML = h;
        $('#myModal_timeline').modal('show');
      },
      bass: function (jobname, vix, starttime, endtime) {
        var tltp = "<b class='font-size:24px'>" + "AgentName:"+ jobname + "</b>" + "<br>" + "<strong>" + vix + "</strong>" + "<br>" +"Starttime:"+starttime.toString().substr(0, 24) + "<br>" + "Endtime:"+endtime.toString().substr(0, 24);
        return tltp;
      },
      drawChart: function (r_data) {
        var container = document.getElementById('timeline1');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'string', id: 'President' });
        dataTable.addColumn({ type: 'string', id: 'dummy bar label' });
        dataTable.addColumn({
          type: 'string',
          role: 'tooltip',
          p: {
            html: true
          }
        });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });
        var m = {};
        for (var i = 0; i < r_data.AgentId.length; i++) {
          //var a = i.toString();
          m[i] = {
            'AgentId': r_data.AgentId[i],
            'StartTime': r_data.StartTime[i],
            'EndTime': r_data.EndTime[i],
            'BreakTime': r_data.BreakTime[i],
            'Lunch': r_data.Lunch[i],
            "BlockTime": r_data.BlockTime[i],
            'Duration': r_data.Duration[i]
          };
        }
        var jobname = [], starttime = [], endtime = [], vix = [];
        for (var i in m) {
          if (m[i].EndTime != "" && m[i].StartTime != "None") {
            jobname.push(m[i].AgentId)
            vix.push("DT:" + m[i].Duration + "(hours)" + " , " + "BrT:" + m[i].BreakTime + " , " + "LT:" + m[i].Lunch + " , " + "BlT:" + m[i].BlockTime)
            starttime.push(new Date(m[i].StartTime));
            endtime.push(new Date(m[i].EndTime));
          }
        }

        var accounts = [];
        //Pushing data as rows into accounts array
        for (i = 0; i < jobname.length; i++) {
          accounts.push([jobname[i].toString(), vix[i], this.bass(jobname[i], vix[i], starttime[i], endtime[i]), starttime[i], endtime[i]]);
        }
        dataTable.addRows(accounts);
        var chartHeight = '480';
        var options = {
          gridlines: {
            color: '#1E4D6B'
          },
          avoidOverlappingGridLines: true,
          legend: 'none',
          timeline1: {
            // showRowLabels: true,
            // colorByRowLabel: false,
            rowLabelStyle: {
              fontSize: 14,
              color: '#603913'
            },
            barLabelStyle: {
              fontSize: 13,
            },
            groupByRowLabel: true,
            legend: 'none',
            is3D: true,
            tooltip: {
              isHtml: true
            }
          },
          height: chartHeight,
          width: '100%',
        };
        chart.draw(dataTable, options);
      },
      newDuration: function (c) {
        var f = (c.substr(3, 2))
        var c = (c.substr(0, 2));
        var aa = parseFloat(c + "." + f);
        return aa;
      },
      addduration: function (r_data) {
        document.getElementById("chartarea_2").innerHTML = "<canvas id='canvas21'></canvas>";
        var ctx7 = document.getElementById('canvas21').getContext("2d");
        var a = r_data.AgentId;
        var oldArray = r_data.Duration;
        var x1 = r_data.Lunch;
        var x3 = r_data.BlockTime;
        var x5 = r_data.BreakTime;
        var newArray = [];
        var x2 = [];
        var x4 = [];
        var x6 = [];
        var check = [];
        console.log(oldArray);
        for (var i = 0; i < oldArray.length; i++) {
          check[i] = (this.newDuration(oldArray[i]));
          newArray[i] = (this.newDuration(oldArray[i]));
          x2[i] = (this.newDuration(x1[i]));
          x4[i] = (this.newDuration(x3[i]));
          x6[i] = (this.newDuration(x5[i]));
        }
        var urChart = new Chart(ctx7, {
          type: "line",
          data: {
            labels: a,
            datasets: [{
              label: "Duration",
              backgroundColor: "transparent",
              borderColor: "green",
              data: newArray
            },
            {
              label: "breaktime",
              backgroundColor: "transparent",
              borderColor: "orange",
              data: x6
            },
            {
              label: "lunch",
              backgroundColor: "transparent",
              borderColor: "blue",
              data: x2
            },
            {
              label: "blocktime",
              backgroundColor: "transparent",
              borderColor: "red",
              data: x4
            },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                right: 10
              }
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                minimum: 1,
                maximum: 60,
                labelAutoFit: true,
                gridLines: {
                  drawBorder: true,
                  display: true
                },
                ticks: {
                  display: true, // hide main x-axis line
                  beginAtZero: true
                },
                barPercentage: 1.8,
                categoryPercentage: 0.2
              }],
              yAxes: [{
                gridLines: {
                  drawBorder: true, // hide main y-axis line
                  display: true
                },
                ticks: {
                  display: true,
                  beginAtZero: true
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
      }
    },
    created: function () {
      this.myFunctionOnLoad()
    }
  });
});