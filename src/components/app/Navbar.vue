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
      <div class="chatListHeader"></div>
      <div class="chatListHeading">Чаты</div>
      <div class="chatListBody">
        <!-- <div v-for="u of Users" :key="u.id">{{u.id}}</div> -->
        <div class="chatList">
          <div
            class="chatListCard"
            v-for="c of chatRooms"
            :key="c.id"
            :chat-id="c.id"
            @click="openChatRoom"
          >
            <div class="chat_row">
              <div class="chatUI">
                <div
                  class="user-status"
                  :class="c.memberOnline ? 'usr-online' : 'usr-offline'"
                ></div>
                <div
                  class="chatUserImage"
                  :style="{ backgroundImage: 'url(' + c.avatar + ')' }"
                ></div>
              </div>
              <div class="chatUText">
                <div class="chutHeader">
                  <div class="chutName">
                    {{ c.name }}
                  </div>
                  <div class="chutDate">
                    {{ c.lastMessageDate | date("datetime") }}
                  </div>
                </div>
                <div class="chutLastMessage">
                  <div class="chutlm" v-html="c.lastMessage"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chatRoomWindow" :class="{ show: showChatRoom }">
      <div class="chatWindowHeader">
        <div class="chatListSearch">
          <div class="chatSearchControl">
            <div class="csc-col">
              <button
                class="btn btn-light btn-sm"
                @click="showSearchBar = !showSearchBar"
              >
                <i class="bi bi-plus-lg"></i><i class="bi bi-people"></i>
              </button>
              <input
                placeholder="Search..."
                aria-label="Search"
                type="search"
                class="search-input form-control ms-3"
                :class="{ show: showSearchBar }"
                v-model="searchChatInput"
                @click="UsersList"
                @keyup="searchChatInputChange"
                value=""
              />
            </div>
            <div class="csc-col">
              <button
                class="btn btn-sm btn-close"
                @click="closeChatRoom"
              ></button>
            </div>
          </div>
          <div class="userSearchList" :class="{ show: showUserListPanel }">
            <div class="userSearchBlock" v-for="u in usersSearList" :key="u.id">
              <div class="usb-row">
                <div class="usb-col usb-img">
                  <div
                    class="chatUserImage"
                    :style="{
                      backgroundImage: 'url(' + u.info.avatarUrl + ')',
                    }"
                  ></div>
                </div>
                <div class="usb-col usb-name">
                  {{ u.info.name }} {{ u.info.surname }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mesWindow" ref="chatWindow">
        <div
          class="mes-row"
          v-for="m in messages"
          :key="m.id"
          :class="m.sentBy == uid ? 'my-message' : ''"
        >
          <div class="message-wrapper" @contextmenu.prevent="mesMenuClick">
            <div class="dropdown">
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" @click.prevent="replyOnMessage"
                    ><i class="bi bi-reply"></i> Ответить</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" :data-id="m.id" @click.prevent=""
                    ><i class="bi bi-arrow-90deg-right"></i> Переслать</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" @click.prevent=""
                    ><i class="bi bi-files"></i> Скопировать текст</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" :data-id="m.id" @click.prevent=""
                    ><i class="bi bi-trash"></i> Удалить</a
                  >
                </li>
              </ul>
            </div>
            <div class="messageBlock">
              <div class="messageSentBy" v-if="!m.continueMessage">
                {{ m.sentByName }}
              </div>
              <div class="messageText">
                <div class="m-line" v-html="m.messageText"></div>
                <div class="m-date">{{ m.sentAt | date("time") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-input-holder">
        <div class="emoji-holder" :class="{ show: showEmojiBlock }">
          <picker
            title=""
            set="apple"
            :data="emojiIndex"
            :showSkinTones="false"
            @select="showEmoji"
            :i18n="{
              search: 'Поиск',
              notfound: 'Не найидено',
              categories: {
                search: 'Результаты поиска',
                recent: 'Недавние',
                people: 'Эмоции',
                nature: 'Животные',
                foods: 'Еда и напитки',
                activity: 'Активность',
                places: 'Путешествия',
                objects: 'Объекты',
                symbols: 'Символы',
                flags: 'Флаги',
                custom: 'Custom',
              },
            }"
          />
        </div>
        <div ref="replyWrapper" class="reply-wrapper">
          <div class="deleteReply"><button class="btn btn-sm btn-close" @click="deleteReply"></button></div>
          <div ref="replyHolder" class="reply-message-holder"></div>
        </div>
        <div class="input-group">
          <span class="input-group-text ms-sgb"
            ><button class="btn btn-light" @click="addFile">
              <i class="bi bi-paperclip"></i></button
          ></span>
          <span class="input-group-text ms-sgb">
            <button
              class="btn btn-light"
              @click="showEmojiBlock = !showEmojiBlock"
            >
              <i class="bi bi-emoji-smile"></i></button
          ></span>
          <div
            contenteditable="true"
            class="message-input form-control"
            ref="inputMessage"
            @keyup.enter.prevent="sendMessage"
          >
            {{ emojisOutput }}
          </div>
          <span class="input-group-text"
            ><button class="btn btn-primary" @click="sendMessage">
              <i class="bi bi-send"></i></button
          ></span>
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
import "@/assets/chatList.css";
let emojiIndex = new EmojiIndex(data);
export default {
  data: () => ({
    uid: null,
    showUserSettings: false,
    hideSidebarStatus: true,
    notificationShow: false,
    chatListShow: false,
    showUserListPanel: false,
    showEmojiBlock: false,
    showChatRoom: false,
    showSearchBar: false,
    theme: "",
    date: new Date(),
    notifications: [],
    notReadsLength: 0,
    usersSearList: [],
    messages: [],
    searchChatInput: "",
    userMessageText: "",
    emojiIndex: emojiIndex,
    emojisOutput: "",
  }),
  created() {
    this.$store.dispatch("bindUsersOnline");
    this.$store.dispatch("bindChatRooms");
  },
  components: {
    Picker,
  },
  methods: {
    showEmoji(emoji) {
      this.emojisOutput = this.emojisOutput + emoji.native;
    },
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
    async UsersList() {
      this.showUserListPanel = true;
      let string = this.searchChatInput;
      let usersReal = await this.$store.dispatch("fetchUsers");
      let usersStart = usersReal;
      let users = [];
      if (string.length > 0) {
        for (let i = 0; i < usersStart.length; i++) {
          if (
            (
              usersStart[i].info.name.toUpperCase() +
              usersStart[i].info.surname.toUpperCase()
            ).indexOf(string.toUpperCase()) < 0
          ) {
            usersStart.splice(i, 1);
            i--;
          }
        }
        users = usersStart;
      } else {
        users = usersReal;
      }

      let usersOnline = [
        ...new Set(this.$store.state.usersOnline.map((item) => item.id)),
      ];
      for (let i = 0; i < users.length; i++) {
        users[i].online = usersOnline.includes(users[i].id);
      }
      this.usersSearList = users;
    },
    async searchChatInputChange() {
      let string = this.searchChatInput;
      let usersReal = await this.$store.dispatch("fetchUsers");
      let usersStart = usersReal;
      if (string.length > 0) {
        for (let i = 0; i < usersStart.length; i++) {
          if (
            (
              usersStart[i].info.name.toUpperCase() +
              usersStart[i].info.surname.toUpperCase()
            ).indexOf(string.toUpperCase()) < 0
          ) {
            usersStart.splice(i, 1);
            i--;
          }
        }
        this.usersSearList = usersStart;
      } else {
        this.usersSearList = usersReal;
      }
    },
    openChatRoom(el) {
      let id = el.currentTarget.getAttribute("chat-id");
      this.$store.state.activeChatRoomId = id;
      this.$store.dispatch("bindMessages");
      let messages = this.$store.getters.messages;
      this.messages = messages;
      this.readMessage(id);
      this.showChatRoom = true;
    },
    closeChatRoom() {
      this.$store.dispatch("unbindMessages");
      this.showChatRoom = false;
    },
    readMessage(id) {
      const uid = this.$store.state.info.info.uid;
      db.collection("rooms")
        .doc(id)
        .get()
        .then((querySnapshot) => {
          let doc = querySnapshot.data();
          let readBy = doc.lastMessage.readBy;
          //console.log(readBy.filter((el) => el == uid).length);
          if (readBy.filter((el) => el == uid).length <= 0) {
            readBy.push(uid);
          }
          db.collection("rooms").doc(id).update({
            "lastMessage.readBy": readBy,
          });
        });
    },
    async sendMessage(el) {
      const uid = this.$store.state.info.info.uid;
      const info = await this.$store.dispatch("fetchInfoById", uid);
      const name = info.name + " " + info.surname;
      const roomId = this.$store.state.activeChatRoomId;
      
      let mText = this.$refs.inputMessage.innerHTML.replaceAll(
        "<div><br></div>",
        ""
      );
      if(this.$refs.replyHolder.innerHTML.length > 0){
        mText = this.$refs.replyHolder.innerHTML + mText
      }
      if (mText.length > 0) {
        let message = {
          messageText: mText,
          sentAt: new Date().toJSON(),
          sentBy: uid,
          sentByName: name,
        };
        db.collection("messageGroup")
          .doc(roomId)
          .collection("messages")
          .add(message);
        db.collection("rooms")
          .doc(roomId)
          .update({
            modifiedAt: new Date().toJSON(),
            "lastMessage.messageText": mText,
            "lastMessage.readBy": [uid],
          });
      }
      this.$refs.inputMessage.innerHTML = "";
      this.$refs.replyHolder.innerHTML = "";
      this.$refs.replyWrapper.classList.remove('active')
    },
    deleteReply(){
      this.$refs.replyHolder.innerHTML = "";
      this.$refs.replyWrapper.classList.remove('active')
    },
    chatListShowClcik() {
      this.chatListShow = !this.chatListShow;
      this.showChatRoom = false;
    },
    addFile() {},
    pastEmodji(el) {
      this.showEmoji = false;
    },
    mesMenuClick(el) {
      let menu = el.currentTarget.children[0].children[0];
      menu.classList.add("show");
    },
    replyOnMessage(el) {
      const replied = el.currentTarget.closest(".message-wrapper").children[1];
      this.$refs.replyWrapper.classList.add('active')
      this.$refs.replyHolder.innerHTML =
       '<div class="repWrap"><div class="repliedMessage">' +
        replied.innerHTML +
        "</div></div><br>";
      // this.$refs.inputMessage.innerHTML = '<div class="repWrap"><div class="repliedMessage">' +
      // replied.innerHTML +
      // "</div></div><br><br>";
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
  },
  asyncComputed: {
    async chatRooms() {
      const uid = this.$store.state.info.info.uid;
      let usersOnline = this.$store.state.usersOnline;
      let rooms = this.$store.state.rooms;
      //let messages = this.$store.state.messages
      let chatRooms = new Array();
      for (let i = 0; i < rooms.length; i++) {
        chatRooms[i] = Object();
        chatRooms[i].id = rooms[i].id;
        chatRooms[i].name = rooms[i].name;
        chatRooms[i].lastMessageDate = rooms[i].modifiedAt;
        chatRooms[i].lastMessage = rooms[i].lastMessage.messageText;
        chatRooms[i].members = rooms[i].members.filter((m) => m != uid);
        if (chatRooms[i].members.length == 1) {
          let info = await this.$store.dispatch(
            "fetchInfoById",
            chatRooms[i].members[0]
          );
          chatRooms[i].avatar = info.avatarUrl;
          chatRooms[i].memberOnline = usersOnline.filter(
            (u) => u.id != chatRooms[i].members[0]
          )[0].online;
          chatRooms[i].name = info.name + " " + info.surname;
        }
      }
      //this.$store.state.rooms = chatRooms
      return chatRooms;
    },
    async messages(el) {},
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
    Users() {
      return this.$store.state.usersOnline;
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
    messages: function () {
      let messages = this.messages;
      if (messages) {
        for (let i = 0; i < messages.length; i++) {
          if (i != messages.length - 1) {
            if (messages[i].sentBy == messages[i + 1].sentBy) {
              messages[i].continueMessage = true;
            } else {
              messages[i].continueMessage = false;
            }
          }
        }
        //console.log(messages)
        this.messages = messages;
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