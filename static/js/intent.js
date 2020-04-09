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
            message: '',
            message1: '',
            mes_arr: [],
            file: '',
            Address: '',
            reportname: '',
            checkaddress: '',
            reportname1: ''
        },
        methods: {
            toggleSideBar: function () {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                };
            },
            isNumber: function (eve) {
                var eve = eve.replace(/[^0-9,.]+/g, "");

                this.message = eve;
            },
            senddata: function () {
                $("#loading").show();
                var d = {
                    "locids": this.message,
                    "reportname": this.reportname
                }
                if (this.checkaddress == "on") {
                    var url = "/getIntents/hybrid"
                    console.log("true")
                }
                else {
                    var url = "/getIntents/method1"
                    console.log("false")
                }
                console.log(d);
                $.ajax({
                    url: url,
                    method: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(d),
                    dataType: "json"
                }).done(function (response) {
                    console.log(response);
                    console.log(response.filename);
                    $("#loading").hide();
                    this.nachafiledownload(response.filename)
                    $("#region").css("color", "green").text("Successful-uploaded")
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                    $("#region").css("color", "red").text("Server-Error");
                });
            },

            nachafiledownload: function (filename) {
                var kkk = "/downloadIntents/" + filename
                var a = document.createElement('a');
                a.href = kkk;
                a.target = 'blank';
                document.body.append(a);
                a.click();
                a.remove();
            },
            check1: function (e) {

                if (e.target.checked) {
                    console.log(e.target.value)
                    this.checkaddress = e.target.value;
                }
                else {
                    this.checkaddress = "unchecked";
                }
            },
            myFunction: function () {
                var reports = document.getElementById("mySelect").value;
                this.reportname = reports;
            },
            myFunction1: function () {
                var report1 = document.getElementById("mySelect1").value;
                this.reportname1 = report1;
            },
            uploadfile: function () {
                $("#loading").show();
                var fd = new FormData();
                var files = $('#addressFile')[0].files[0];
                fd.append('addressFile', files);
                // fd.append('reportname', this.reportname1)
                console.log(files);
                // localStorage.setItem("file", fd);
                // console.log(this.reportname1)
                $.ajax({
                    url: '/getIntents/method2',
                    type: 'POST',
                    method: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                }).done(function (response) {
                    console.log(response);
                    $("#loading").hide();
                    fetch("/downloadIntents/" + response.filename)
                        .then(resp => resp.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            // the filename you want
                            a.download = 'Intentfiles';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            alert('your file has downloaded!'); // or you know, something with better UX...
                        })
                        .catch(() => alert('oh no Download was not compeleted try again!'));
                    console.log(response.filename);
                    // this.nachafiledownload(response.filename)
                    $("#region1").css("color", "green").text("Successful-uploaded")
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                    $("#region1").css("color", "red").text("Server-Error");
                });
            },
            uploadfile1: function () {
                $("#loading").show();
                var fd = new FormData();
                var files = $('#addressFile1')[0].files[0];
                fd.append('addressFile1', files);
                console.log(files);
                $.ajax({
                    url: '/updateAddressInfo',
                    type: 'POST',
                    method: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                }).done(function (response) {
                    console.log(response);
                    $("#loading").hide();
                    // // var xhr = new XMLHttpRequest();
                    // // xhr.open('GET', "http://localhost:1234/downloadIntents/" + response.filename, true);
                    // // xhr.send();
                    // console.log(response.filename);
                    // this.nachafiledownload(response.filename)
                    $("#region2").css("color", "green").text("Successful-uploaded")
                }.bind(this)).fail(function (error) {
                    console.log(error);
                    $("#loading").hide();
                    $("#region2").css("color", "red").text("Server-Error");
                });
            },
        },
        created: function () {
            $("#loading").hide();
        },
        beforeCreate() {
        }
    });
});
