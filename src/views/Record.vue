<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="empty-results-holder" v-else-if="!categories.length" >
        <div class="empty-result">Доступных категорий пока нет. <router-link to="/categories">Добавить новую категорию</router-link></div>
      </div>
      <div class="tile-holder" v-else>
        <div class="col cw3 ch2">
          <div class="card white-card">
            <form class="form" @submit.prevent="handleSubmit">
              <div class="f-input-field">
                <label>Выберите категорию</label>
                <select ref="select" v-model="category">
                  <option v-for="c in categories" :key="c.id" :value="c.id">
                    {{ c.title }}
                  </option>
                </select>
              </div>
              <div class="row">
                <div class="col-2 form-check">
                  <input
                    class="form-check-input"
                    id="radio1"
                    name="type"
                    type="radio"
                    value="income"
                    v-model="type" />
                  <label class="form-check-label" for="radio1">Доход</label>
                </div>
                <div class="col-2 form-check">
                  <input
                    class="form-check-input"
                    name="type"
                    id="radio2"
                    type="radio"
                    value="outcome"
                    v-model="type" />
                  <label class="form-check-label" for="radio2">Расход</label>
                </div>
              </div>

              <div class="f-input-field">
                <label for="amount">Сумма</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  v-model.number="amount"
                  :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
                />

                <span
                  class="helper-text invalid"
                  v-if="$v.amount.$dirty && !$v.amount.minValue"
                >
                  Минимальная величина {{ $v.amount.$params.minValue.min }}
                </span>
              </div>

              <div class="f-input-field">
                <label for="description">Описание</label>
                <input
                  id="description"
                  type="text"
                  v-model="description"
                  :class="{
                    invalid: $v.description.$dirty && !$v.description.required,
                  }"
                />

                <span
                  class="helper-text invalid"
                  v-if="$v.description.$dirty && !$v.description.required"
                  >Введите описание</span
                >
              </div>
              <div class="card-action">
                <button class="btn waves-effect waves-light" type="submit">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  //name: "record",
  data: () => ({
    loading: true,
    categories: [],
    category: null,
    select: null,
    type: "income",
    amount: 0,
    description: "",
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }

    this.select = this.$refs.select;
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      } else {
        return this.info.bill >= this.amount;
      }
    },
  },
  validations: {
    amount: { minValue: minValue(0.01) },
    description: { required },
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        
        try {

          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
          })

          const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount
          console.log(bill)

          await this.$store.dispatch('updateInfo', {bill})
          this.$message('Запись успешно создана')

          this.$v.$reset()
          this.amount = 0
          this.description = ''

        } catch (e) {
          console.log(e)
        }
      } else {
        this.$error(
          `Недостаточно средств на счете (необходимо ${
            this.amount - this.info.bill 
          } для списания) для списания`
        );
      }
    },
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};
</script>