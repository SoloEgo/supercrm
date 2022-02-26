<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <div class="pahe-header"><h3>Задачи</h3></div>
      <div class="page-controls">
        <div class="form-check me-3">
          <input
            class="form-check-input"
            type="checkbox"
            :value="true"
            v-model="iManage"
            @change="taskResManCheck()"
            checked="checked"
            id="iManage"
          />
          <label class="form-check-label" for="iManage"> Я постановщик </label>
        </div>
        <div class="form-check me-3">
          <input
            class="form-check-input"
            type="checkbox"
            :value="true"
            v-model="iResp"
            @change="taskResManCheck()"
            checked="checked"
            id="iResposn"
          />
          <label class="form-check-label" for="iResposn">
            Я ответственный
          </label>
        </div>
        <div class="pagecontrol-btns">
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
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
          <div class="card white-card minh-100">
            <TaskCalendar
              :tasks="tasks"
              :key="tasks.length"
              v-if="displayCalendar"
            />
            <TaskBlock :taskList="tasks" :key="tasks.length" v-else />
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
              <div class="row me-3 mb-3">
                <div class="col-5">
                  <label for="" class="form-label">Наименование</label>
                  <small
                    class="f-helper-text invalid ms-3"
                    v-if="$v.name.$dirty && !$v.name.required"
                    >Поле Наименование не должно быть пустым</small
                  >
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="bi bi-bootstrap"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      id="floatingInputName"
                      placeholder=""
                      v-model="name"
                      :class="{
                        invalid: $v.name.$dirty && !$v.name.required,
                      }"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <label for="" class="form-label">Постановщик</label>
                  <div class="inputMultiSelect">
                    <span class="input-group-text"
                      ><i class="bi bi-bootstrap"></i
                    ></span>
                    <multiselect
                      v-model="author"
                      :options="users"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      selectedLabel="Выбрано"
                      selectLabel="Выбрать"
                      deselectLabel="Отменить выбор"
                      placeholder=""
                      class="form-control rounded-4"
                      :limit="3"
                      :limitText="(count) => `+${count}`"
                      label="name"
                      track-by="name"
                      :preselect-first="true"
                    >
                    </multiselect>
                  </div>
                </div>
                <div class="row mb-3"></div>
                <div class="col-3">
                  <label for="" class="form-label">Крайний срок</label>
                  <div class="input-group input-date-range">
                    <span class="input-group-text"
                      ><i class="bi bi-calendar-week"></i
                    ></span>
                    <v-date-picker v-model="dateEnd" mode="dateTime" is24hr>
                      <template v-slot="{ inputValue, inputEvents }">
                        <input
                          class="form-control"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </template>
                    </v-date-picker>
                  </div>
                </div>
                <div class="col">
                  <div class="dopTime">
                    <button
                      class="btn btn-light btn-time-control"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#taskTimeCollapse"
                      aria-expanded="false"
                      aria-controls="taskTimeCollapse"
                    >
                      <span>Планирование сроков</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="collapse" id="taskTimeCollapse">
                <div class="row">
                  <div class="col-2">
                    <label for="" class="form-label">Дата начала</label>
                    <div class="input-group input-date-range">
                      <span class="input-group-text pe-3"
                        ><i class="bi bi-calendar-week"></i
                      ></span>
                      <v-date-picker v-model="dateStart" mode="dateTime" is24hr>
                        <template v-slot="{ inputValue, inputEvents }">
                          <input
                            class="form-control"
                            :value="inputValue"
                            v-on="inputEvents"
                          />
                        </template>
                      </v-date-picker>
                    </div>
                  </div>
                  <div class="col-2">
                    <label for="" class="form-label">Дата выполнения</label>
                    <div class="input-group input-date-range">
                      <span class="input-group-text pe-3"
                        ><i class="bi bi-calendar-week"></i
                      ></span>
                      <v-date-picker
                        v-model="datePlanEnd"
                        mode="dateTime"
                        is24hr
                      >
                        <template v-slot="{ inputValue, inputEvents }">
                          <input
                            class="form-control"
                            :value="inputValue"
                            v-on="inputEvents"
                          />
                        </template>
                      </v-date-picker>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-3 me-3">
                <div class="col">
                  <label for="" class="form-label">Ответственные</label>
                  <small
                    class="f-helper-text invalid ms-3"
                    v-if="
                      $v.responsibleUsers.$dirty &&
                      !$v.responsibleUsers.required
                    "
                    >Поле Ответственные не должно быть пустым</small
                  >
                  <div class="inputMultiSelect">
                    <span class="input-group-text"
                      ><i class="bi bi-bootstrap"></i
                    ></span>
                    <multiselect
                      v-model="responsibleUsers"
                      :options="users"
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
              </div>
              <div class="row me-3">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <label for="" class="form-label">Описание задачи</label>
                      <small
                        class="f-helper-text invalid ms-3"
                        v-if="$v.description.$dirty && !$v.description.required"
                        >Поле описание не должно быть пустым</small
                      >
                    </div>
                    <div class="col text-end">
                      <div class="tsakImpChec1k">
                        <input
                          type="checkbox"
                          class="form-check-input me-2"
                          v-model="impTask"
                          id="impTask"
                        />
                        <label class="form-check-label" for="impTask"
                          >Это важная задача
                          <i class="bi bi-lightning-charge-fill"></i
                        ></label>
                      </div>
                    </div>
                  </div>
                  <quill-editor
                    ref="myQuillEditor"
                    v-model="description"
                    :options="editorOption"
                  />
                </div>
              </div>

              <div class="form-row mt-3 mb-3">
                <div class="col-2">
                  <button
                    class="w-100 mb-2 btn btn-lg rounded-4 btn-primary"
                    type="submit"
                    @click.prevent="submitHandler"
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
  name: "taskPage",
  data: () => ({
    loading: true,
    displayCalendar: false,
    showModalAddTask: false,
    impTask: false,
    name: "",
    dateStart: "",
    dateEnd: "",
    datePlanEnd: "",
    description: "",
    author: [],
    responsibleUsers: [],
    users: [],
    range: {
      start: new Date(2020, 9, 12),
      end: new Date(2020, 9, 16),
    },
    iManage: true,
    iResp: true,
    tasks: [],
    tasksReal: [],
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
    responsibleUsers: { required },
  },
  async mounted() {
    let tasksManage = this.$store.state.tasksManage;
    let tasksResponse = this.$store.state.tasksResponse;
    this.tasksReal = Object.assign(tasksManage, tasksResponse);
    this.tasks = this.tasksReal;
    this.displayCalendar = this.$cookies.get("tasksDisplayTable") === "true";
    this.dateStart = new Date();
    this.loading = false;
    let users = await this.$store.dispatch("fetchUsers");
    const uid = await this.$store.dispatch("getUid");
    const currentUser = users.filter((u) => u.id == uid)[0].info;
    this.author.push({
      id: uid,
      name: currentUser.name + " " + currentUser.surname,
    });
    for (let i = 0; i < users.length; i++) {
      this.users.push({
        id: users[i].id,
        name: users[i].info.name + " " + users[i].info.surname,
      });
    }
  },
  components: {
    TaskBlock,
    TaskCalendar,
    quillEditor,
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        let newTask = {
          dateClose: "",
          dateDeadLine: this.dateEnd.toJSON(),
          dateExpect: this.datePlanEnd.toJSON(),
          dateStart: this.dateStart.toJSON(),
          description: this.description,
          important: this.impTask,
          name: this.name,
          responsible: [
            ...new Set(this.responsibleUsers.map((item) => item.id)),
          ],
          taskManager: [...new Set(this.author.map((item) => item.id))],
          status: "",
        };
        await this.$store.dispatch("createTask", newTask);
        this.name = "";
        this.author = "";
        this.dateStart = "";
        this.dateEnd = "";
        this.datePlanEnd = "";
        this.description = "";
        this.impTask = "";
        this.responsibleUser = "";
        this.$message("Задача успешно создана");
      } catch (e) {
        console.log(e);
      }
    },
    bthDisplayHnadler() {
      this.displayCalendar = !this.displayCalendar;
      this.$cookies.set(
        "tasksDisplayTable",
        this.displayCalendar,
        60 * 60 * 24 * 30
      );
    },
    async taskResManCheck() {
      const uid = await this.$store.dispatch("getUid");
      let tempTasksManage = this.tasksReal.slice();
      let tempTasksPesp = this.tasksReal.slice();
      if (this.iManage) {
        tempTasksManage = tempTasksManage.filter(
          (it) => it.taskManager.indexOf(uid) >= 0
        );
      } else {
        tempTasksManage = []
      }

      if (this.iResp) {
        tempTasksPesp = tempTasksPesp.filter(
          (it) => it.responsible.indexOf(uid) >= 0
        );
      } else {
        tempTasksPesp = []
      }
      let tempTasks = tempTasksManage.concat(tempTasksPesp);
      const idsTmp = tempTasks.map(o => o.id)
      const filtered = tempTasks.filter(({id}, index) => !idsTmp.includes(id, index + 1))
      this.tasks = filtered;

    },
  },
  created() {
    this.$store.dispatch("bindTasksManage");
    this.$store.dispatch("bindTasksResponse");
  },
};
</script>