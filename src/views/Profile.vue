<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Профиль</h3>
    </div>
    <section>
      <div class="row h-100">
        <div class="col card p-4 h-100">
          <div class="row">
            <div class="col-3">
              <form @submit.prevent="submitHandler">
                <div class="mb-3 avatar-holder">
                  <div class="user-avatar-wrapper">
                    <label for="userAvatar">
                      <input accept="image/*" type="file" id="userAvatar" @change="changeAvatar"/>
                      <div
                      class="user-avatar"
                      :style="{ backgroundImage: 'url(' + avatarPreview + ')' }"
                    ></div>
                    </label>
                    
                  </div>
                </div>
                <div class="mb-3">
                  <label for="title">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Имя"
                    v-model="name"
                    :class="{
                      'is-invalid': $v.name.$dirty && !$v.name.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.name.$dirty && !$v.name.required"
                    >Введите Имя</label
                  >
                </div>
                <div class="mb-3">
                  <label for="title">Фамилия</label>
                  <input
                    type="text"
                    class="form-control"
                    id="surname"
                    placeholder="Фамилия"
                    v-model="surname"
                    :class="{
                      'is-invalid': $v.surname.$dirty && !$v.surname.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.surname.$dirty && !$v.surname.required"
                    >Введите Фамилию</label
                  >
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">
                    Обновить
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
export default {
  data: () => ({
    name: "",
    surname: "",
    avatarUrl: "",
    avatarPreview: "",
    imgFile: null
  }),
  validations: {
    name: { required },
    surname: { required },
  },
  mounted() {
    const name = this.$store.getters.info.name
    const surname = this.$store.getters.info.surname
    const userAvatar = this.$store.getters.info.avatarUrl;
    this.avatarUrl = this.$store.getters.info.avatarUrl;
    this.name = name
    this.surname = surname
    this.avatarPreview = userAvatar;
  },
  methods: {
    changeAvatar(item){
      const [file] = item.target.files
      this.imgFile = file
      this.avatarUrl = file.name
      let r = URL.createObjectURL(file)
      this.avatarPreview = r;
    },
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const userInfo = await this.$store.dispatch("updateInfo", {
          name: this.name,
          surname: this.surname,
          avatarUrl: this.avatarUrl,
          imgFile: this.imgFile
        });

        this.$v.$reset();
        this.$message("Данные успешно обновлены");
        this.$emit("setInfo", userInfo);
        this.avatarPreview = this.$store.getters.info.avatarUrl
      } catch (e) {
        this.$error("Данные не были обновлены:" + e);
      }
    },
  },
};
</script>
