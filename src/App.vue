<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style>
@import "assets/index.css";
@import "~bootstrap-icons/font/bootstrap-icons.css";
@import "assets/toast.css";
@import "assets/bv-toast.css";
/* @import "~bootstrap/dist/css/bootstrap.css"; */
</style>


<script>
import MainLayout from "@/layouts/MainLayout";
import EmptyLayout from "@/layouts/EmptyLayout";
import "@/assets/customize.scss";

export default {
  data: () => ({
    darkTheme: false,
  }),
  computed: {
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    },
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
  mounted() {
    this.theme = this.$cookies.get("theme");
    if (this.theme) {
      document
        .querySelector("body")
        .classList.add(this.theme);
    } else {
      this.$cookies.set("theme", "lightTheme", 60 * 60 * 24 * 30);
      this.theme = this.$cookies.get("theme");
      document
        .querySelector("body")
        .classList.add(this.theme);
    }

    if (this.theme == "lightTheme") {
      this.darkTheme = false;
    } else {
      this.darkTheme = true;
    }
  },
};
</script>


