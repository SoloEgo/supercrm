<template>
  <div class="form-wrapper">
    <div class="form-block">
      <div class="form-container">
        <form class="f-card" @submit.prevent="submitHandler">
          <div class="f-card-content">
            <span class="f-card-title">Sign up</span>
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
                >E-mail could not be emptyм</small
              >
              <small
                class="f-helper-text invalid"
                v-else-if="$v.email.$dirty && !$v.email.email"
                >Enter correct E-mail</small
              >
            </div>
            <div class="f-input-field">
              <label for="password">Password</label>
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
                >Enter password</small
              >
              <small
                class="f-helper-text invalid"
                v-if="$v.password.$dirty && !$v.password.minLength"
                >Password must be minimum
                {{ $v.password.$params.minLength.min }} signs</small
              >
            </div>
            <div class="f-input-field">
              <label for="name">Name</label>
              <input
                id="name"
                type="text"
                v-model.trim="name"
                :class="{ invalid: $v.name.$dirty && !$v.name.required }"
              />
              <small
                class="f-helper-text invalid"
                v-if="$v.name.$dirty && !$v.name.required"
                >Provide your name</small
              >
            </div>
            <div class="f-input-field f-chck-w">
              <input id="agreement" type="checkbox" v-model="agree" />
              <label for="agreement">I agree with conditions</label>
            </div>
          </div>
          <div class="card-action">
            <div>
              <button
                class="btn waves-effect waves-light auth-submit"
                type="submit"
              >
                Sig up
              </button>
            </div>

            <p class="center">
              Already have account?
              <router-link to="/login">Sig in!</router-link>
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
import { email, required, minLength } from "vuelidate/lib/validators";
export default {
  name: "register",
  data: () => ({
    email: "",
    password: "",
    name: "",
    agree: false,
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(10) },
    name: { required },
    agree: { checked: (v) => v },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name,
        
      };
      try {
        await this.$store.dispatch("register", formData);
        this.$router.push("/");
      } catch (error) {
        console.log(error)
      }
    },
  },
};
</script>