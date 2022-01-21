<template>
  <div class="tile-card tile-2">
    <div class="card">
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="mb-3">
          <select
            ref="select"
            id="selectCat"
            v-model="current"
            class="form-select form-select-sm"
          >
            <option v-for="c of categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label for="selectCat">Выберите категорию</label>
        </div>

        <div class=" mb-3">
          <input
            type="text"
            class="form-control form-control-sm"
            id="title"
            placeholder="Название"
            v-model="title"
            :class="{ 'is-invalid': $v.title.$dirty && !$v.title.required }"
          />
          <label
            for="floatingInputInvalid"
            v-if="$v.title.$dirty && !$v.title.required"
            >Введите название Категории</label
          >
          <label for="title" v-else>Название</label>
        </div>

        <div class="mb-3">
          <input
            type="number"
            class="form-control form-control-sm"
            id="limit"
            placeholder="Лимит"
            min="0"
            v-model.number="limit"
            :class="{ 'is-invalid': $v.title.$dirty && !$v.limit.minValue }"
          />
          <label
            for="floatingInputInvalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            >Минимальная величина {{ $v.limit.$params.minValue.min }}</label
          >
          <label for="limit" v-else>Лимит</label>
        </div>

        <div class="col-12">
          <button class="btn btn-primary" type="submit">
            Обновить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    select: null,
    title: "",
    limit: 1,
    current: null,
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(1) },
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
        };
        await this.$store.dispatch("updateCategory", categoryData);
        this.$message("Категория умпешно обновлена");
        this.$emit("updated", categoryData);
      } catch (e) {}
    },
  },
  mounted() {
    this.select = this.$refs.select;
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find((c) => c.id === catId);
      this.title = title;
      this.limit = limit;
    },
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};
</script>