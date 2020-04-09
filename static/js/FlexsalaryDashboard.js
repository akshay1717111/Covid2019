document.addEventListener('DOMContentLoaded', function () {
  google.charts.load("current", {
    packages: ["corechart", 'controls']
  });

  new Vue({
    el: '#wrapper',
    delimiters: ['[[', ']]'],
    components: {
      navbar,
      topbar
    },
    data: {
      began: new Date().toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10),
    },
    methods: {
      toggleSideBar: function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      },
      mainload: function () {
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
            this.drawChart1(r_data.crmDataDict)
          }.bind(this));
          $(window).resize(function () {
            this.drawChart1(r_data.crmDataDict)
          }.bind(this));
        }.bind(this)).fail(function (error) {
          document.getElementById("bar_google").innerHTML = "Server-Error";
          $('#loading').hide();
        });
      },
      drawChart1: function (insert) {
        console.log(insert)
        var container = document.getElementById("bar_google");
        var chart = new google.visualization.BarChart(container);
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
          width: 1000,
          height: 700,
          bar: {
            groupWidth: "200%"
          },
          legend: {
            position: "none"
          },
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
      showmodal: function (taskname) {
        $('#myModal_details').modal('show');
        $("#myModalLabel2").text(taskname);
      },
      check1: function (e) {

        if (e.target.checked) {
          console.log(e.target.value)
          this.checkValues.push(e.target.value)
        }
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
      }
    },
    created: function () {
      this.mainload();
    },
    beforeCreate() {
    }
  });
});
