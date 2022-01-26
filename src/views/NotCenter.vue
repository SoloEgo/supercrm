<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Центр уведомлений</h3>
    </div>
    <section>
      <LoaderContent v-if="loading" />
      <div class="tile-holder" v-else>
        <div class="tile-card tile-0">
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
                        placeholder="Автор"
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
                        >Введите Автора</label
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
                          Отправить от имени администрации
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="title">Название</label>
                  <input
                    type="text"
                    class="form-control w-25"
                    id="title"
                    placeholder="Название"
                    v-model="title"
                    :class="{
                      'is-invalid': $v.title.$dirty && !$v.title.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.title.$dirty && !$v.title.required"
                    >Введите Название</label
                  >
                </div>
                <div class="richTextNots mb-3">
                  <label for="title">Текст новости</label>
                  <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption"/>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">
                    Отправить
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
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
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
  components: {
    quillEditor,
  },
};
</script>