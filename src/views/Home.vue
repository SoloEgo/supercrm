<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Dashboard</h3>
      <button class="btn btn-primary btn-sm" @click="refresh">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div v-else class="home-dashboard-holder g-0">
        <div class="item">
          <div class="item_name"><BarChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><LineChart /></div>
        </div>
        <div class="item">
          <div class="item_name"><BarChart /></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/home.css";
import BarChart from '../components/content/Chart/BarChart.vue'
import LineChart from "../components/content/Chart/LineChart.vue";
export default {
  name: "Home",
  data: () => ({
    loading: true
  }),
  async mounted() {
    this.loading = false;
    
  },
  components: {
    BarChart,
    LineChart
},
  methods: {
    async refresh() {
      this.loading = true;
      this.loading = false;
    },
  },
};
</script>
