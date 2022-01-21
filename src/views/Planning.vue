<template>
  <div  class="displayContentBlock">
    <div class="page-title">
      <h3>Планирование</h3>
      <div class="balance-info-total">
        Текущий баланс:
        <h4>{{ info.bill | currency("RUB") }}</h4>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!categories.length">
        <div class="empty-result">
          Доступных категорий пока нет.
          <router-link to="/categories">Добавить новую категорию</router-link>
        </div>
      </div>
      <div class="tile-holder" v-else>
        <div class="col cw1 ch1">
          <div class="card white-card">
            <div class="planning-lines" v-for="cat of categories" :key="cat.id">
              <p>
                <strong>{{ cat.title }}:</strong>
                {{ cat.spend | currency("RUB") }} из
                {{ cat.limit | currency("RUB") }}
              </p>
              <div class="progress" v-tooltip="cat.tooltip">
                <div
                  class="determinate"
                  :class="cat.progressColor"
                  :style="{ width: cat.progressPercent + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";
export default {
  name: "planning",
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(["info"]),
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.categories = categories.map((cat) => {
      const spend = records
        .filter((r) => r.categoryId == cat.id)
        .filter((r) => r.type == "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;

      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const tooltipValue = cat.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? "Превышение на " : "Осталось: "
      } ${currencyFilter(Math.abs(tooltipValue), "RUB")}`;

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        percent,
        tooltip,
      };
    });

    this.loading = false;
  },
};
</script>