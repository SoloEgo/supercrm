<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>
<style>
@import "../assets/emptyLayoutCss.css";
</style>
<script>
import messages from '@/utils/messages'
export default {
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Что-то пошло не так')
    },
  },
};
</script>