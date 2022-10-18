<template>
  <div>
    <ul class="list-unstyled ps-0">
      <li>
        <button
          class="btn btn-toggle btn-sdb-toggle text-white"
          data-bs-toggle="collapse"
          data-bs-target="#page-collapse"
          aria-expanded="true"
        >
          Workflow
        </button>
        <div class="collapse show" id="page-collapse">
          <ul class="side-nav nav nav-pills flex-column mb-auto">
            <router-link
              v-for="link in links"
              :key="link.path"
              tag="li"
              active-class="active"
              :to="link.path"
              exact=""
              v-slot="{ href, isActive }"
            >
              <li>
                <router-link
                  :to="href"
                  class="nav-link text-white "
                  :class="[isActive && 'active']"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="right" 
                  :title="link.title"
                  ><i class="bi me-3" :class="link.icon"></i>
                  <span>{{ link.title }}</span></router-link
                >
              </li>
            </router-link>
          </ul>
        </div>
      </li>
      <li v-if="isAdmin" class="mt-3 mb-3"><hr /></li>
      <li v-if="isAdmin">
        <button
          class="btn btn-toggle btn-sdb-toggle text-white"
          data-bs-toggle="collapse"
          data-bs-target="#admin-collapse"
          aria-expanded="true"
        >
          Admin Panel
        </button>
        <div class="collapse show" id="admin-collapse">
          <ul class="side-nav nav nav-pills flex-column mb-auto">
            <router-link
              v-for="link in admlinks"
              :key="link.path"
              tag="li"
              active-class="active"
              :to="link.path"
              exact=""
              v-slot="{ href, isActive }"
            >
              <li>
                <router-link
                  :to="href"
                  class="nav-link text-white"
                  :class="[isActive && 'active']"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="right" 
                  :title="link.title"
                  ><i class="bi me-3" :class="link.icon"></i>
                  <span>{{ link.title }}</span></router-link
                >
              </li>
            </router-link>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import router from "../../router/index";
import "bootstrap/dist/js/bootstrap.min.js";
import { Tooltip } from 'bootstrap/dist/js/bootstrap.esm.min.js'
export default {
  data: () => ({
    links: router.options.routes.filter(function (itm) {
      return itm.inSidebar && !itm.forAdmin;
    }),
    admlinks: router.options.routes.filter(function (itm) {
      return itm.forAdmin;
    }),
    isAdmin: false,
    hideSidebarStatus: ''
  }),

  async mounted() {
    this.isAdmin = this.$store.getters.info.isAdmin;
    Array.from(document.querySelectorAll('a[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode))
    // this.hideSidebarStatus = JSON.parse(
    //   this.$cookies.get("hideSidebarStatus") ? this.$cookies.get("hideSidebarStatus").toLowerCase() : ''
    // );
  },
};
</script>