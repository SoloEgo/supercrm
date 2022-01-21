<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>История записей</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!records.length">
        <div class="empty-result">
          Записей пока нет.
          <router-link to="/record">Добавить новую запись</router-link>
        </div>
      </div>
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card">
            <div class="history-chart">
              <canvas></canvas>
            </div>
            <HistoryTable :records="items" />

            <nav aria-label="Page navigation">
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
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/content/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";

export default {
  name: "history",
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.setupPagination(
      this.records.map((record) => {
        return {
          ...record,
          categoryName: categories.find((c) => c.id == record.categoryId).title,
          typeClass: record.type === "income" ? "green" : "red",
          typeText: record.type === "income" ? "Доход" : "Расход",
        };
      })
    );
    this.records.sort((a, b) =>
      a.date > b.date ? -1 : b.date > a.date ? 1 : 0
    );
    this.loading = false;
  },
  components: {
    HistoryTable,
  },
};
</script>