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
          Страницы
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
                  class="nav-link text-white"
                  :class="[isActive && 'active']"
                  ><i class="bi me-3" :class="link.icon"></i>
                  {{ link.title }}</router-link
                >
              </li>
            </router-link>
          </ul>
        </div>
      </li>
      <li v-if="isAdmin">
        <button
          class="btn btn-toggle btn-sdb-toggle text-white"
          data-bs-toggle="collapse"
          data-bs-target="#admin-collapse"
          aria-expanded="true"
        >
          Администрирование
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
                  ><i class="bi me-3" :class="link.icon"></i>
                  {{ link.title }}</router-link
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
export default {
  data: () => ({
    links: router.options.routes.filter(function (itm) {
      return itm.inSidebar && !itm.forAdmin;
    }),
    admlinks: router.options.routes.filter(function (itm) {
      return itm.forAdmin;
    }),
    isAdmin: false,
  }),

  async mounted() {
    this.isAdmin = this.$store.getters.info.isAdmin;
  },
};
</script>