<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="page-header"><h3>Структура отделов</h3><span class="badge bg-primary ms-3">Администрирование</span></div>
      <div class="page-controls">
        <button class="btn btn-primary" @click="openModalCreateSale">
          <i class="bi bi-plus-square"></i> Новый отдел
        </button>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <StructureBlock :sales="sales" :key="sales.length"  @updated="updateSales"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/structure.css";
import StructureBlock from "@/components/content/Structure/StructureBlock";
export default {
  name: "departments",
  data: () => ({
    loading: true,
    deparments: [],
    displayTable: null,
  }),
  async mounted() {
    this.sales = await this.$store.dispatch("fetchSales");
    this.displayTable = this.$cookies.get("displayTable") === "true";
    this.loading = false;
  },
  methods: {
    openModalCreateSale() {
      document
        .querySelector(".create-new-record-card")
        .classList.toggle("active");
    },
    addNewSale(sale) {
      this.sales.push(sale);
      this.updateCount++;
    },
    bthDisplayHnadler() {
      this.displayTable = !this.displayTable;
      this.$cookies.set("displayTable", this.displayTable, 60 * 60 * 24 * 30);
    },
    updateSales(sales){
      this.sales = sales
    }
  },
  components: {
    StructureBlock
  },
};
</script>