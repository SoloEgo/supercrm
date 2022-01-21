<template>
  <div class="displayContentBlock">
    <div class="page-title breadcrumb-wrap">
      <router-link to="/history" class="breadcrumb">История</router-link>
      <a @click.prevent class="breadcrumb"> {{record.type === 'income' ? 'Доход' : 'Расход'}} </a>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else-if="record">
        <div class="col cw3 ch2">
          <div class="card white-card">
            <div class="record-accent" :class="
            {'green': record.type === 'income',
            'red': record.type === 'outcome'
            }"></div>
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ record.amount | currency("RUB") }}</p>
              <p>Категория: {{ record.categoryName }}</p>
              <small>{{ record.date | date("datetime") }} </small>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-results-holder" v-else>
        <div class="empty-result">
          Записей c id = {{ $route.params.id }} не найдена
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "detail",
  data: () => ({
    record: null,
    loading: true,
  }),
  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch("fetchRecordById", id);
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.record = {
      ...record,
      categoryName: category.title,
    }; 
    this.loading = false;
  },
};
</script>