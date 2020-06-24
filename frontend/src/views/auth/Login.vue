<template>
  <div>
    <h2>Connexion</h2>
    <hr>
    <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>
    <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>

    <b-form @submit.prevent="onSubmit" class="card">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <b-form-group id="input-group-1" label="Adresse email :" label-for="input-email" >
        <b-form-input id="input-email" type="email" placeholder="Entrer votre adresse email" required v-model="form.email" >
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Votre mot de passe :" label-for="input-password">
        <b-form-input id="input-password" type="password" placeholder="Entrer votre mot de passe" required v-model="form.password" >
        </b-form-input>
      </b-form-group>

      <b-button class="float-right" type="submit" variant="primary">Se connecter</b-button>
    </b-form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: "Login",
    components: {
      //
    },
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      ...mapActions({
        signIn: 'auth/signIn'
      }),

      onSubmit() {
        this.signIn(this.form).then((res) => {
          if(res) {
            this.error = res
          }
          this.$router.replace({
            name: 'dashboard',
            params: { message: "Vous êtes connecté !"}
          })
        })
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
  max-width: 450px !important;
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

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>