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
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Автор"
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
                <div class="mb-3">
                  <label for="title">Название</label>
                  <input
                    type="text"
                    class="form-control"
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
                <div class="mb-3">
                  <label for="title">Текст новости</label>
                  <input
                    type="text"
                    class="form-control"
                    id="notText"
                    placeholder="Фамилия"
                    v-model="notText"
                    :class="{
                      'is-invalid': $v.notText.$dirty && !$v.notText.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.notText.$dirty && !$v.notText.required"
                    >Введите Текст новости</label
                  >
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
import { required } from "vuelidate/lib/validators";
import {db} from "@/plugins/db"
export default {
  name: "notificationCenter",
  data: () => ({
    loading: true,
    notification: [],
    name: "",
    title: "",
    notText: "",
  }),
  validations: {
    name: { required },
    title: { required },
    notText: { required },
  },
  async mounted() {
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
          content: this.notText,
          date: (new Date()).toJSON(),
          subscribers: ''
        });
      } catch (e) {
        this.$error("Данные не были отправлены:" + e);
      }
    },
  },
  components: {},
};
</script>