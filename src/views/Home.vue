<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Рабочий стол</h3>
      <button class="btn btn-primary btn-sm" @click="refresh">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div v-else class="home-dashboard-holder g-0">
        <div class="item">
          <div class="item_name">Item name 1</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 2</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 3</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 4</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 5</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 6</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 7</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 8</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 9</div>
        </div>
        <div class="item">
          <div class="item_name">Item name 10</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/home.css";
export default {
  name: "Home",
  data: () => ({
    loading: true,
  }),
  async mounted() {
    this.loading = false;
  },
  components: {},
  methods: {
    async refresh() {
      this.loading = true;
      this.loading = false;
    },
  },
};
</script>
