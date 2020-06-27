<template>
  <div class="main">
    
    <h3>Dashboard - Liste des fonctionnalités</h3>
    <hr>
    <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>

    <b-row class="mb-3">
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'mediasList'}">
          <b-card
            img-src="https://picsum.photos/300/300/?image=250"
            img-alt="Image"
            style=" max-width: 538px"
            header="Gallerie photos"
            header-text-variant="white"
            header-bg-variant="secondary"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Partagez vos dernières photos ici !</b-card-text>
            <b-card-footer > Ceci est un pied de page </b-card-footer >
          </b-card>
        </router-link>
          
      </b-col>
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'itemsList'}">
          <b-icon icon="cart4"></b-icon>
          <b-card
            img-src="https://picsum.photos/300/300/?image=491"
            img-alt="Image"
            header="Annonces"
            header-text-variant="white"
            header-bg-variant="secondary"
            border-variant="secondary"
            class="text-center"
          >
          <b-card-text>Retrouvez les dernières annonces de ventes ici !</b-card-text>
          <b-card-footer > Ceci est un pied de page </b-card-footer >
          </b-card>
        </router-link>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'messagesList'}">
          <b-card
            img-src="https://picsum.photos/300/300/?image=998"
            img-alt="Image"
            style=" max-width: 538px"
            header="Forum messages"
            header-text-variant="white"
            header-bg-variant="secondary"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Venez discutez et voir les derniers messages ici !</b-card-text>
            <b-card-footer > 
              <h4>Les derniers messages</h4>  
            </b-card-footer >
            <b-alert show variant="secondary" v-if="messages.length == null">Il n'y a aucuns messages !</b-alert>
              <MessageCard v-for="message in messages" :key="message.id" :message="message" class="mb-2" />
          </b-card>
        </router-link>
      </b-col>
     <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'postsList'}">
          <b-icon icon="cart4"></b-icon>
          <b-card
            img-src="https://picsum.photos/300/300/?image=491"
            img-alt="Image"
            header="Posts"
            header-text-variant="white"
            header-bg-variant="secondary"
            border-variant="secondary"
            class="text-center"
          >
          <b-card-text>Retrouvez les derniers posts ici !</b-card-text>
          <b-card-footer > Ceci est un pied de page </b-card-footer >
          </b-card>
        </router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from "axios"
  import MessageCard from '@/components/messages/MessageCard'
  
  export default {
    name: "Dashboard",
    props: ['message'],
    components: {
      MessageCard
    },
    computed: {
      ...mapGetters({
          userInfos: 'auth/user'
      })
    },
            data () {
            return {
                messages: {}
            }
        },
        mounted () {
            axios.get('messages').then(response => {
                // console.log(this.messages)
                this.messages = response.data
            })
        }
  };
</script>

<style>
  a,
  a:hover {
    color: #000!important;
    text-decoration: none;
  }
</style>
