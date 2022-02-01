<template>
  <nav class="navbar-glass navbar-top navbar navbar-expand navbar-light">
    <div class="left-nav-bar">
      <div class="toggle-icon-wrapper">
        <button
          id="toggleNavigationTooltip"
          type="button"
          class="btn btn-light bth-toggle-sidebar btn-sm"
          @click="hideSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
      <div class="date-holder ms-5">
        <span><i class="bi bi-calendar2 me-2"></i></span
        ><span>{{ date | date("date") }}</span>
      </div>
    </div>
    <div class="right-nav-bar">
      <!-- <button
        class="theme-control-toggle-label btn btn-sm btn-light me-3"
        @click="changeTheme"
      >
        <i class="bi bi-moon"></i>
      </button> -->
      <button class="notification-holder-btn btn btn-light btn-sm dropdown me-3"
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
        >
          {{ notReadsLength }}
          <span class="visually-hidden">unread notifications</span>
        </span>
      </button>
      <button class="messanger-holder-btn btn btn-light btn-sm dropdown me-3"
        @click="chatListShowClcik"
      >
        <i class="bi bi-chat-right-text"></i>
        <span
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
          9+
          <span class="visually-hidden">unread messages</span>
        </span>
      </button>
      <div class="dropdown user-block"
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
        <ul class="dropdown-menu dropdown-menu-end"
          :class="{ show: showUserSettings }"
        >
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-person"></i> Профиль
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-info-lg"></i> Помощь
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="bi bi-gear-wide-connected"></i> Параметры
            </router-link>
          </li>
          <li>
            <a href="#" class="dropdown-item" @click.prevent="logout">
              <i class="bi bi-box-arrow-left"></i> Выйти
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="dropdownNotificationBlock"
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
                  <span v-else>Подтвердить</span>
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
import "firebase/storage";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "@/plugins/db";
import ClickOutside from "vue-click-outside";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
import "@/assets/notCenter.css";


export default {
  data: () => ({
    showUserSettings: false,
    hideSidebarStatus: true,
    notificationShow: false,
    theme: "",
    date: new Date(),
    notifications: [],
    notReadsLength: 0
  }),
  components: {
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
    hideSidebar: function () {
      let sideBar = document.querySelector(".navbar-vertical");
      let content = document.querySelector(".content");
      if (this.hideSidebarStatus) {
        sideBar.classList.add("hidden");
        content.classList.add("full-width");
      } else {
        sideBar.classList.remove("hidden");
        content.classList.remove("full-width");
      }
      this.hideSidebarStatus = !this.hideSidebarStatus;
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
    chatListShowClcik(){
      this.$emit('chatWindowState')
    }
  },
  
  computed: {
    name() {
      return this.$store.getters.info.name;
    },
    surname() {
      return this.$store.getters.info.surname;
    },
    position() {
      return this.$store.getters.info.position;
    },
    avatar() {
      return this.$store.getters.info.avatarUrl;
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