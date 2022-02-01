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
              <div class="neChatControls">
                <input
                  placeholder="Search..."
                  aria-label="Search"
                  type="search"
                  class="search-input form-control ms-3 newChatUsers show"
                  v-model="searchChatInput"
                  @click="UsersList"
                  @keyup="searchChatInputChange"
                  value=""
                />
                <button
                  class="btn btn-close btn-sm"
                  @click="newChatShow = false"
                ></button>
              </div>

              <div
                class="newChatUserSearchList"
                :class="{ show: showNewUserListPanel }"
              >
                <div
                  class="userSearchBlock"
                  v-for="u in usersSearList"
                  :key="u.id"
                >
                  <div class="usb-row" :data-id="u.id" @click="createNewChat">
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
          <div class="deleteReply">
            <button class="btn btn-sm btn-close" @click="deleteReply"></button>
          </div>
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
  </div>
</template>

<script>
import "firebase/storage";
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
    notReadsLength: 0,
    usersSearList: [],
    messages: [],
    searchChatInput: "",
    userMessageText: "",
    emojiIndex: emojiIndex,
    emojisOutput: "",
    chatListShow: false,
    showNewUserListPanel: false,
    newChatShow: false,
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
    async createNewChat(el){
      const uid = this.$store.state.info.info.uid;
      const id = el.currentTarget.getAttribute('data-id')
      const snapshot = await db.collection("rooms").where("members","array-contains",uid).get()
      let chats = snapshot.docs.map(doc => doc.data());
      chats = chats.filter(el => el.members.indexOf(id) >= 0)
      console.log(chats)
      if(chats.length <= 0){
        //console.log('we ready to start chat')
        let room = {
          createdAt: new Date().toJSON(),
          createdBy: uid,
          lastMessage:{
            messageText: '',
            readBy:[uid]
          },
          members:[id,uid],
          modifiedAt: new Date().toJSON(),
          name: ''
        };
        db.collection("rooms").add(room);
        this.showNewUserListPanel = false;
        this.newChatShow = false
      }
      
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
      if (this.$refs.replyHolder.innerHTML.length > 0) {
        mText = this.$refs.replyHolder.innerHTML + mText;
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
      this.$store.dispatch("unbindMessages");
      this.showChatRoom = false;
    },
    async UsersList(e) {
      if (e.currentTarget.classList.contains("newChatUsers")) {
        this.showNewUserListPanel = true;
      } else {
        this.showUserListPanel = true;
      }
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
    showEmoji(emoji) {
      this.emojisOutput = this.emojisOutput + emoji.native;
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

        //console.log(messages)
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