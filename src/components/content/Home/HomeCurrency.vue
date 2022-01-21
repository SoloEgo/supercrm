<template>
  <div class="tile-card  tile-2 tile main-col">
    <div class="card m-2 white-card bill-card">
      <div class="card-content card-body">
        <h3 class="card-title">Курс Валют</h3>
        <div class="card-content-block table-wrapper-scroll-y">
          <table  class="table table-striped mb-0">
            <thead>
              <tr>
                <th>Валюта</th>
                <th>Курс</th>
                <th>Дата</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="cur in currencies_names" :key="cur">
                <td>{{ getCurrencyName(cur) }}</td>
                <td>{{ getCurrency(cur) | currency(cur) }}</td>
                <td>{{ date | date("date") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rates", "date"],
  data: () => ({
    currencies_names: [],
  }),
  created() {
    this.fetchCurrenciesNames();
  },
  methods: {
    getCurrency(currency) {
      return Math.round(this.rates[currency] * 100) / 100;
    },
    getCurrencyName(currency) {
      return currency;
    },
    fetchCurrenciesNames() {
      let cur_names = Object.keys(this.rates);
      cur_names = cur_names.filter(
        (e) => e !== "RUB" && e !== "USD" && e !== "EUR"
      );
      cur_names.unshift("RUB", "USD", "EUR");
      this.currencies_names = cur_names;
    },
  },
};
</script>