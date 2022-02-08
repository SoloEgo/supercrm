<template>
  <div
    class="modal modal-card py-5 create-new-record-card"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-5 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0 mb-3">
          <h2 class="fw-bold mb-0">Новая сделка</h2>
          <button
            @click="closeModalCreateSale"
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
                <span class="input-group-text addNewContractor" id="basic-addon1"
                  ><i class="bi bi-plus-square"></i></span>
                <select
                  type="text"
                  class="form-select"
                  id="floatingInputName"
                  placeholder="Контрагент"
                  v-model="contragent"
                  :class="{
                    invalid: $v.contragent.$dirty && !$v.contragent.required,
                  }"
                >
                <option value="" selected disabled>Контрагент</option>
                  <option v-for="c of contractors" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.contragent.$dirty && !$v.contragent.required"
                >Поле Контрагент не должно быть пустым</small
              >
            </div>
            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="bi bi-circle"></i></span>
                <select
                  class="form-select"
                  id="floatingInputMail"
                  placeholder="Статус"
                  v-model="status"
                  :class="{
                    invalid:
                      ($v.status.$dirty && !$v.status.required),
                  }"
                >
                <option value="" selected disabled>Статус</option>
                <option v-for="s of statusArr" :key="s.status" :value="s.status">
                    {{ s.name }}
                  </option>
                </select>
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.status.$dirty && !$v.status.required"
                >Поле Статус не должно быть пустым</small
              >
            </div>

            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="bi bi-currency-dollar"></i>
                </span>
                <input
                  type="text"
                  class="form-control rounded-4"
                  id="floatingInputPhone"
                  placeholder="Бюджет"
                  v-model="budget"
                  :class="{
                    invalid: $v.budget.$dirty && !$v.budget.required,
                  }"
                />
              </div>
              <small
                class="f-helper-text invalid"
                v-if="$v.budget.$dirty && !$v.budget.required"
                >Поле Бюджет не должно быть пустым</small
              >
            </div>

            <div class="form-row mb-3">
              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-card-text"></i
                ></span>
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
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  name: "createSale",
  data: () => ({
    contractors: [],
    statusArr: [],
    contragent: "",
    budget: null,
    description: "",
    status: ""
  }),
  async mounted() {
    this.contractors = await this.$store.dispatch("fetchContractors");
    this.statusArr = await this.$store.dispatch("fetchSalesStatus")
    this.loading = false;

    // if (this.categories.length) {
    //   this.category = this.categories[0].id;
    // }

    this.select = this.$refs.select;
  },
  computed: {},
  validations: {
    contragent: { required },
    status: { required },
    budget: { required },
    description: { required },
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const newSale = {
          contractor_id: this.contragent,
          status: this.status,
          budget: this.budget,
          description: this.description,
          date: new Date().toJSON(),
        };

        const createdSale = await this.$store.dispatch("createSale", newSale);

        this.contragent = null;
        this.status = null;
        this.budget = null;
        this.description = null;
        //console.log(createdSale)

        this.$v.$reset();
        document.querySelector(".create-new-record-card").classList.remove("active");
        this.$message("Запись успешно создана");
        
        this.$emit("createdSale", createdSale);
      } catch (e) {
        console.log(e);
      }
    },

    closeModalCreateSale() {
      document
        .querySelector(".create-new-record-card")
        .classList.remove("active");
    },
  },
  destroyed() {},
};
</script>