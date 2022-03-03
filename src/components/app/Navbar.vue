<template>
  <nav class="navbar-glass navbar-top navbar navbar-expand navbar-light">
    <div class="left-nav-bar">
      <div class="toggle-icon-wrapper">
        <button
          id="toggleNavigationTooltip"
          type="button"
          class="btn bth-toggle-sidebar btn-sm"
          @click="hideSidebar"
          :class="hideSidebarStatus ? 'btn-primary' : 'btn-light'"
        >
          <i v-if="hideSidebarStatus" class="bi bi-chevron-right"></i>
          <i v-else class="bi bi-chevron-left"></i>
        </button>
      </div>
    </div>
    <div class="center-nav-bar">
      <div class="currentTask">
        <div class="currNoTask" v-if="Object.keys(runningTaskObj).length <= 0">
          Сейчас нет выполняемых задач, время <router-link to="/tasks" class="btn btn-sm btn-light">зажечь 🔥!</router-link>
        </div>
        <div v-else class="curTaskHub-wrapper">
          <div class="curTaskHub">
            <div class="row">
              <div class="col col-rntsk-nam">
                <div class="runningTaskIconState">
                  <div class="rtis" v-if="!runningTaskPause">🔥</div>
                  <div class="rtis" v-else>💤</div>
                </div>
                <div class="taskName">
                  <div class="name">{{ runningTaskObj.name }}</div>
                  <div class="taskTime">
                    {{ runningTaskTime | time() }}
                  </div>
                </div>
              </div>
              <div class="col p-0">
                <div class="thb-contr">
                  <button
                    class="btn btn-sm btn-light"
                    v-if="!runningTaskPause"
                    @click="pauseTask"
                  >
                    <i class="bi bi-pause"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    v-else
                    @click="runTask"
                  >
                    <i class="bi bi-play" key=""></i>
                  </button>
                </div>
              </div>
              <div class="col">
                <button class="btn btn-sm btn-light" @click="closeTask">
                  <i class="bi bi-check-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-nav-bar">
      <button
        class="notification-holder-btn btn btn-sm dropdown me-3"
        :class="notificationShow ? 'btn-primary' : 'btn-light'"
        @click="notificationShow = !notificationShow"
      >
        <i class="bi bi-bell"></i>
        <span
          class="
            position-absolute
            top-0
            start-100
            translate-middle
            badge
            rounded-pill
            bg-primary
          "
          v-if="notReadsLength > 0"
        >
          {{ notReadsLength }}
        </span>
      </button>
      <button
        class="messanger-holder-btn btn btn-light btn-sm dropdown me-3"
        @click="chatListShowClcik"
      >
        <i class="bi bi-chat-right-text"></i>
        <span
          id="unreadMSG"
          class="
            position-absolute
            top-0
            start-100
            translate-middle
            badge
            rounded-pill
            bg-danger
          "
        >
        </span>
      </button>
      <div
        class="dropdown user-block"
        :class="{ active: showUserSettings }"
        @click="showUserSettings = !showUserSettings"
        v-click-outside="closeDropDown"
      >
        <div
          class="avatar avatar-xl user-image"
          :style="{ backgroundImage: 'url(' + avatar + ')' }"
        ></div>
        <div class="user-name">
          <span class="dropdown-toggle">{{ name }} {{ surname }}</span>
          <small>{{ position }}</small>
        </div>
        <ul
          class="dropdown-menu dropdown-menu-end"
          :class="{ show: showUserSettings }"
        >
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-person me-2"></i> Профиль
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-info-lg me-2"></i> Помощь
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-gear-wide-connected me-2"></i> Параметры
            </router-link>
          </li>
          <li>
            <a href="#" class="dropdown-item" @click.prevent="logout">
              <i class="bi bi-box-arrow-left me-2"></i> Выйти
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="dropdownNotificationBlock"
      :class="{ active: notificationShow }"
    >
      <div v-for="n of notifications" :key="n.id" class="noticication_cards">
        <div class="notificationCard card mb-1">
          <div class="nf-row">
            <div class="nf-col-bell">
              <div class="n-icon">
                <i class="bi bi-bell"></i>
              </div>
              <div
                class="notification-status"
                :class="n.isRead ? ' nf-viewed' : ' nf-not-viewed'"
              >
                <i class="bi bi-circle-fill"></i>
              </div>
            </div>
            <div class="nf-col-text">
              <div class="nf-header">
                <div class="n_author">от: {{ n.author }}</div>
                <div class="d_date">
                  {{ n.date | date("datetime") }}
                </div>
              </div>

              <div class="n_header" v-html="n.header"></div>
              <div class="n_text" v-html="n.content"></div>
              <div class="nf_confirm_button">
                <button
                  :data-id="n.id"
                  class="btn btn-sm"
                  @click="notCardClicked"
                  :class="n.isRead ? ' btn-secondary' : ' btn-primary'"
                  :disabled="n.isRead"
                >
                  <span v-if="n.isRead">Прочитано</span>
                  <span v-else>Прочитать</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import "firebase/compat/storage";
