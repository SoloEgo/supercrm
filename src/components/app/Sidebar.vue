<template>
  <ul class="side-nav nav nav-pills flex-column mb-auto">
    <li class="sidebar-header">Страницы</li>
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
          ><i class="bi" :class="link.icon"></i> {{ link.title }}</router-link
        >
      </li>
    </router-link>
    <li class="sidebar-header" v-if="isAdmin">Администрирование</li>
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
          ><i class="bi" :class="link.icon"></i> {{ link.title }}</router-link
        >
      </li>
    </router-link>
  </ul>
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