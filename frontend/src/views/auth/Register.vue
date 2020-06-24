<template>
  <div>
    <h2>Inscription</h2>
    <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>

    <!-- Creation User Form -->
    <b-form @submit.prevent="createUser" enctype="multipart/form-data" class="card">
      <!-- Image preview -->
      <div class="mb-3" id="preview">
          <img v-if="imgPreview" :src="imgPreview" />
      </div>

      <!-- Image input -->
      <div class="mb-3">Selectionner une image</div>
      <input 
          type="file"
          ref="file"
          @change="selectFile"
      />

      <!-- Lastname input -->
      <b-form-group id="input-group-1" label="Votre nom :" label-for="input-lastname">
        <b-form-input id="input-lastname" type="text" placeholder="Entrer votre nom" required v-model="user.lastname" ></b-form-input>
      </b-form-group>

      <!-- Firstname input -->
      <b-form-group id="input-group-2" label="Votre prenom :" label-for="input-firstname">
        <b-form-input id="input-firstname" type="text" placeholder="Entrer votre prenom" required v-model="user.firstname" ></b-form-input>
      </b-form-group>

      <!-- Service input -->
      <b-form-group id="input-group-2" label="Votre service :" label-for="input-service">
        <b-form-input id="input-service" type="text" placeholder="Entrer votre service" required v-model="user.service" ></b-form-input>
      </b-form-group>

      <!-- Birth input -->
      <b-form-group id="input-group-2" label="Votre date de naissance :" label-for="input-age">
        <b-form-input id="input-date" type="text" placeholder="JJ/MM/AAAA" required v-model="user.age" ></b-form-input>
      </b-form-group>

      <!-- Email input -->
      <b-form-group id="input-group-3" label="Adresse email :" label-for="input-email" >
        <b-form-input id="input-email" type="email" placeholder="Entrer votre adresse email" required v-model="user.email" ></b-form-input>
      </b-form-group>

      <!-- Password input -->
      <b-form-group id="input-group-4" label="Votre mot de passe :" label-for="input-password">
        <b-form-input id="input-password" type="password" placeholder="Entrer votre mot de passe" required v-model="user.password" ></b-form-input>
      </b-form-group>

      <!-- Charte input -->
      <div class="charte">Prendre connaissance de la charte utilisateur =>  <router-link :to="{ name: 'charte'}">Charte</router-link></div>
      <div>
        <input id="charte" type="checkbox" required v-model="user.charte" /> 
        J'accepte de respecter la charte utilisateur
      </div>
      <b-button class="float-left" type="submit" variant="primary">S'inscrire</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from "axios"
  
  export default {
    name: "Register",
    components: {
      //
    },
    data() {
      return {
        user: {
          lastname: '',
          firstname: '',
          service: '',
          age: '',
          email: '',
          password: '',
          charte: '',
        },
        imgPreview: '',
        file: '',
        error:''
      }
    },
    methods: {
      selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
      },
      async createUser() {
        const formData = new FormData();
        formData.append('lastname', this.user.lastname);
        formData.append('firstname', this.user.firstname);
        formData.append('service', this.user.service);
        formData.append('age', this.user.age);
        formData.append('email', this.user.email);
        formData.append('password', this.user.password);
        formData.append('file', this.file);

        try {
            let response = await axios.post("auth/register", formData);
            // console.log(response.data);

            this.$router.replace({ name: 'login', params: { message: response.data.success }});
        } catch (err) {
            this.error = err.response.data.error
        }
      }
    }
  };
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

form {
  max-width: 600px !important;
  padding: 40px 40px;
  margin: auto;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>