<template>
  <div class="form-wrapper">
    <div class="form-block">
      <div class="form-container">
        <form class="f-card" @submit.prevent="submitHandler">
          <div class="f-card-content">
            <span class="f-card-title">Вход</span>
            <div class="f-input-field">
              <label for="email">Email</label>
              <input
                id="email"
                type="text"
                v-model.trim="email"
                :class="{
                  invalid:
                    ($v.email.$dirty && !$v.email.required) ||
                    ($v.email.$dirty && !$v.email.email),
                }"
              />
              <small
                class="f-helper-text invalid"
                v-if="$v.email.$dirty && !$v.email.required"
                >Поле E-mail не должно быть пустым</small
              >
              <small
                class="f-helper-text invalid"
                v-else-if="$v.email.$dirty && !$v.email.email"
                >Введите корректный E-mail</small
              >
            </div>
            <div class="f-input-field">
              <label for="password">Пароль</label>
              <input
                id="password"
                type="password"
                class="validate"
                v-model.trim="password"
                :class="{
                  invalid:
                    ($v.password.$dirty && !$v.password.required) ||
                    ($v.password.$dirty && !$v.password.minLength),
                }"
              />
              <small
                class="f-helper-text invalid"
                v-if="$v.password.$dirty && !$v.password.required"
                >Введите пароль</small
              >
              <small
                class="f-helper-text invalid"
                v-if="$v.password.$dirty && !$v.password.minLength"
                >Пароль должен содержать больше {{$v.password.$params.minLength.min}} знаков</small
              >
            </div>
          </div>
          <div class="card-action">
            <div>
              <button
                class="f-btn waves-effect waves-light auth-submit"
                type="submit"
              >
                Войти
              </button>
            </div>
            <p class="center">
              Нет аккаунта?
              <router-link to="/register">Зарегистрироваться</router-link>
            </p>
          </div>
        </form>
      </div>
      <div class="form-decore">
        <div class="form-slider">
          <div class="fs-item fsi-0 active">
            <div class="img_decore_container">
              <div class="fly-icon fi-1"></div>
              <div class="fly-icon fi-2"></div>
              <div class="fly-icon fi-3"></div>
              <div class="fly-img fli-1">
                <img src="../assets/img/dshbrd0.png" alt="" />
              </div>
              <div class="fly-img fli-2">
                <img src="../assets/img/dshbrd1.png" alt="" />
              </div>
            </div>
            <div class="fd-text-container">
              <div class="fd-text-heading">Turn your ideas into reality</div>
              <div class="fd-text-content">Check this awesome app</div>
            </div>
          </div>
          <div class="fs-controls"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  name: "login",
  data: () => ({
    email: "",
    password: "",
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(10) },
  },
  mounted(){
    if(messages[this.$route.query.message]){
      this.$warning(messages[this.$route.query.message])
    }    
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password
      }

      try {
        await this.$store.dispatch('login', formData)
        this.$router.push("/");
      } catch (e) {        
      }
    },
  },
};
</script>