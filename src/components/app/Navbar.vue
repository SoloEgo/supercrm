<template>
  <nav class="navbar-glass navbar-top navbar navbar-expand navbar-light">
    <div class="left-nav-bar">
      <div class="toggle-icon-wrapper">
        <button
          id="toggleNavigationTooltip"
          type="button"
          class="btn btn-light bth-toggle-sidebar"
          @click="hideSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
      <div class="search-box dropdown">
        <div class="toggle" id="" aria-expanded="false" data-toggle="dropdown">
          <form class="position-relative">
            <input
              placeholder="Search..."
              aria-label="Search"
              type="search"
              class="rounded-pill search-input form-control"
              value=""
            /><i class="bi bi-search"></i>
          </form>
        </div>
      </div>
      <div class="date-holder ms-5">
        <span><i class="bi bi-calendar2 me-2"></i></span
        ><span>{{ date | date("date") }}</span>
      </div>
    </div>
    <div class="right-nav-bar">
      <button
        class="theme-control-toggle-label btn btn-sm btn-light me-3"
        @click="changeTheme"
      >
        <i class="bi bi-moon"></i>
      </button>
      <button class="notification-holder-btn btn btn-light btn-sm dropdown  me-3">
        <i class="bi bi-bell"></i>
      </button>
      <div
        class="dropdown user-block"
        :class="{ active: showUserSettings }"
        @click="showUserSettings = !showUserSettings"
        v-click-outside="closeDropDown"
      >
        <div class="avatar avatar-xl user-image" :style="{backgroundImage: 'url('+avatar+')'}"></div>
        <div class="user-name">
          <span class="dropdown-toggle">{{ name }} {{surname}}</span>
          <small>{{ position }}</small>
        </div>
        <ul
          class="dropdown-menu dropdown-menu-end"
          
          :class="{ show: showUserSettings }"
        ><li>
          <router-link to="/profile" class="dropdown-item">
            <i class="bi bi-person"></i> Профиль
          </router-link>
        </li>
        <li>
          <a href="#" class="dropdown-item" @click.prevent="logout">
            <i class="bi bi-box-arrow-left"></i> Выйти
          </a>
        </li>   
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import ClickOutside from "vue-click-outside";

export default {
  data: () => ({
    showUserSettings: false,
    date: new Date(),
    dateInterval: null,
    hideSidebarStatus: true,
    theme: "",
  }),
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
    hideSidebar: function () {
      let sideBar = document.querySelector(".navbar-vertical");
      let content = document.querySelector(".content");
      if (this.hideSidebarStatus) {
        sideBar.classList.add("hidden");
        content.classList.add("full-width");
      } else {
        sideBar.classList.remove("hidden");
        content.classList.remove("full-width");
      }
      this.hideSidebarStatus = !this.hideSidebarStatus;
    },
    async changeTheme() {
      let rootEl = document.querySelector(".app-main-layout-wrapper");
      if (this.theme == "lightTheme") {
        rootEl.classList.remove("lightTheme");
        rootEl.classList.add("darkTheme");
        this.theme = "darkTheme";
        this.$cookies.set("theme", 'darkTheme', 60 * 60 * 24 * 30);
      } else {
        rootEl.classList.add("lightTheme");
        rootEl.classList.remove("darkTheme");
        this.theme = "lightTheme";
        this.$cookies.set("theme", 'lightTheme', 60 * 60 * 24 * 30);
      }    
    },
    closeDropDown() {
      document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.remove('show'))
      this.showUserSettings = false
    },
  },
  computed: {
    name() {
      return this.$store.getters.info.name;
    },
    surname() {
      return this.$store.getters.info.surname;
    },
    position() {
      return this.$store.getters.info.position;
    },
    avatar() {
      return this.$store.getters.info.avatarUrl;
    },
  },
  async mounted() {
    this.theme = this.$cookies.get("theme");
    this.date = new Date();
    let ref = this.$store.getters.info.avatarUrl
    document.querySelector(".user-image").style.backgroundImage =
      "url(" + ref + ")";
  },
  directives: {
    ClickOutside,
  },
};
</script>