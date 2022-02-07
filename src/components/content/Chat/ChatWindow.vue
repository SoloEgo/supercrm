<template>
  <div class="chatWrapper" ref="chatWrapper">
    <div class="chatListWrapper">
      <div class="chatListHeading">
        <div class="clh-name">Чаты</div>
        <div class="clh-close">
          <button class="btn btn-close btn-sm" @click="chatListHide"></button>
        </div>
      </div>
      <div class="chatListBody">
        <!-- <div v-for="u of Users" :key="u.id">{{u.id}}</div> -->
        <div class="chatList">
          <div
            class="chatListCard"
            :class="activeChatRoomid == c.id ? 'active' : ' '"
            v-for="c of chatRooms"
            :key="c.id"
            :chat-id="c.id"
            @click="openChatRoom"
          >
            <div class="chat_row">
              <div class="chatUI">
                <div
                  class="user-status"
                  v-if="!c.groupChat"
                  :class="c.memberOnline ? 'usr-online' : 'usr-offline'"
                ></div>
                <div
                  class="chatUserImage"
                  :style="{ backgroundImage: 'url(' + c.avatar + ')' }"
                  v-if="!c.groupChat"
                ></div>
                <div
                  class="chatUserImage groupImg"
                  v-else
                  :style="{ background: c.avatarColor }"
                >
                  <i class="bi bi-envelope"></i>
                </div>
              </div>
              <div class="chatUText">
                <div class="chutHeader">
                  <div class="chutName">
                    {{ c.name }}
                  </div>
                  <div class="chutDate">
                    {{ c.lastMessageDate | date("shortDateTime") }}
                  </div>
                </div>
                <div class="chutLastMessage">
                  <div class="chutlm" v-html="c.lastMessage"></div>
                  <div class="readIndicator" v-if="c.messagesSeenByAll">
                    <i class="bi bi-check-all"></i>
                  </div>
                  <div class="unreadIndicator" v-if="c.messagesNotSeen">
                    <i class="bi bi-circle-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fly-button">
            <button
              class="btn btn-primary btn-sm rounded-circle"
              @click="newChatShow = true"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="newChatHolder" :class="{ active: newChatShow }">
            <div class="newChatListSearch">
              <div class="newChatControls">
                <div class="cose-row">
                  <div class="newChatName">Новый чат</div>
                  <button
                    class="btn btn-close btn-sm"
                    @click="newChatShow = false"
                  ></button>
                </div>
                <div class="newChatInput">
                  <input
                    placeholder="Search..."
                    aria-label="Search"
                    type="search"
                    class="search-input form-control newChatUsers show"
                    v-model="searchChatInput"
                    @click="UsersList"
                    @keyup="searchChatInputChange"
                    value=""
                  />
                  <button class="btn btn-primary btn-sm" @click="createNewChat">Начать</button>
                </div>
              </div>

              <div
                class="newChatUserSearchList"
                :class="{ show: showNewUserListPanel }"
              >
                <div
                  class="userSearchBlock"
                  v-for="u in usersSearList"
                  :key="u.id"
                  :data-id="u.id"
                >
                  <div
                    class="usb-row"
                    :data-id="u.id"
                    @click="addUserToNewRoom"
                  >
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
                    <div class="checked-usr">
                      <i class="bi bi-check" v-if="u.checked"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chatRoomWindow" :class="{ show: showChatRoom }">
      <div class="chatWindowHeader">
        <div class="chatWindowHeading">
          <input
            class="chatNameControl"
            type="text"
            v-model="chatName"
            @change="changeChatName"
            :disabled="activeChatSingle"
          />
        </div>
        <div class="chatListSearch">
          <div class="chatSearchControl">
            <div class="csc-col">
              <div class="dropdown">
                <button
                  class="btn btn-light btn-sm me-3 dropdown-toggle"
                  id="dropdownMembers"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  v-if="!activeChatSingle"
                  @click="showUsersInRoom"
                >
                  <i class="bi bi-people"></i>
                </button>
                <ul
                  class="dropdown-menu show"
                  aria-labelledby="dropdownMembers"
                >
                  <li v-for="u of usersInRoom" :key="u.id">
                    <div class="dropdown-item members-row">
                      <div class="member-img">
                        <div
                          class="m-avatar"
                          :style="{
                            backgroundImage: 'url(' + u.info.avatarUrl + ')',
                          }"
                        ></div>
                      </div>
                      <div class="member-name">
                        {{ u.info.name }} {{ u.info.surname }}
                      </div>
                      <div class="deletemeber-holder">
                        <button
                          class="btn btn-sm btn-light"
                          :data-id="u.id"
                          @click="deleteUserFromRoom"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <button
                class="btn btn-light btn-sm"
                @click="showSearchBar = !showSearchBar"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
              <input
                placeholder="Search..."
                aria-label="Search"
                type="search"
                class="search-input form-control ms-3 me-3"
                :class="{ show: showSearchBar }"
                v-model="searchChatInput"
                @click="UsersList"
                @keyup="searchChatInputChangeInRoom"
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
            <div
              class="userSearchBlock addUsertoChat"
              v-for="u in usersSearList"
              :key="u.id"
              :data-id="u.id"
              @click="addUserToRoom"
            >
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
          <div class="deleteReply">
            <button class="btn btn-sm btn-close" @click="deleteReply"></button>
          </div>
          <div ref="replyHolder" class="reply-message-holder"></div>
        </div>
        <div class="attachFileWrapper">
          <div
            class="filesUploadHolder"
            v-for="f in fileList"
            :key="f.realName"
          >
            <div
              class="fileBlock"
              :class="f.state == 'disable' ? 'disabled' : 'enabled'"
            >
              <div
                class="fileIcon"
                :inner-html.prop="f.name | fileTypeFilter"
              ></div>
              <div class="fileName">{{ f.name }}</div>
              <div class="progress" style="height: 3px">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{ width: uploadProgress + '%' }"
                  :aria-valuenow="uploadProgress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="deleteFile">
                <button
                  :data-id="f.realName"
                  @click="deleteFileFromUpload"
                  class="btn btn-sm btn-close"
                  v-if="f.state != 'disable'"
                ></button>
                <button
                  :data-id="f.realName"
                  @click="cancelTask"
                  class="btn btn-sm btn-close"
                  v-else
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div class="input-group">
          <span class="input-group-text ms-sgb"
            ><label
              class="btn btn-light chatFile"
              @click="addFile"
              for="chatFile"
            >
              <i class="bi bi-paperclip"></i>
              <input
                type="file"
                class="hiddenInput"
                id="chatFile"
                ref="file"
                v-on:change="handleFileUpload()"
              /> </label
          ></span>
          <span class="input-group-text ms-sgb">
            <button
              class="btn"
              :class="showEmojiBlock ? 'btn-primary' : 'btn-light'"
              @click="showEmojiBlock = !showEmojiBlock"
            >
              <i class="bi bi-emoji-smile"></i></button
          ></span>
          <div
            contenteditable="true"
            class="message-input form-control"
            ref="inputMessage"
            @keyup.enter.prevent="sendMessage"
            v-html="emojisOutput"
          ></div>
          <span class="input-group-text"
            ><button class="btn btn-primary" @click="sendMessage">
              <i class="bi bi-send"></i></button
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "@/plugins/db";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
import "@/assets/chatList.css";
let emojiIndex = new EmojiIndex(data);

