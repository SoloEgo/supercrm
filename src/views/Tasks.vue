<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="pahe-header"><h3>Задачи</h3></div>
      <div class="page-controls">
        <button
          class="btn btn-sm me-3"
          :class="displayCalendar ? 'btn-primary' : 'btn-light'"
          @click="bthDisplayHnadler"
        >
          <i class="bi bi-calendar3"></i>
        </button>
        <button
          class="btn btn-sm me-3"
          :class="!displayCalendar ? 'btn-primary' : 'btn-light'"
          @click="bthDisplayHnadler"
        >
          <i class="bi bi-card-list"></i>
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="showModalAddTask = !showModalAddTask"
        >
          <i class="bi bi-plus-square"></i> Новая задача
        </button>
      </div>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <TaskCalendar v-if="displayCalendar" />
            <TaskBlock v-else />
          </div>
        </div>
      </div>
    </section>
    <div
      class="modal modal-card py-5 create-new-task-card"
      tabindex="-1"
      role="dialog"
      :class="{ active: showModalAddTask }"
    >
      <div class="modal-dialog modal-xl" role="document">
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
              <div class="form-row row mb-3">
                <div class="col">
                  <div class="input-group">
                    <span class="input-group-text"
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
                <div class="col">
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="bi bi-bootstrap"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      id="floatingInputName"
                      placeholder="Постановщик"
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
                <div class="col">
                  <div class="input-group input-date-range">
                    <span class="input-group-text"
                      ><i class="bi bi-calendar-week"></i
                    ></span>
                    <v-date-picker v-model="dateStart" mode="dateTime" is24hr>
                      <template v-slot="{ inputValue, inputEvents }">
                        <input
                          class="form-control rounded-4"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </template>
                    </v-date-picker>
                    <span class="input-group-text"
                      ><i class="bi bi-arrow-right"></i
                    ></span>
                    <v-date-picker v-model="dateEnd" mode="dateTime" is24hr>
                      <template v-slot="{ inputValue, inputEvents }">
                        <input
                          class="form-control rounded-4"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </template>
                    </v-date-picker>
                  </div>
                </div>
              </div>
              <div class="row mb-3 me-3">
                  <div class="inputMultiSelect">
                    <span class="input-group-text"
                      ><i class="bi bi-bootstrap"></i
                    ></span>
                    <multiselect
                      v-model="responsibleUsers"
                      :options="options"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      placeholder="Ответственный"
                      class="form-control rounded-4"
                      :limit="3"
                      label="name"
                      track-by="name"
                      :preselect-first="true"
                    >
                    </multiselect>
                  </div>
              </div>
              <div class="row me-3">
                <quill-editor
                  ref="myQuillEditor"
                  v-model="description"
                  :options="editorOption"
                />
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
import TaskBlock from "@/components/content/Tasks/TaskBlock";
import TaskCalendar from "@/components/content/Tasks/TaskCalendar";
import { required } from "vuelidate/lib/validators";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import quillEmoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { quillEditor } from "vue-quill-editor";
import "@/assets/tasks.css";
export default {
  name: "categories",
  data: () => ({
    loading: true,
    name: "",
    dateStart: "",
    dateEnd: "",
    description: "",
    responsibleUsers: "",
    displayCalendar: false,
    showModalAddTask: false,
    range: {
      start: new Date(2020, 9, 12),
      end: new Date(2020, 9, 16),
    },
    options: [
      { name: "Vue.js", language: "JavaScript" },
      { name: "Rails", language: "Ruby" },
      { name: "Sinatra", language: "Ruby" },
      { name: "Laravel", language: "PHP" },
      { name: "Phoenix", language: "Elixir" },
    ],
    editorOption: {
      theme: "snow",
      modules: {
        "emoji-toolbar": true,
        "emoji-shortname": true,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image"],
        ],
      },
    },
  }),
  validations: {
    name: { required },
    description: { required },
  },
  async mounted() {
    this.displayCalendar = this.$cookies.get("tasksDisplayTable") === "true";
    this.loading = false;
  },
  components: {
    TaskBlock,
    TaskCalendar,
    quillEditor,
  },
  methods: {
    bthDisplayHnadler() {
      this.displayCalendar = !this.displayCalendar;
      this.$cookies.set(
        "tasksDisplayTable",
        this.displayCalendar,
        60 * 60 * 24 * 30
      );
    },
  },
};
</script>