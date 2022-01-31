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
/* @import "~bootstrap/dist/css/bootstrap.css"; */
</style>


<script>
import MainLayout from "@/layouts/MainLayout";
import EmptyLayout from "@/layouts/EmptyLayout";
import "@/assets/customize.scss";

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    },
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
};
</script>


