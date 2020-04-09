const navbar = Vue.component('nav-bar', {
  methods: {
    toggleSideBar: function () {
      this.$emit('sidebar-toggle');
    }
  },
  template: `
    <!-- Nav Bar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">

      <!-- Sidebar -  Logo - Title -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="https://www.flexsalary.com">
        <div class="sidebar-brand-icon rotate-n-5">
        <i class="fas fa-tachometer-alt"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Flexsalary</div>
      </a>
      <hr class="sidebar-divider my-0">
      <hr class="sidebar-divider">
      <div class="sidebar-heading">
        Interface
      </div>
      <li class="nav-item">
        <a class="nav-link" href="/_dashboard">
        <i class="fa fa-history"></i>
         <span>AgentsHistory</span></a>
      </li>

      <!-- Nav Item - Tables 
      <li class="nav-item">
        <a class="nav-link" href="/crm_data">
          <i class="fa fa-recycle"></i>
          <span>Total calls</span></a>
      </li>-->
      <!-- Nav Item - Charts -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
          <i class="fa fa-signal"></i>
          <span>Reports</span>
        </a>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Reports Types:</h6>
            <a class="collapse-item" href="/ebv">EBV Status</a>
            <a class="collapse-item" href="/customerFlow">Customer Flow</a>
            <a class="collapse-item" href="/pan">NSDL</a>
            <a class="collapse-item" href="/Reports">CKYC</a>
            <a class="collapse-item" href="/newReports">Revenue</a>
            <a class="collapse-item" href="/dailyTracker">DailyTracker</a>
          </div>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/vivifi">
          <i class="fa fa-tags"></i>
          <span>Live Customers</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/getIntents">
          <i class="fa fa-inbox"></i>
          <span>Generating Reports</span></a>
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