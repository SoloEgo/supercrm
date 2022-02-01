<template>
  <div class="app-main-layout-wrapper">
    <Loader v-if="loading" />
    <div class="app-main-layout" v-else>
      <nav class="navbar-vertical navbar d-flex text-white">
        <div class="nav-bar-content scrollbar">
          <div class="logo-holder">
            <div class="logo-img ms-3 me-2">
              <div class="logoBlock">
                <img type="image/svg+xml" src="../assets/img/logo.svg" />
              </div>
            </div>
            <div class="logo-name">Custom<br /><b>Crm</b></div>
          </div>

          <div class="navbar-vertical-content scrollbar mt-2">
            <div class="navbar-vertical-content scrollbar">
              <Sidebar />
            </div>
            <div class="toggleThemeBlock">
              <div class="lightIcon">
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  ><i class="bi bi-sun"></i
                ></label>
              </div>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  @change="changeTheme"
                  :checked="darkTheme"
                />
              </div>
              <div class="darkIcon">
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  ><i class="bi bi-moon-stars"></i
                ></label>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="content">
        <Navbar />
        <div class="content-tiles">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/mainLayoutCss.css";
@import "../assets/navBar.css";
@import "../assets/sideBar.css";
@import "../assets/modalCard.css";
@import "../assets/profile.css";
@import "../assets/toast.css";
@import "../assets/logo.css";
</style>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import messages from "@/utils/messages";

export default {
  name: "main-layout",
  data: () => ({
    loading: true,
    darkTheme: false
  }),
  methods: {
    async changeTheme() {
      let rootEl = document.querySelector(".app-main-layout-wrapper");
      if (this.theme == "lightTheme") {
        rootEl.classList.remove("lightTheme");
        rootEl.classList.add("darkTheme");
        this.theme = "darkTheme";
        this.$cookies.set("theme", "darkTheme", 60 * 60 * 24 * 30);
        this.darkTheme =true
      } else {
        rootEl.classList.add("lightTheme");
        rootEl.classList.remove("darkTheme");
        this.theme = "lightTheme";
        this.$cookies.set("theme", "lightTheme", 60 * 60 * 24 * 30);
        this.darkTheme =false
      }
    }
  },
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch("fetchInfo");
    }
    //this.theme = await this.$store.dispatch("fetchTheme");
    this.theme = this.$cookies.get("theme");
    if (this.theme) {
      document
        .querySelector(".app-main-layout-wrapper")
        .classList.add(this.theme);
    } else {
      this.$cookies.set("theme", "lightTheme", 60 * 60 * 24 * 30);
      this.theme = this.$cookies.get("theme");
      document
        .querySelector(".app-main-layout-wrapper")
        .classList.add(this.theme);
    }

    if(this.theme == 'lightTheme'){
      this.darkTheme = false
    }else{
      this.darkTheme = true
    }

    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  components: {
    Navbar,
    Sidebar,
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || "Что-то пошло не так");
    },
  },
};
</script>