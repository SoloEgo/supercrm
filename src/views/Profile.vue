<template>
  <div class="displayContentBlock">
    <div class="page-title">
      <h3>Profile</h3>
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
                      <input
                        accept="image/*"
                        type="file"
                        ref="userAvatarInput"
                        id="userAvatar"
                        @change="changeAvatar"
                      />

                      <div
                        class="user-avatar"
                        :style="{
                          backgroundImage: 'url(' + avatarPreview + ')',
                        }"
                      ></div>
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="title">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Name"
                    v-model="name"
                    :class="{
                      'is-invalid': $v.name.$dirty && !$v.name.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.name.$dirty && !$v.name.required"
                    >Enter the name</label
                  >
                </div>
                <div class="mb-3">
                  <label for="title">Surname</label>
                  <input
                    type="text"
                    class="form-control"
                    id="surname"
                    placeholder="Surname"
                    v-model="surname"
                    :class="{
                      'is-invalid': $v.surname.$dirty && !$v.surname.required,
                    }"
                  />
                  <label
                    for="floatingInputInvalid"
                    class="h-auto"
                    v-if="$v.surname.$dirty && !$v.surname.required"
                    >Enter your surname</label
                  >
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div
      class="modal modal-card py-5 create-new-contractor-card"
      tabindex="-1"
      role="dialog"
      :class="{ active: showAvatarCropper }"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-5 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0 mb-3">
            <h2 class="fw-bold mb-0">New avatar</h2>
            <button
              @click="closeModalCreateContr"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body p-5 pt-0">
            <div class="row">
              <div class="col">
                <cropper
                  class="cropper"
                  :src="img"
                  ref="cropper"
                  :stencil-props="{
                    handlers: {},
                    movable: false,
                    scalable: false,
                  }"
                  :stencil-size="{
                    width: 100,
                    height: 100,
                  }"
                  :canvas="{
                    minHeight: 0,
                    minWidth: 0,
                    maxHeight: 200,
                    maxWidth: 200,
                  }"
                  :debounce="false"
                  image-restriction="stencil"
                  @change="change"
                />
              </div>
              <div class="col">
                <div class="preview-result-example__previews">
                  <preview
                    :width="120"
                    :height="120"
                    :image="result.image"
                    :coordinates="result.coordinates"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <button class="btn btn-pimary" @click="uploadImage">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/theme.compact.css";
import "vue-advanced-cropper/dist/style.css";
export default {
  data: () => ({
    name: "",
    surname: "",
    avatarUrl: "",
    img: "",
    avatarPreview: "",
    imgFile: null,
    showAvatarCropper: false,
    result: {
      coordinates: null,
      image: null,
    },
  }),
  components: {
    Cropper,
    Preview,
  },
  validations: {
    name: { required },
    surname: { required },
  },
  mounted() {
    const name = this.$store.getters.info.name;
    const surname = this.$store.getters.info.surname;
    const userAvatar = this.$store.getters.info.avatarUrl;
    this.avatarUrl = this.$store.getters.info.avatarUrl;
    this.name = name;
    this.surname = surname;
    this.avatarPreview = userAvatar;
  },
  methods: {
    changeAvatar(item) {
      this.showAvatarCropper = !this.showAvatarCropper;
      const [file] = item.target.files;

      //this.imgFile = file;
      //this.avatarUrl = file.name;
      let r = URL.createObjectURL(file);
      this.img = r;
      this.avatarPreview = r;
    },
    uploadImage() {
      const { canvas } = this.$refs.cropper.getResult();
      const r = this.$refs.cropper.getResult().canvas.toDataURL();
      const ai = this.$refs.userAvatarInput;
      canvas.toBlob((blob) => {
        let fileA = new File([blob], "img.jpg", {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
       // console.log(fileA)
        let container = new DataTransfer();
        container.items.add(fileA);

        this.imgFile = fileA;
        this.avatarUrl = fileA.name;
        //ai.files = container.files;
      }, "image/jpeg");

      const [file] = ai.files;
      //this.imgFile = file;
      //this.avatarUrl = file.name;
      this.img = r;
      this.avatarPreview = r;
      this.showAvatarCropper = !this.showAvatarCropper;
    },
    closeModalCreateContr() {
      this.showAvatarCropper = !this.showAvatarCropper;
    },
    change({ coordinates, image }) {
      this.result = {
        coordinates,
        image,
      };
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
          imgFile: this.imgFile,
        });

        this.$v.$reset();
        this.$message("Данные успешно обновлены");
        this.$emit("setInfo", userInfo);
        this.avatarPreview = this.$store.getters.info.avatarUrl;
      } catch (e) {
        this.$error("Данные не были обновлены:" + e);
      }
    },
  },
};
</script>
