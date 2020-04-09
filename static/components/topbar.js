const topbar = Vue.component('top-bar', {
  props: ['username'],
  delimiters: ['[[', ']]'],
  methods: {
    toggleSidebar: function () {
      if ($(window).width() < 768) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $('.sidebar .collapse').collapse('hide');
        };
      }
    },
  },
  mounted: function () {

    $(window).resize(function () {
      if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
      };
    });



    if ($(window).width() < 768) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
      };
    }
  },

  template: `
    <div>
    <nav class="navbar navbar-expand navbar-light topbar mb-4 static-top shadow">
          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars icon_color"></i>

          </button>
          <strong class="font-weight-bold">Welcome to COVID Dashboard</strong>

          <!-- Topbar Navbar -->
          <ul id="top-navbar" class="navbar-nav ml-auto">

            <!-- Nav Item - Alerts -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-none p-1 d-lg-inline text-gray-600 font-weight-bold"></span>
                <img class="img-profile rounded-circle" src="https://source.unsplash.com/WLUHO9A_xik/60x60">
              </a>
              <!-- Dropdown - User Information -->
           </li>
          </ul>
        </nav>
        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
              <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">Are you ready to leave.</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
              <a class="btn btn-primary" href="/">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    `
});

exports = topbar;