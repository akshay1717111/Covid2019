document.addEventListener('DOMContentLoaded', function () {

    new Vue({
        el: "#wrapper",
        delimiters: ['[[', ']]'],
        components: {
            navbar,
            topbar
        },
        data: {
            notifications: []
        },
        methods: {
            toggleSideBar: function () {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                };
            }
        },
        beforeCreate() {
        },
        mounted() {
        }
    })


});

/* const channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
    const element = document.getElementById("notificationCount");
    element.textContent = parseInt(element.textContent) + 1;
}); */