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
            revenue:function(){
                alert('sssss')
                $('#loading').hide();
            }
            // revenue: function () {
            //     $("#loading").show();
            //     $.ajax({
            //         url: "/api/dailyTracker",
            //         method: "GET",
            //         contentType: 'application/json',
            //         dataType: "json"
            //     }).done(function (response) {
            //         this.add(response)
            //         console.log(response)
            //         google.charts.setOnLoadCallback(function () {
            //             this.trend(response)
            //         }.bind(this));
            //         $("#loading").hide();
            //     }.bind(this)).fail(function (error) {
            //         console.log(error);
            //         $("#loading").hide();
            //     });
            // },
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
        },
        beforeCreate() {
        }
    });
});
