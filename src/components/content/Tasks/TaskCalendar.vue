<template>
  <div class="text-center section">
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
      @dayclick="onDayClick"
    >
      <template v-slot:day-content="{ day, attributes, dayEvents }">
        <div class="flex flex-col h-full z-10 overflow-hidden" v-on="dayEvents">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="t in attributes"
              :key="t.key"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="t.customData.class"
            >
              {{ t.customData.title }}
            </p>
          </div>
        </div>
      </template>
      <template #day-popover="{ dayTitle, attributes }">
        <div>
          <div class="text-xs text-gray-300 font-semibold text-center">
            {{ dayTitle }}
          </div>
          <popover-row
            v-for="attr in attributes"
            :key="attr.key"
            :attribute="attr"
          >
            <div
              class="cal-popover-indicator"
              :class="attr.customData.class"
            ></div>
            <div class="cal-popover-name">{{ attr.customData.name }}</div>
          </popover-row>
        </div>
      </template>
    </v-calendar>
    <div
      class="modal modal-card py-5 create-new-task-card"
      tabindex="-1"
      role="dialog"
      :class="{ active: showModalEditTask }"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content rounded-5 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0 mb-3">
            <h2 class="fw-bold mb-0">{{ dayChosenName }}</h2>
            <button
              @click="showModalEditTask = !showModalEditTask"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-5 pt-0">
            <div class="d-flex align-items-start">
              <div class="tbc-list" aria-orientation="vertical">
                <div
                  class="taskModalNav"
                  :class="choosenModalTask == d.key ? 'active' : ''"
                  :data-id="d.key"
                  v-for="d in dayTasks"
                  :key="d.key"
                  @click="selectModalTask"
                >
                  <span
                    class="me-2 taskStatusTip"
                    :class="d.customData.class"
                  ></span>
                  <span>{{ d.customData.name }}</span>
                </div>
              </div>
              <div class="tab-content-tasks">
                <div class="tbc-header mb-3">
                  <div class="tbc-controls">
                    <button
                      class="btn btn-sm btn-primary me-3"
                      @click="pauseTask"
                      v-if="
                        runningTask == choosenModalTask && !runningTaskPause
                      "
                    >
                      <i class="bi bi-pause"></i>
                      Приостановить выполнение
                    </button>
                    <button
                      class="btn btn-sm btn-primary me-3"
                      @click="runTask"
                      v-else
                    >
                      <i class="bi bi-play" key=""></i>
                      Начать выполнение
                    </button>
                    <button
                      class="btn btn-sm btn-light"
                      v-if="taskstatus == 'closed'"
                      @click="closeTask"
                    >
                      <i class="bi bi-check-circle"></i>
                      Завершено
                    </button>

                    <button
                      class="btn btn-sm btn-success"
                      v-else
                      @click="closeTask"
                    >
                      <i class="bi bi-check-circle"></i>
                      Завершить
                    </button>
                  </div>
                </div>
                <div class="tbc">
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
                            :limit="1"
                            :limitText="(count) => `+${count}`"
                            label="name"
                            track-by="name"
                            :preselect-first="true"
                          >
                          </multiselect>
                        </div>
                      </div>
                      <div class="row mb-3"></div>
                      <div class="col-4">
                        <label for="" class="form-label">Крайний срок</label>
                        <div class="input-group input-date-range">
                          <span class="input-group-text"
                            ><i class="bi bi-calendar-week"></i
                          ></span>
                          <v-date-picker
                            v-model="dateEnd"
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
                        <div class="col-4">
                          <label for="" class="form-label">Дата начала</label>
                          <div class="input-group input-date-range">
                            <span class="input-group-text pe-3"
                              ><i class="bi bi-calendar-week"></i
                            ></span>
                            <v-date-picker
                              v-model="dateStart"
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
                        <div class="col-4">
                          <label for="" class="form-label"
                            >Дата выполнения</label
                          >
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
                            selectedLabel="Выбрано"
                            selectLabel="Выбрать"
                            deselectLabel="Отменить выбор"
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
                            <label for="" class="form-label"
                              >Описание задачи</label
                            >
                            <small
                              class="f-helper-text invalid ms-3"
                              v-if="
                                $v.description.$dirty &&
                                !$v.description.required
                              "
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
                          Обновить
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import PopoverRow from "v-calendar/lib/components/popover-row.umd.min";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import quillEmoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { quillEditor } from "vue-quill-editor";
import "@/assets/calendar.css";
export default {
  data: () => ({
    title: "",
    masks: {
      weekdays: "WWW",
    },
    taskList: [],
    showModalAddTask: false,
    showModalEditTask: false,
    attributes: [],
    dayTasks: [],
    dayChosenName: "",
    impTask: false,
    name: "",
    dateStart: "",
    dateEnd: "",
    datePlanEnd: "",
    description: "",
    author: [],
    users: [],
    choosenModalTask: "",
    responsibleUsers: [],
    runningTask: "",
    runningTaskPause: false,
    taskstatus: '',
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
  props: {
    tasks: {
      required: true,
      type: Array,
    },
  },
  validations: {
    name: { required },
    description: { required },
    responsibleUsers: { required },
  },
  async mounted() {
    let users = await this.$store.dispatch("fetchUsers");
    const uid = this.$store.state.info.info.uid;
    const runningTask = await this.$store.dispatch("getCurrentRunTask", uid);
    this.runningTask = runningTask.id;
    this.runningTaskPause =
      this.$store.state.runningTaskPause || runningTask.pause;
    for (let i = 0; i < users.length; i++) {
      this.users.push({
        id: users[i].id,
        name: users[i].info.name + " " + users[i].info.surname,
      });
    }
  },
  asyncComputed: {
    async fetchTasks() {
      for (let i = 0; i < this.tasks.length; i++) {
        this.tasks[i].key = this.tasks[i].id;
        this.tasks[i].dates = [
          {
            start: new Date(this.tasks[i].dateStart),
            end: new Date(this.tasks[i].dateDeadLine),
          },
        ];
        if (new Date(this.tasks[i].dateDeadLine) < new Date()) {
          this.tasks[i].statusClass = "bg-danger";
        }
        if (new Date(this.tasks[i].dateDeadLine) == new Date()) {
          this.tasks[i].statusClass = "bg-warning";
        }
        if (new Date(this.tasks[i].dateDeadLine) > new Date()) {
          this.tasks[i].statusClass = "bg-primary";
        }
        if (this.tasks[i].status == "closed") {
          this.tasks[i].statusClass = "bg-task-closed";
        }
        this.tasks[i].popover = {
          label: this.tasks[i].name,
        };
        this.tasks[i].customData = {
          dateClose: this.tasks[i].dateClose,
          dateDeadLine: this.tasks[i].dateClose,
          dateExpect: this.tasks[i].dateClose,
          dateStart: this.tasks[i].dateClose,
          description: this.tasks[i].description,
          important: this.tasks[i].important,
          name: this.tasks[i].name,
          responsible: this.tasks[i].responsible,
          status: this.tasks[i].status,
          taskManager: this.tasks[i].taskManager,
          class: this.tasks[i].statusClass + " text-white",
        };
      }
      this.attributes = this.tasks;
    },
  },
  computed: {
    pstsk() {
      return this.$store.state.runningTaskPause;
    },
  },
  watch: {
    pstsk(st) {
      this.runningTaskPause = st;
    },
  },
  methods: {
    onDayClick(day) {
      this.showModalEditTask = !this.showModalEditTask;
      this.dayChosenName = day.ariaLabel;
      this.dayTasks = day.attributes.map((obj) => ({
        ...obj,
        ariaLabel: day.ariaLabel,
      }));
      this.selectModalTask(null, this.dayTasks[0].key);
    },
    async selectModalTask(el, id) {
      if (el == undefined || el == null) {
        this.choosenModalTask = id;
      } else {
        this.choosenModalTask = el.currentTarget.getAttribute("data-id");
      }
      const task = await this.$store.dispatch(
        "fetchTaskById",
        this.choosenModalTask
      );
      this.name = task.name;
      this.dateEnd = task.dateDeadLine;
      this.datePlanEnd = task.dateExpect;
      this.dateStart = task.dateStart;
      this.impTask = task.important;
      this.taskstatus = task.status;
      let authors = [],
        responsibleU = [];
      for (let i = 0; i < task.taskManager.length; i++) {
        let info = await this.$store.dispatch(
          "fetchInfoById",
          task.taskManager[i]
        );
        authors.push({
          id: task.taskManager[i],
          name: info.name + " " + info.surname,
        });
      }
      for (let i = 0; i < task.responsible.length; i++) {
        let info = await this.$store.dispatch(
          "fetchInfoById",
          task.responsible[i]
        );
        responsibleU.push({
          id: task.responsible[i],
          name: info.name + " " + info.surname,
        });
      }
      this.responsibleUsers = responsibleU;
      this.author = authors;
    },
    async runTask() {
      if (this.runningTask.length > 1) {
        await this.$store.dispatch("setCurrentTaskStop", this.runningTask);
        this.runningTask = this.choosenModalTask;
        let payload = { tid: this.choosenModalTask, pauseState: false };
        this.$store.commit("setRunTask", payload);
        await this.$store.dispatch("setCurrentTaskRun", this.runningTask);
      } else {
        this.runningTask = this.choosenModalTask;
        let payload = { tid: this.choosenModalTask, pauseState: false };
        this.$store.commit("setRunTask", payload);
        await this.$store.dispatch("setCurrentTaskRun", this.runningTask);
      }
      this.runningTaskPause = false;
    },
    async pauseTask() {
      const newState = await this.$store.dispatch(
        "setCurrentTaskPause",
        this.runningTask
      );
      let payload = { tid: this.runningTask, pauseState: true };
      this.$store.commit("setRunTask", payload);
      this.runningTask = "";
    },
    async closeTask() {
      await this.$store.dispatch("closeTask", this.choosenModalTask);
    },
  },
  components: {
    PopoverRow,
    quillEditor,
  },
};
</script>