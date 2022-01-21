<template>
  <div  class="displayContentBlock">
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn btn-primary btn-sm" @click="refresh">
         <i class="bi bi-arrow-clockwise"></i> 
      </button>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div v-else class="tile-holder g-0">
        <HomeBill :rates="currency.data" />
        <HomeCurrency
          :rates="currency.data"
          :date="new Date(currency.query.timestamp * 1000)"
        />
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeBill from "@/components/content/Home/HomeBill";
import HomeCurrency from "@/components/content/Home/HomeCurrency";

export default {
  name: "Home",
  data: () => ({
    loading: true,
    currency: null,
  }),
  async mounted() {
    this.currency = await this.$store.dispatch("fetchCurrency");
    this.loading = false;
  },
  components: {
    HomeBill,
    HomeCurrency,
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currency = await this.$store.dispatch("fetchCurrency");
      this.loading = false;
    },
  },
};
</script>