import "firebase/compat/firestore";
//import firebase from "firebase/app";
import { db } from "@/plugins/db";
import ClickOutside from "vue-click-outside";
import "emoji-mart-vue-fast/css/emoji-mart.css";
// import data from "emoji-mart-vue-fast/data/all.json";
// import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
import "@/assets/notCenter.css";
import { mapState } from "vuex";

export default {
  data: () => ({
    showUserSettings: false,
    hideSidebarStatus: null,
    notificationShow: false,
    theme: "",
    date: new Date(),
    notifications: [],
    notReadsLength: 0,
    hsbActive: false,
    runningTaskObj: {},
    runningTaskPause: "",
    runningTaskTime: "",
    timerId: "",
    tid: "",
  }),
  components: {},
  created() {
    this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === "setRunTask") {
        this.runningTaskPause = state.runningTask.pauseState;
        let tid = state.runningTask.tid;

        if (tid.length > 1) {
          this.tid = tid;
          this.runningTaskObj = await this.$store.dispatch(
            "fetchTaskById",
            tid
          );
        } else {
          this.tid = tid;
          this.runningTaskObj = {};
        }

        this.runningTaskTime = await this.$store.dispatch("fetchTaskTimeById", {
          uid: this.uid,
          tid: this.tid,
        });

        if (!this.runningTaskPause) {
          this.startTimer(this.runningTaskTime);
        } else {
          this.pauseTimer();
        }
      }
    });
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
    async runTask() {
      let taskId = this.tid;
      let payload = { tid: taskId, pauseState: false };
      this.$store.commit("setRunTask", payload);
      await this.$store.dispatch("setCurrentTaskRun", taskId);
    },

    async pauseTask() {
      let taskId = this.tid;
      let payload = { tid: taskId, pauseState: true };
      this.$store.commit("setRunTask", payload);
      await this.$store.dispatch("setCurrentTaskPause", taskId);
      this.runningTaskTime = await this.$store.dispatch("fetchTaskTimeById", {
        uid: this.uid,
        tid: this.tid,
      });
      // await this.$store.dispatch("setTaskTime", taskId);
    },

    async closeTask() {
      let taskId = this.tid;
      let payload = { tid: taskId, pauseState: true };
      this.$store.commit("setRunTask", payload);
      await this.$store.dispatch("setCurrentTaskPause", taskId);
      this.runningTaskTime = await this.$store.dispatch("fetchTaskTimeById", {
        uid: this.uid,
        tid: this.tid,
      });
      await this.$store.dispatch("closeTask", this.tid);
      this.runningTaskObj = {};
      this.runningTaskPause = "";
      this.runningTaskTime = "";
    },
    hideSidebar() {
      this.hideSidebarStatus = !this.hideSidebarStatus;
      this.$cookies.set(
        "hideSidebarStatus",
        this.hideSidebarStatus,
        60 * 60 * 24 * 30
      );
      let sideBar = document.querySelector(".navbar-vertical");
      let content = document.querySelector(".content");
      if (this.hideSidebarStatus) {
        sideBar.classList.add("hidden");
        content.classList.add("full-width");
      } else {
        sideBar.classList.remove("hidden");
        content.classList.remove("full-width");
      }
    },
    closeDropDown() {
      document
        .querySelectorAll(".dropdown-menu")
        .forEach((el) => el.classList.remove("show"));
      this.showUserSettings = false;
    },
    async notCardClicked(el) {
      var btn = el.currentTarget;
      if (btn.firstChild.data == "Подтвердить") {
        btn.firstChild.data = "Прочитано";
      }
      const id = el.currentTarget.getAttribute("data-id");
      const nota = this.notifications.find((el) => el.id == id);
      if (!nota.viewedUsers.includes(this.uid)) {
        let viewedUsersArr = nota.viewedUsers;
        viewedUsersArr.push(this.uid);
        db.collection("notifications")
          .doc(id)
          .update({ viewedUsers: viewedUsersArr });
      }
    },
    close(e) {
      if (e.path) {
        let c = 0;
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i].classList) {
            if (e.path[i].classList.contains("chatListSearch")) {
              c++;
            }
          }
        }
        if (c == 0) {
          this.showUserListPanel = false;
        }
      }
    },
    chatListShowClcik() {
      this.$emit("chatWindowState");
    },
    startTimer(time) {
      this.runningTaskTime = time;
      this.timerId = setInterval(() => (this.runningTaskTime += 1000), 1000);
    },
    pauseTimer() {
      clearInterval(this.timerId);
      this.timerId = null;
    },
    handler: function handler(event) {
      // Do Something
    },
  },
  computed: {
    name() {
      return this.$store.getters.info.name;
    },
    surname() {
      return this.$store.getters.info.surname;
    },
    position() {
      return this.$store.getters.info.positionName;
    },
    avatar() {
      return this.$store.getters.info.avatarUrl;
    },
    mapState() {
      runningTask: (state) => state.runningTask;
    },
  },
  firestore: {
    notifications: db.collection("notifications").orderBy("date", "desc"),
  },
  watch: {
    notifications: async function () {
      this.notifications.map((obj) => ({ ...obj, isRead: false }));
      this.notReadsLength = 0;
      if (this.notifications) {
        for (let i = 0; i < this.notifications.length; i++) {
          if (!this.notifications[i].viewedUsers.includes(this.uid)) {
            this.notReadsLength++;
            this.notifications[i].isRead = false;
          } else {
            this.notifications[i].isRead = true;
          }
        }
      }
    },
  },
  async mounted() {
    this.uid = await this.$store.dispatch("getUid");
    const tid = await this.$store.dispatch("getCurrentRunTaskId", this.uid);
    if (tid.length > 1) {
      const curTask = await this.$store.dispatch("getCurrentRunTask", this.uid);
      this.tid = tid;
      this.runningTaskObj = await this.$store.dispatch("fetchTaskById", tid);

      this.runningTaskTime = await this.$store.dispatch("fetchTaskTimeById", {
        uid: this.uid,
        tid: tid,
      });

      this.runningTaskPause = curTask.pause;

      if (!this.runningTaskPause) {
        this.runningTaskTime =
          this.runningTaskTime + (new Date() - new Date(curTask.dateStart));
        this.startTimer(this.runningTaskTime);
      }
    }else{
      this.runningTaskObj = {}
    }

    this.hideSidebarStatus = JSON.parse(
      this.$cookies.get("hideSidebarStatus").toLowerCase()
    );

    if (this.hideSidebarStatus == undefined) {
      this.$cookies.set("hideSidebarStatus", false, 60 * 60 * 24 * 30);
      this.hideSidebarStatus = false;
    }

    let sideBar = document.querySelector(".navbar-vertical");
    let content = document.querySelector(".content");

    if (this.hideSidebarStatus) {
      sideBar.classList.add("hidden");
      content.classList.add("full-width");
    } else {
      sideBar.classList.remove("hidden");
      content.classList.remove("full-width");
    }

    this.theme = this.$cookies.get("theme");
    this.date = new Date();
    let ref = this.$store.getters.info.avatarUrl;
    document.querySelector(".user-image").style.backgroundImage =
      "url(" + ref + ")";
    document.addEventListener("click", this.close);
  },
  directives: {
    ClickOutside,
  },
  beforeDestroy() {
    document.removeEventListener("click", this.close);
  },
};
</script>