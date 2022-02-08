<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <div class="text-center section">
              <v-calendar
                class="custom-calendar max-w-full"
                :masks="masks"
                :attributes="attributes"
                disable-page-swipe
                is-expanded
              >
                <template v-slot:day-content="{ day, attributes }">
                  <div class="flex flex-col h-full z-10 overflow-hidden">
                    <span class="day-label text-sm text-gray-900">{{
                      day.day
                    }}</span>
                    <div class="addNewTask" @click="onDayClick(day)">
                      <i class="bi bi-plus-lg"></i>
                    </div>
                    <div class="flex-grow overflow-y-auto overflow-x-auto">
                      <p
                        v-for="attr in attributes"
                        :key="attr.key"
                        class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                        :class="attr.customData.class"
                      >
                        {{ attr.customData.title }}
                      </p>
                    </div>
                  </div>
                </template>
              </v-calendar>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div
      class="modal modal-card py-5 create-new-task-card"
      tabindex="-1"
      role="dialog"
      :class="{show: showModalAddTask}"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-5 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0 mb-3">
            <h2 class="fw-bold mb-0">Новое задание</h2>
            <button
              @click="showModalAddTask = !showModalAddTask"
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
                    type="date"
                    class="form-control rounded-4"
                    disabled
                    id="floatingInputMail"
                    placeholder="date"
                    v-model="date"
                    :class="{
                      invalid:
                        ($v.date.$dirty && !$v.date.required),
                    }"
                  />
                </div>
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
                      invalid:
                        $v.description.$dirty && !$v.description.required,
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
  </div>
</template>

<script>
import CategoryCreate from "@/components/content/Categories/CategoryCreate";
import CategoryEdit from "@/components/content/Categories/CategoryEdit";
import { required } from "vuelidate/lib/validators";
import "@/assets/calendar.css";
export default {
  name: "categories",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
    name: '',
    date: '',
    description: '',
    masks: {
      weekdays: "WWW",
    },
    showModalAddTask: false,
    attributes: [
      {
        key: 1,
        customData: {
          title: "Lunch with mom.",
          class: "bg-success text-white",
        },
        dates: new Date(2022, 2, 1),
      },
    ],
  }),
  validations: {
    name: { required },
    date: { required },
    description: { required },
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    console.log(this.attributes);
    this.loading = false;
  },
  components: {
    CategoryCreate,
    CategoryEdit,
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(caterory) {
      const idx = this.categories.findIndex((c) => c.id === caterory.id);
      this.categories[idx].title = caterory.title;
      this.categories[idx].limit = caterory.limit;
      this.updateCount++;
    },
    onDayClick(day) {
      this.showModalAddTask = true;
      this.attributes.push({
        key: this.attributes.length + 1,
        customData: {
          title: "Задача",
          class: "bg-success text-white",
        },
        dates: new Date(day.date),
      });
    },
  },
};
</script>