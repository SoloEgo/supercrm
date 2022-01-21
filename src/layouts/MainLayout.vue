<template>
  <div class="app-main-layout-wrapper">
    <Loader v-if="loading" />
    <div class="app-main-layout" v-else>
      <nav class="navbar-vertical navbar d-flex text-white">
        <div class="nav-bar-content scrollbar">
          <div class="logo-holder">
            <div class="logo-img me-3">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                enable-background="new 0 0 20 20"
                xml:space="preserve"
              >
                <path
                  d="M19.4,4.1l-9-4C10.1,0,9.9,0,9.6,0.1l-9,4C0.2,4.2,0,4.6,0,5s0.2,0.8,0.6,0.9l9,4C9.7,10,9.9,10,10,10s0.3,0,0.4-0.1l9-4
                C19.8,5.8,20,5.4,20,5S19.8,4.2,19.4,4.1z"
                ></path>
                <path
                  d="M10,15c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5
                c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,15,10.1,15,10,15z"
                ></path>
                <path
                  d="M10,20c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5
                c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,20,10.1,20,10,20z"
                ></path>
              </svg>
            </div>
            <div class="logo-name"><b>SUPER</b>CRM</div>
          </div>
          <hr />
          <div class="navbar-vertical-content scrollbar mt-2">
            <div class="navbar-vertical-content scrollbar">
              <Sidebar />
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
  }),
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
      this.$cookies.set("theme", 'lightTheme', 60 * 60 * 24 * 30);
      this.theme = this.$cookies.get("theme");
      document
        .querySelector(".app-main-layout-wrapper")
        .classList.add(this.theme);
    }

    setTimeout(()=>{
    this.loading = false;
    },500)
    
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