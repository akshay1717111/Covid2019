const navbar = Vue.component('nav-bar', {
  methods: {
    toggleSideBar: function () {
      this.$emit('sidebar-toggle');
    }
  },
  template: `
    <!-- Nav Bar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar -  Logo - Title -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
        <div class="sidebar-brand-icon rotate-n-5">
        <i class="fas fa-tachometer-alt"></i>
        </div>
        <div class="sidebar-brand-text mx-3">COVID</div>
      </a>
      <hr class="sidebar-divider my-0">
      <hr class="sidebar-divider">
      <div class="sidebar-heading">
        Interface
      </div>
      <li class="nav-item">
        <a class="nav-link" href="#">
        <i class="fa fa-history"></i>
         <span>Total Analysis</span></a>
      </li>

     <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block">
      
      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle" @click="toggleSideBar()"> <i class="fa fa-angle-left text-white"></i></button>
      </div>

      <!-- Scroll to Top Button-->
      <a class="scroll-to-top rounded" href="#page-top">
        <i class="fa fa-angle-up icon_color"></i>
      </a>

    </ul>
    <!-- End of Sidebar -->
`
});

exports = navbar;