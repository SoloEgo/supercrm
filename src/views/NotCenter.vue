<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Notification center</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-1 not-holder">
          <div v-for="n of notifications" :key="n.id" class="noticication_cards">
        <div class="notificationCard card mb-1">
          <div class="nf-row">
            <div class="nf-col-bell">
              <div class="n-icon">
                <i class="bi bi-bell"></i>
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
            </div>
          </div>
        </div>
      </div>
        </div>
        <div class="tile-card tile-2">
          <div class="card white-card">
            <div class="not-center-form">
              <form @submit.prevent="sendNotification">
                <div class="mb-3">
                  <label for="title">Автор</label>
                  <div class="row align-items-center">
                    <div class="col w-initial">
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder="Author"
                        disabled
                        v-model="name"
                        :class="{
                          'is-invalid': $v.name.$dirty && !$v.name.required,
                        }"
                      />
                      <label
                        for="floatingInputInvalid"
                        class="h-auto"
                        v-if="$v.name.$dirty && !$v.name.required"
                        >Author</label
                      >
                    </div>
                    <div class="col w-initial">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          @click="authorStateChange"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                          send from Administration
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="title">Name</label>
                  <input
                    type="text"
                    class="form-control w-50"
                    id="title"
                    placeholder="Name"
                    v-model="title"
                    :class="{
                      'is-invalid': $v.title.$dirty && !$v.title.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.title.$dirty && !$v.title.required"
                    >Enter Name</label
                  >
                </div>
                <div class="richTextNots mb-3">
                  <label for="title">Text here...</label>
                  <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption"/>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/notCenter.css";
import { required } from "vuelidate/lib/validators";
import { db } from "@/plugins/db";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import quillEmoji from 'quill-emoji'
import 'quill-emoji/dist/quill-emoji.css'
import "firebase/compat/storage";
import "firebase/compat/firestore";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "notificationCenter",
  data: () => ({
    loading: true,
    notification: [],
    name: "",
    title: "",
    notText: "",
    content: "",
    authorState: false,
    notifications: [],
    editorOption: {
          theme: 'snow',
          modules: {
            "emoji-toolbar": true,
            "emoji-shortname": true,
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video','emoji']
            ]
          }
    }
  }),
  validations: {
    name: { required },
    title: { required },
  },
  async mounted() {
    this.name =
      this.$store.getters.info.name + " " + this.$store.getters.info.surname;
    this.loading = false;
    this.content = 'Напишите текст здесь';
  },
  methods: {
    async sendNotification() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        db.collection("notifications").add({
          author: this.name,
          header: this.title,
          content: this.content,
          date: new Date().toJSON(),
          subscribers: "",
          viewedUsers: []
        });
      } catch (e) {
        this.$error("Данные не были отправлены:" + e);
      }
    },
    authorStateChange() {
      this.authorState = !this.authorState;
      if (this.authorState) {
        this.name = "Администрация";
      } else {
        this.name =
          this.$store.getters.info.name +
          " " +
          this.$store.getters.info.surname;
      }
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
  components: {
    quillEditor,
  },
};
</script>