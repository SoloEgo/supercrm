<template>
  <div class="tile-card tile-1">
    <div class="card">
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler">

        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Название"
            v-model="title"
            :class="{ 'is-invalid': $v.title.$dirty && !$v.title.required }"
          />
          <label
            for="floatingInputInvalid"
            class="h-auto"
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
            Создать
          </button>
        </div>


      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";

export default {
  data: () => ({
    title: "",
    limit: 1,
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(1) },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit,
        })
        
        this.title = ''
        this.limit = this.$v.limit.$params.minValue.min
        this.$v.$reset()
        this.$message('Категория успешно создана')
        this.$emit('created', category)
      } catch (e) {
          this.$error('Категория не была создана:' + e)
      }
    },
  },
};
</script>