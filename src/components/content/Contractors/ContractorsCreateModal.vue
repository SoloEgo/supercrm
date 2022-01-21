<template>
  <div class="modal modal-card py-5 create-new-contractor-card" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-5 shadow">
        <div class="modal-header  p-5 pb-4 border-bottom-0 mb-3">
          <h2 class="fw-bold mb-0">Новый контрагент</h2>
          <button
            @click="closeModalCreateContr"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body p-5 pt-0">
          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="bi bi-bootstrap"></i
                ></span>
                <input
                  type="text"
                  class="form-control"
                  id="floatingInputName"
                  placeholder="Наименование"
                  v-model="name"
                  :class="{
                    invalid: $v.name.$dirty && !$v.name.required,
                  }"
                />
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.name.$dirty && !$v.name.required"
                >Поле Наименование не должно быть пустым</small
              >
            </div>
            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="bi bi-at"></i
                ></span>
                <input
                  type="email"
                  class="form-control rounded-4"
                  id="floatingInputMail"
                  placeholder="email"
                  v-model="email"
                  :class="{
                    invalid:
                      ($v.email.$dirty && !$v.email.required) ||
                      ($v.email.$dirty && !$v.email.email)
                  }"
                />
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.email.$dirty && !$v.email.required"
                >Поле E-mail не должно быть пустым</small
              >
            </div>

            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="bi bi-telephone"></i>
                </span>
                <input
                  type="text"
                  class="form-control rounded-4"
                  id="floatingInputPhone"
                  placeholder="Телефон"
                  v-model="phone"
                  :class="{
                    invalid: $v.phone.$dirty && !$v.phone.required,
                  }"
                />
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.phone.$dirty && !$v.phone.required"
                >Поле Наименование не должно быть пустым</small
              >
            </div>

            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-card-text"></i></span>
              <textarea
                class="form-control rounded-4"
                id="floatingInputDescription"
                placeholder="Описание"
                v-model="description"
                :class="{
                  invalid: $v.description.$dirty && !$v.description.required,
                }"
              ></textarea>       
            </div>
            <small
                class="f-helper-text invalid"
                v-if="$v.description.$dirty && !$v.description.required"
                >Поле Описание не должно быть пустым</small
              >
            </div>

            <div class="form-row mb-3">
              <div class="input-group">
              <button
              class="w-100 mb-2 btn btn-lg rounded-4 btn-primary"
              type="submit"
            >
              Добавить
            </button>
            </div>            
            </div>  
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { email, required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  name: "createContractor",
  data: () => ({
    name: null,
    phone: null,
    email: null,
    description: null,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }

    this.select = this.$refs.select;
  },
  computed: {},
  validations: {
    name: { required },
    email: { email, required },
    phone: { required },
    description: { required },
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const contractor = {
          name: this.name,
          phone: this.phone,
          email: this.email,
          description: this.description,
          date: new Date().toJSON(),
        }
        
        await this.$store.dispatch("createContractor", contractor);
        
        this.name = null
        this.phone = null
        this.email = null
        this.description = null

        this.$v.$reset();
        document.querySelector(".create-new-contractor-card").classList.remove("active");
        this.$message("Запись успешно создана");       
        this.$emit('createdContractor', contractor)

      } catch (e) {
        console.log(e);
      }
    },

    closeModalCreateContr() {
      document.querySelector(".create-new-contractor-card").classList.remove("active");
    },
  },
  destroyed() {},
};
</script>