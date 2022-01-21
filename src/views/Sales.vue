<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="pahe-header"><h3>Сделки</h3></div>
      <div class="page-controls">
        <button
          class="btn me-3"
          :class="displayTable ? 'btn-primary' : 'btn-light'"
          @click="bthDisplayHnadler"
        >
          <i class="bi bi-table"></i>
        </button>
        <button
          class="btn me-3"
          :class="!displayTable ? 'btn-primary' : 'btn-light'"
          @click="bthDisplayHnadler"
        >
          <i class="bi bi-card-list"></i>
        </button>
        <button class="btn btn-primary" @click="openModalCreateSale">
          <i class="bi bi-plus-square"></i> Новая сделка
        </button>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!sales.length">
        <div class="empty-result">
          Сделок пока нет.
          <button class="btn primary-btn">Добавить новую сделку</button>
        </div>
      </div>
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100" v-if="displayTable">
            <SalesTable :sales="sales" :key="sales.length" @updated="updateSales"/>
            <nav aria-label="Page navigation example">
              <Paginate
                v-model="page"
                :page-count="pageCount"
                :click-handler="pageChangeHandler"
                :prev-text="'Назад'"
                :next-text="'Вперед'"
                :container-class="'pagination'"
                :page-class="'page-item'"
                :page-link-class="'page-link'"
                :prev-class="'page-item'"
                :prev-link-class="'page-link'"
                :next-class="'page-item'"
                :next-link-class="'page-link'"
              />
            </nav>
          </div>
          <div class="card white-card minh-100" v-else>
            <SalesBlock :sales="sales" :key="sales.length"  @updated="updateSales"/>
          </div>
        </div>
        <SalesCreateModal @createdSale="addNewSale" />
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/salesPage.css";
import SalesCreateModal from "@/components/content/Sales/SalesCreateModal";
import SalesTable from "@/components/content/Sales/SalesTable";
import SalesBlock from "@/components/content/Sales/SalesBlock";
import paginationMixin from "@/mixins/pagination.mixin";
export default {
  name: "sales",
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    sales: [],
    displayTable: null,
  }),
  async mounted() {
    this.sales = await this.$store.dispatch("fetchSales");
    this.setupPagination(
      this.sales.map((sale) => {
        return {
          ...sale,
        };
      })
    );
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
    SalesTable,
    SalesCreateModal,
    SalesBlock,
  },
};
</script>