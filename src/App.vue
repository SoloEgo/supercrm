<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style>

@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-icons/font/bootstrap-icons.css';
@import '~bootstrap-vue/dist/bootstrap-vue.css';
@import "assets/index.css";
</style>


<script>
import EmptyLayout from "@/layouts/EmptyLayout";
import MainLayout from "@/layouts/MainLayout";

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout||'empty') + '-layout'
    },
  },
  components: {
    EmptyLayout,
    MainLayout,
  }
};
</script>


