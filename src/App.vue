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
</style>


<script>
import MainLayout from "@/layouts/MainLayout";
import EmptyLayout from "@/layouts/EmptyLayout";
import "@/assets/customize.scss";
import { db } from "@/plugins/db";
export default {
  data: () => ({
    darkTheme: false,
  }),
  computed: {
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    },
  },
  created() {
    window.addEventListener("beforeunload", this.leaving);
    window.addEventListener(
      "beforeunload",
      function (event) {
        event.preventDefault();
        this.leaving;
        event.returnValue = "";
      },
      false
    );
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
  methods: {
    async leaving() {
      const uid = await this.$store.dispatch("getUid");
      db.collection("users").doc(uid).set({
        online: false,
      });
    },
  },
  async mounted() {
    this.theme = this.$cookies.get("theme");
    if (this.theme) {
      document.querySelector("body").classList.add(this.theme);
    } else {
      this.$cookies.set("theme", "lightTheme", 60 * 60 * 24 * 30);
      this.theme = this.$cookies.get("theme");
      document.querySelector("body").classList.add(this.theme);
    }
    if (this.theme == "lightTheme") {
      document.documentElement.setAttribute("data-color-scheme", "light");
      this.darkTheme = false;
    } else {
      this.darkTheme = true;
      document.documentElement.setAttribute("data-color-scheme", "dark");
    }
    const uid = await this.$store.dispatch("getUid");
    db.collection("users").doc(uid).set({
      online: true,
    });
  },
};
</script>


