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
      <!-- <div class="search-box dropdown">
        <div class="toggle" id="" aria-expanded="false" data-toggle="dropdown">
          <form class="position-relative">
            <div class="input-group  input-group-sm">
              
              <input
              placeholder="Search..."
              aria-label="Search"
              type="search"
              class="search-input form-control form-control-sm"
              value=""
            />
            <span class="input-group-text" id="basic-addon"><i class="bi bi-search"></i></span>
            </div>
            
          </form>
        </div>
      </div> -->
      <div class="date-holder ms-5">
        <span><i class="bi bi-calendar2 me-2"></i></span
        ><span>{{ date | date("date") }}</span>
      </div>
    </div>
    <div class="right-nav-bar">
      <button
        class="theme-control-toggle-label btn btn-sm btn-light me-3"
        @click="changeTheme"
      >
        <i class="bi bi-moon"></i>
      </button>
      <button
        class="notification-holder-btn btn btn-light btn-sm dropdown me-3"
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
      <button
        class="messanger-holder-btn btn btn-light btn-sm dropdown me-3"
        @click="chatListShow = !chatListShow"
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
              <i class="bi bi-person"></i> Профиль
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
                  <span v-else>Подтвердить</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chatListWrapper" :class="{ active: chatListShow }">
      <div class="chatListHeader">
        <div class="chatListSearch">
          <input
            placeholder="Search..."
            aria-label="Search"
            type="search"
            class="search-input form-control"
            v-model="searchChat"
            value=""
          />
        </div>
      </div>
      <div class="chatListHeading">Контакты</div>
      <div class="chatListBody">
        <div class="chatList">
          <div class="chatListCard" v-for="r of chartRooms" :key="r.id + uChange">
            <div class="chat_row">
              <div class="chatUI">
                <div
                  class="user-status"
                  :class="r.userOnline ? 'usr-online' : 'usr-offline'"
                ></div>
                <div
                  class="chatUserImage"
                  :style="{ backgroundImage: 'url(' + r.avatar + ')' }"
                ></div>
              </div>
              <div class="chatUText">
                <div class="chutHeader">
                  <div class="chutName">
                    {{ r.name }}
                  </div>
                  <div class="chutDate">
                    {{ r.lastMessageDate | date("datetime") }}
                  </div>
                </div>
                <div class="chutLastMessage">
                  <div class="chutlm">{{ r.lastMessage }}</div>
                </div>
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
import "@/assets/chatList.css";

export default {
  data: () => ({
    uid: null,
    showUserSettings: false,
    date: new Date(),
    dateInterval: null,
    hideSidebarStatus: true,
    notificationShow: false,
    theme: "",
    notifications: [],
    notReadsLength: 0,
    chatListShow: false,
    searchChat: "",
    usersOnline: [],
    usersChat: [],
    messages: [],
    rooms: [],
    chartRooms: [],
    uChange: 0
  }),
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
    async changeTheme() {
      let rootEl = document.querySelector(".app-main-layout-wrapper");
      if (this.theme == "lightTheme") {
        rootEl.classList.remove("lightTheme");
        rootEl.classList.add("darkTheme");
        this.theme = "darkTheme";
        this.$cookies.set("theme", "darkTheme", 60 * 60 * 24 * 30);
      } else {
        rootEl.classList.add("lightTheme");
        rootEl.classList.remove("darkTheme");
        this.theme = "lightTheme";
        this.$cookies.set("theme", "lightTheme", 60 * 60 * 24 * 30);
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
    //   fetchMessageById(groupId, messageId) {
    //     let ms = db
    //       .collection("messageGroup")
    //       .doc(groupId)
    //       .collection("messages")
    //       .doc(messageId)
    //       .get()
    //       .then((snapshot) => {
    //         if (snapshot.exists) {
    //           console.log(snapshot.data());
    //           let message = snapshot.data();
    //           return message.messageText;
    //         } else {
    //           console.log("No such document!");
    //         }
    //       });
    //   },
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
    usersOnline: db.collection("users"),
    messages: db.collection("messageGroup"),
    rooms: db.collection("rooms"),
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
    usersOnline: async function () {
      let onlineUsers = this.usersOnline;
      if (onlineUsers) {
        let chartRooms = this.chartRooms;
        if (chartRooms.length > 0) {          
          for (let i = 0; i < chartRooms.length; i++) {
            if (chartRooms[i].singleChart) {
              for (let z = 0; z < onlineUsers.length; z++) {
                if(onlineUsers[z].id == chartRooms[i].members[0]){
                  chartRooms[i].userOnline = onlineUsers[z].online
                }                
              }
            }
          }
            
          this.chartRooms = chartRooms;
          this.uChange ++
          console.log(this.chartRooms)   
        }
      }
      
    },
    rooms: async function () {
      if (this.rooms) {
        const uid = await this.$store.dispatch("getUid");
        let rooms = new Array();
        for (let i = 0; i < this.rooms.length; i++) {
          rooms[i] = Object();
          rooms[i].name = this.rooms[i].name;
          rooms[i].members = this.rooms[i].members.filter((m) => m != uid);

          if (rooms[i].members.length == 1) {
            rooms[i].singleChart = true;
            // this.usersOnline.includes(rooms[i].members[0])
            //   ? (rooms[i].userOnline = true)
            //   : (rooms[i].userOnline = false);
            const uInfo = await this.$store.dispatch(
              "fetchInfoById",
              rooms[i].members[0]
            );
            rooms[i].avatar = uInfo.avatarUrl;
            rooms[i].name = uInfo.name + " " + uInfo.surname;
          } else {
            rooms[i].singleChart = false;
            rooms[i].avatar = "";
          }
          rooms[i].lastMessageId = this.rooms[i].lastMessage.messageId;
          rooms[i].id = this.rooms[i].id;
          db.collection("messageGroup")
            .doc(this.rooms[i].id)
            .collection("messages")
            .doc(rooms[i].lastMessageId)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                let message = snapshot.data();
                rooms[i].lastMessage = message.messageText;
                rooms[i].lastMessageDate = message.sentAt;
              } else {
                console.log("No such document!");
              }
            });
        }
        this.chartRooms = rooms;
        this.usersOnline.push({})
        this.usersOnline.splice(this.usersOnline.length - 1);
        //console.log(rooms);
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
  },
  directives: {
    ClickOutside,
  },
};
</script>