export default {
  data: () => ({
    uid: null,
    showUserListPanel: false,
    showEmojiBlock: false,
    showChatRoom: false,
    showSearchBar: false,
    chatListShow: false,
    showNewUserListPanel: false,
    newChatShow: false,
    activeChatSingle: true,
    roomMembersShow: false,
    activeChatRoomid: null,
    notReadsLength: 0,
    usersSearList: [],
    newRoomUsers: [],
    messages: [],
    searchChatInput: "",
    file: "",
    fileList: [],
    userMessageText: "",
    emojiIndex: emojiIndex,
    emojisOutput: "",
    usersInRoom: [],
    chatName: "",
    uploadProgress: 0,
    uploadTask: null,
    avatarColors: [
      "#FFCDD2",
      "#F8BBD0",
      "#D1C4E9",
      "#BBDEFB",
      "#D1C4E9",
      "#B2DFDB",
      "#DCEDC8",
      "#FFECB3",
    ],
  }),
  created() {
    this.$store.dispatch("bindUsersOnline");
    this.$store.dispatch("bindChatRooms");
  },
  components: {
    Picker,
  },
  methods: {
    chatListHide() {
      this.$refs.chatWrapper.classList.remove("active");
      this.$store.dispatch("unbindMessages");
      this.showChatRoom = false;
      this.activeChatRoomid = null;
    },
    async openChatRoom(el) {
      const uid = this.$store.state.info.info.uid;
      let id = el.currentTarget.getAttribute("chat-id");
      this.activeChatRoomid = id;
      db.collection("rooms")
        .doc(id)
        .get()
        .then(async (querySnapshot) => {
          let doc = querySnapshot.data();
          if (doc.members.length <= 2) {
            this.activeChatSingle = true;
          } else {
            this.activeChatSingle = false;
          }
          if (doc.name == "") {
            let member = doc.members.filter((m) => m != uid);
            let name = await this.$store.dispatch("fetchInfoById", member[0]);
            this.chatName = name.name + " " + name.surname;
          } else {
            this.chatName = doc.name;
          }
        });

      this.activeChatRoomId = id;
      this.$store.state.activeChatRoomId = id;
      this.$store.dispatch("bindMessages");
      let messages = this.$store.getters.messages;
      this.messages = messages;
      this.readMessage(id);
      this.showChatRoom = true;
    },
    async createNewChat(el) {
      const uid = this.$store.state.info.info.uid;
      let pid = this.newRoomUsers
      pid.push(uid)
      const snapshot = await db
        .collection("rooms")
        .where("members", "array-contains", uid)
        .get();
      let chats = snapshot.docs.map((doc) => doc.data());
      chats = chats.filter((el) => el.members.every(v => pid.includes(v)) && el.members.length == pid.length );
      if (chats.length <= 0) {
        let room = {
          createdAt: new Date().toJSON(),
          createdBy: uid,
          lastMessage: {
            messageText: "",
            readBy: [uid],
          },
          members: pid,
          modifiedAt: new Date().toJSON(),
          name: pid.length > 2 ? 'Групповой чат' : '',
          avatarColor: pid.length > 2 ? this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)] : ''
        };
        db.collection("rooms").add(room);
        this.showNewUserListPanel = false;
        this.newChatShow = false;
      }else{

      }
    },
    addUserToNewRoom(el) {
      let users = this.usersSearList;
      if( !this.newRoomUsers.includes(el.currentTarget.getAttribute("data-id")) ){
        this.newRoomUsers.push(el.currentTarget.getAttribute("data-id"));
      }else{
        this.newRoomUsers = this.newRoomUsers.filter( i => i != el.currentTarget.getAttribute("data-id"));
      }
      
      for (let i = 0; i < users.length; i++) {
        users[i].checked = this.newRoomUsers.includes(users[i].id) ;
      }
      this.usersSearList = users;
    },
    async addUserToRoom(el) {
      const id = el.currentTarget.getAttribute("data-id");
      const roomId = this.$store.state.activeChatRoomId;
      db.collection("rooms")
        .doc(roomId)
        .get()
        .then(async (querySnapshot) => {
          let doc = querySnapshot.data();
          let members = doc.members;
          let isAlreadyMember =
            members.filter((m) => m == id).length > 0 ? true : false;
          if (!isAlreadyMember) {
            if (members.length == 2) {
              db.collection("rooms")
                .doc(roomId)
                .update({
                  name: "Групповой чат",
                  avatarColor:
                    this.avatarColors[
                      Math.floor(Math.random() * this.avatarColors.length)
                    ],
                });
            }
            members.push(id);
            if (members.length > 2) {
              this.activeChatSingle = false;
            }
            db.collection("rooms").doc(roomId).update({
              members: members,
            });
            this.showUserListPanel = false;
            this.showSearchBar = false;
          }
        });
    },
    async deleteUserFromRoom(el) {
      const id = el.currentTarget.getAttribute("data-id");
      const roomId = this.$store.state.activeChatRoomId;
      db.collection("rooms")
        .doc(roomId)
        .get()
        .then(async (querySnapshot) => {
          let doc = querySnapshot.data();
          let members = doc.members;
          let newmembers = members.filter((m) => m != id);
          if (newmembers.length <= 2) {
            this.activeChatSingle = true;
          }
          db.collection("rooms").doc(roomId).update({
            members: newmembers,
          });
        });
    },
    async showUsersInRoom() {
      const uid = this.$store.state.info.info.uid;
      this.roomMembersShow = !this.roomMembersShow;
      const roomId = this.$store.state.activeChatRoomId;
      db.collection("rooms")
        .doc(roomId)
        .get()
        .then(async (querySnapshot) => {
          let doc = querySnapshot.data();
          let members = [];
          for (let i = 0; i < doc.members.length; i++) {
            members[i] = Object();
            members[i].id = doc.members[i];
            members[i].info = await this.$store.dispatch(
              "fetchInfoById",
              members[i].id
            );
          }
          this.usersInRoom = members.filter((u) => u.id != uid);
        });
    },
    changeChatName() {
      const roomId = this.$store.state.activeChatRoomId;
      const newName = this.chatName;
      db.collection("rooms").doc(roomId).update({
        name: newName,
      });
    },
    readMessage(id) {
      const uid = this.$store.state.info.info.uid;
      db.collection("rooms")
        .doc(id)
        .get()
        .then((querySnapshot) => {
          let doc = querySnapshot.data();
          let readBy = doc.lastMessage.readBy;
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
      if (this.$refs.replyHolder.innerHTML.length > 0) {
        mText = this.$refs.replyHolder.innerHTML + mText;
      }
      if (this.fileList.length > 0) {
        let ftext = "";
        for (let i = 0; i < this.fileList.length; i++) {
          ftext = `<a href="${
            this.fileList[i].fileUrl
          }"  download="download" target="_blank"><div class="fileBlock">
              <div class="fileIcon">${this.$options.filters.fileTypeFilter(
                this.fileList[i].realName
              )}</div>
              <div class="fileName">${this.fileList[i].name}</div>
              </div></a>`;
        }
        mText = ftext + mText;
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
      this.$refs.replyWrapper.classList.remove("active");
      this.showEmojiBlock = false;
      this.fileList = [];
      document.getElementById("chatFile").value = null;
      this.file = "";
    },
    deleteReply() {
      this.$refs.replyHolder.innerHTML = "";
      this.$refs.replyWrapper.classList.remove("active");
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
      this.$refs.replyWrapper.classList.add("active");
      this.$refs.replyHolder.innerHTML =
        '<div class="repWrap"><div class="repliedMessage">' +
        replied.innerHTML +
        "</div></div><br>";
      // this.$refs.inputMessage.innerHTML = '<div class="repWrap"><div class="repliedMessage">' +
      // replied.innerHTML +
      // "</div></div><br><br>";
    },
    closeChatRoom() {
      this.activeChatRoomid = null;
      this.$store.dispatch("unbindMessages");
      this.showChatRoom = false;
      this.showSearchBar = false;
    },
    async UsersList(e) {
      const uid = this.$store.state.info.info.uid;
      if (e.currentTarget.classList.contains("newChatUsers")) {
        this.showNewUserListPanel = true;
      } else {
        this.showUserListPanel = true;
      }
      let string = this.searchChatInput;
      let usersReal = await this.$store.dispatch("fetchUsers");
      usersReal = usersReal.filter((u) => u.id != uid);
      if (this.showUserListPanel) {
      }
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
        users[i].checked = this.newRoomUsers.includes(users[i].id);
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
        for (let i = 0; i < usersStart.length; i++) {
          usersStart[i].checked = this.newRoomUsers.includes(usersStart[i].id);
        }
        this.usersSearList = usersStart;
      } else {
        for (let i = 0; i < usersReal.length; i++) {
          usersReal[i].checked = this.newRoomUsers.includes(usersReal[i].id);
        }
        this.usersSearList = usersReal;
      }
    },
    async searchChatInputChangeInRoom() {
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
    showEmoji(emoji) {
      let mText = this.$refs.inputMessage.innerHTML.replaceAll(
        "<div><br></div>",
        ""
      );
      this.emojisOutput = mText + emoji.native;
    },
    close(e) {
      if (e.path) {
        let c = 0;
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i].classList) {
            if (
              e.path[i].classList.contains("chatListSearch") ||
              e.path[i].classList.contains("newChatListSearch")
            ) {
              c++;
            }
          }
        }
        if (c == 0) {
          this.showUserListPanel = false;
          this.showNewUserListPanel = false;
        }
      }
    },
    handleFileUpload(e) {
      this.file = this.$refs.file.files[0];
      let fileName = this.file.name;
      const realFileName = fileName;
      const roomId = this.activeChatRoomid;
      if (fileName.length >= 15) {
        let ext = fileName.split(".").pop().toLowerCase();
        let nameNoExt = fileName.split(ext)[0];
        fileName =
          nameNoExt.substring(0, 5) +
          "..." +
          nameNoExt.substring(nameNoExt.length - 5, nameNoExt.length) +
          ext;
        fileName.replaceAll(" ", "");
      }
      this.fileList.push({
        name: fileName,
        realName: realFileName,
        state: "disable",
        fileUrl: "",
      });
      this.uploadTask = firebase
        .storage()
        .ref("chatRooms/" + roomId + "/" + this.file.name)
        .put(this.file);
      this.uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress;
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            for (let i = 0; i < this.fileList.length; i++) {
              if (this.fileList[i].realName == this.file.name) {
                this.fileList[i].state = "done";
                this.fileList[i].fileUrl = downloadURL;
              }
            }
          });
        }
      );
    },
    cancelTask(e) {
      this.uploadTask.cancel();
      const fileName = e.currentTarget.getAttribute("data-id");
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].realName == fileName) {
          this.fileList.splice(i, 1);
          i--;
        }
      }
      document.getElementById("chatFile").value = null;
      this.file = "";
    },
    deleteFileFromUpload(e) {
      const roomId = this.activeChatRoomid;
      const fileName = e.currentTarget.getAttribute("data-id");
      var fileRef = firebase
        .storage()
        .ref()
        .child("chatRooms/" + roomId + "/" + fileName);
      fileRef
        .delete()
        .then(() => {
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].realName == fileName) {
              this.fileList.splice(i, 1);
              i--;
            }
          }
          document.getElementById("chatFile").value = null;
          this.file = "";
        })
        .catch((error) => {
          console.log("error deleting: " + error);
        });
    },
  },
  asyncComputed: {
    async chatRooms() {
      const uid = this.$store.state.info.info.uid;
      let usersOnline = this.$store.state.usersOnline;
      let rooms = this.$store.state.rooms;
      let chatRooms = new Array();
      for (let i = 0; i < rooms.length; i++) {
        chatRooms[i] = Object();
        chatRooms[i].id = rooms[i].id;
        chatRooms[i].name = rooms[i].name;
        chatRooms[i].lastMessageDate = rooms[i].modifiedAt;

        chatRooms[i].lastMessage = rooms[i].lastMessage.messageText;
        if (chatRooms[i].lastMessage.indexOf('<div class="fileBlock">') >= 0) {
          chatRooms[i].lastMessage =
            '<div class="roomFile"><i class="bi bi-file-earmark"></i>Документ</div>';
        }
        chatRooms[i].readBy = rooms[i].lastMessage.readBy;
        if (!chatRooms[i].readBy.includes(uid)) {
          chatRooms[i].messagesNotSeen = true;
        } else {
          chatRooms[i].messagesNotSeen = false;
        }
        let r = chatRooms[i].readBy.sort();
        let m = rooms[i].members.sort();
        const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        if (equals(r, m)) {
          chatRooms[i].messagesSeenByAll = true;
        } else {
          chatRooms[i].messagesSeenByAll = false;
        }
        chatRooms[i].members = rooms[i].members.filter((m) => m != uid);

        if (chatRooms[i].members.length == 1) {
          let info = await this.$store.dispatch(
            "fetchInfoById",
            chatRooms[i].members[0]
          );
          chatRooms[i].groupChat = false;
          chatRooms[i].avatar = info.avatarUrl;
          chatRooms[i].memberOnline = usersOnline.filter(
            (u) => u.id == chatRooms[i].members[0]
          )[0].online;
          chatRooms[i].name = info.name + " " + info.surname;
        } else {
          chatRooms[i].groupChat = true;
          chatRooms[i].avatarColor = rooms[i].avatarColor;
          chatRooms[i].name = rooms[i].name;
        }
      }
      //this.$store.state.rooms = chatRooms
      return chatRooms;
    },
  },
  computed: {
    Users() {
      return this.$store.state.usersOnline;
    },
  },
  watch: {
    messages: function () {
      let messages = this.messages;
      const id = this.$store.state.activeChatRoomId;
      this.readMessage(id);
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
        this.messages = messages;
      }
    },
  },
  async mounted() {
    this.uid = await this.$store.dispatch("getUid");
    this.date = new Date();
    document.addEventListener("click", this.close);
  },
};
</script>