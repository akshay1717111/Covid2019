document.addEventListener('DOMContentLoaded', function () {
  google.charts.load("current", {
    packages: ["corechart", 'controls']
  });

  new Vue({
    el: '#wrapper',
    delimiters: ['[[', ']]'],
    components: {
      navbar,
      topbar,
    },
    data: {
      began1: new Date().toISOString().slice(0, 10),
      end1: new Date().toISOString().slice(0, 10),
      selected: [],
      mainTasks: {},
      dropdown: [],
      maintaskname: '',
      Agents: [],
      tablename: [],
      tablecount: [],
      mointer: [],
      callsOffered: {
        label: '',
        value: ''
      },
      callsAnswered: {
        label: '',
        value: ''
      },
      callsAbandoned: {
        label: '',
        value: ''
      },
      serviceLevel: {
        label: '',
        value: ''
      },
      callsWaiting: {
        label: '',
        value: ''
      },
      oldestCall: {
        label: '',
        value: ''
      },
      idle: {
        label: '',
        value: ''
      },
      brk: {
        label: '',
        value: ''
      },
      wrapUp: {
        label: '',
        value: ''
      },
      inCall: {
        label: '',
        value: ''
      },
      averageAht: {
        label: '',
        value: ''
      }

    },
    methods: {
      toggleSideBar: function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      },
      showmodal: function (taskname) {
        $("#loading").show();
        this.maintaskname = taskname;
        var reports1 = document.getElementById("mySelect").value;
        var c = {
          "step": taskname,
          "filter": reports1
        }
        $.ajax({
          url: "/api/vivifi",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(c),
          dataType: "json"
        }).done(function (response) {
          this.createTableHeaders(response);
          this.createTableRows(response);
          $("#loading").hide();
        }.bind(this)).fail(function (err) {
          $("#loading").hide();
          $("#headers").text("Server-Error")
          $("#tbody").text("Server-Error")
          console.log(err);
        });
        $('#myModal_details').modal('show');
        $("#myModalLabel2").text(taskname);
        reports1 = null;
      },
      map: function () {
        $("#loading").show();
        $.ajax({
          url: "/api/statewisecustomers",
          method: "POST",
          contentType: 'application/json',
          dataType: "json"
        }).done(function (response) {
          $("#loading").hide();
          google.charts.setOnLoadCallback(function () {
            this.generateindia(response);
          }.bind(this));
        }.bind(this)).fail(function (err) {
          $("#loading").hide();
          console.log(err);
        });
      },
      analysis: function () {
        $.ajax({
          url: "http://172.16.16.164/slevel/tmpls/slevel.php?srvid=",
          method: "GET",
          dataType: "html",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        }).done(function (res) {
          this.cards(res)
        }.bind(this)).fail(function (error) {
          console.log(error)
        });
        setTimeout(function () {
          this.analysis()
        }.bind(this), 10000)
      },
      analysis2: function () {
        $.ajax({
          url: "http://172.16.16.164/slevel/json/json.php?srvid=&type=AGENT",
          method: "GET",
          dataType: "html",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        }).done(function (res) {
          this.dyna2(res);
        }.bind(this)).fail(function (error) {
          console.log(error)
        });
        setTimeout(function () {
          this.analysis2()
        }.bind(this), 10000)
      },
      analysis3: function () {
        $.ajax({
          url: "http://172.16.16.164/slevel/tmpls/dashboard.php",
          method: "GET",
          dataType: "html",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        }).done(function (res) {
          this.new_dyna(res);
        }.bind(this)).fail(function (error) {
          console.log(error)
        });
        setTimeout(function () {
          this.analysis3()
        }.bind(this), 10000)
      },
      new_dyna: function (res) {
        var c2 = [];
        var obj = JSON.parse(res);
        for (var i = 0; i < obj.length; i++) {
          for (var j = 0; j < obj[i].details.length; j++) {
            c2.push([obj[i].title + " - " + obj[i].details[j].name, obj[i].details[j].status])
          }
        }
        this.mointer = c2;
      },
      dyna2: function (res) {
        var c1 = [];
        var obj = JSON.parse(res);
        for (var i = 0; i < obj.items.length; i++) {
          var c = parseInt(obj.items[i].Duration[0].substr(3, 3))
          var d = obj.items[i].AgentStatus[0];
          var e = obj.items[i].ExtStatus[0];
          if (c >= 2 && d == "Incall" && e == "TALK") {
            c1.push([obj.items[i].AgentId[0], obj.items[i].Duration[0], obj.items[i].Campaign[0], obj.items[i].Phone[0]])
          }
        }
        if (c1.length == 0) {
          this.Agents = [
            ["None", "None", "None", "None"]
          ];
        } else {
          this.Agents = c1;
        }
      },
      cards: function (data) {

        const dom = $.parseHTML(data);
        const tableHeaders = $(dom).find('th');
        const tableData = $(dom).find('td');
        const serviceCountData = {};

        if (tableHeaders.length == tableData.length) {
          for (let index = 0; index < tableHeaders.length; index++) {
            const element = tableHeaders[index].innerText.trim();
            serviceCountData[element] = tableData[index].innerText.trim();
          }
          console.log(JSON.stringify(serviceCountData));
        }

        for (const key in serviceCountData) {
          if (serviceCountData.hasOwnProperty(key)) {
            const element = serviceCountData[key];

            if (key.toLowerCase().includes('offered')) {
              this.callsOffered.label = key;
              this.callsOffered.value = element;
              continue;
            } else if (key.toLowerCase().includes('answerd')) {
              this.callsAnswered.label = key;
              this.callsAnswered.value = element;
              continue;
            } else if (key.toLowerCase().includes('abandoned')) {
              this.callsAbandoned.label = key;
              this.callsAbandoned.value = element;
              continue;
            } else if (key.toLowerCase().includes('service')) {
              this.serviceLevel.label = key;
              this.serviceLevel.value = element;
              continue;
            } else if (key.toLowerCase().includes('waiting')) {
              this.callsWaiting.label = key;
              this.callsWaiting.value = element;
              continue;
            } else if (key.toLowerCase().includes('oldest')) {
              this.oldestCall.label = key;
              this.oldestCall.value = element;
              continue;
            } else if (key.toLowerCase().includes('idle')) {
              this.idle.label = key;
              this.idle.value = element;
              continue;
            } else if (key.toLowerCase().includes('break')) {
              this.brk.label = key;
              this.brk.value = element;
              continue;
            } else if (key.toLowerCase().includes('wrapup')) {
              this.wrapUp.label = key;
              this.wrapUp.value = element;
              continue;
            } else if (key.toLowerCase().includes('incall')) {
              this.inCall.label = key;
              this.inCall.value = element;
              continue;
            } else if (key.toLowerCase().includes('average')) {
              this.averageAht.label = key;
              this.averageAht.value = element;
              continue;
            }
          }
        }
      },
      createTableHeaders: function (data) {
        $.each(data, function (key, innerjson) {
          var data1 = innerjson.data.headers;
          var htmltext = "";
          for (i in data1) {
            htmltext += "<th style='position: sticky; top: -1px;background: #4e73df'><strong style='color: blanchedalmond;'>" +
              data1[i] +
              "</strong></th>";
          }
          document.getElementById("headers").innerHTML = htmltext;
          htmltext = "";
        })
      },
      createTableRows: function (data) {
        $.each(data, function (key, innerjson) {
          var data2 = innerjson.data.data;
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
          document.getElementById("tbody").innerHTML = htmltext;
          htmltext = "";
        })
      },
      myFunction: function () {
        var reports1 = document.getElementById("mySelect").value;
        var c = {
          "step": this.maintaskname,
          "filter": reports1
        }
        $.ajax({
          url: "/api/vivifi",
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify(c),
          dataType: "json"
        }).done(function (response) {
          this.createTableHeaders(response);
          this.createTableRows(response);
        }.bind(this)).fail(function (err) {
          $("#headers").text("Server-Error")
          $("#tbody").text("Server-Error")
          console.log(err);
        });
      },
      generateindia: function (values) {
        var data = google.visualization.arrayToDataTable([]);
        data.addColumn('string', 'Label')
        data.addColumn('number', 'Customers')
        d = {}
        for (i = 0; i < values.length; i++) {
          d[i] = {
            "state": values[i].StateName,
            "customers": values[i].No_of_customers
          }
        }

        var ab = [],
          cd = [],
          fg = [];
        for (i in d) {
          ab.push(d[i].state)
          cd.push(d[i].customers)
        }
       
        var fin = [];
        for (i = 0; i < ab.length; i++) {
          fin.push([ab[i], cd[i]])
        }
       
        var opts = {
          title: "Flexsalary customers",
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
            colors: ["orange", "blue", "green", "yellow", "red", "brown", "pink", "black", "violet"],
          },
          // colors: ['#4bb5f3', '#FADC41', '#c44949', '#d74a12', '#0e9a0e', '#55c2ac', '#7c4b91', '#fadc41', '#0d6cca', '#7c4897'],
          //colorAxis:["orange","blue","green","yellow","red","brown","pink","black","violet"],
          width: 1500,
          height: 400,
          strokeColor: '#a8a0a0',
          strokeWeight: 2,
          scale: 1,
        };
        data.addRows(fin);
        var geochart = new google.visualization.GeoChart(document.getElementById('visualization1'));
        geochart.draw(data, opts);
      },
      downloadreport: function () {
        var filename = this.maintaskname + ".csv";
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        for (var i = 0; i < rows.length; i++) {
          var row = [],
            cols = rows[i].querySelectorAll("td, th");
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
        csvFile = new Blob([csv], {
          type: "text/csv"
        });

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
    },
    created: function () {
      this.analysis()
      this.analysis2()
      this.analysis3()
      this.map()
    },
    beforeCreate() {
      $("#loading").show();
      var c = {
        "filter": "1"
      }
      $.ajax({
        url: "/api/vivifi",
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify(c),
        dataType: "json"
      }).done(function (response) {
        this.mainTasks = response;
        $("#loading").hide();
      }.bind(this)).fail(function (err) {
        console.log(err);
        $("#loading").hide();
      });
    },
  });
});