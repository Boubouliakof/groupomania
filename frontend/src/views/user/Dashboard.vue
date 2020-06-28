<template>
  <div class="main">
    
    <h3>Dashboard - Liste des fonctionnalités</h3>
    <hr>
    <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>

    <b-row class="mb-3">
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'mediasList'}">
          <b-card-img :src="require('../../assets/logos/gallery.jpg')"></b-card-img>
          <b-card
            header="Gallerie photos"
            header-text-variant="white"
            header-bg-variant="info"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Partagez vos dernières photos ici !</b-card-text>
            <b-card-footer > 
              <h4>Les derniers messages</h4> 
            </b-card-footer >
            <MediaCard v-for="media in medias" :key="media.id" :media="media" class="text-left" />
            <b-alert show variant="secondary" v-if="medias.length == null">Il n'y a aucun contenu multimédia !</b-alert>
          </b-card>
        </router-link>
          
      </b-col>
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'itemsList'}">
          <b-card-img :src="require('../../assets/logos/marketplace.jpg')"></b-card-img>
          <b-card
            header="Marketplace"
            header-text-variant="white"
            header-bg-variant="info"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Retrouvez les derniers objets en vente ici !</b-card-text>
            <b-card-footer > 
              <h4>Les derniers messages</h4> 
            </b-card-footer >
            <b-alert show variant="secondary" v-if="items.length == null">Il n'y a aucuns messages !</b-alert>
            <ItemCard v-for="item in items" :key="item.id" :item="item" class="text-left"/>
          </b-card>
        </router-link>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'messagesList'}">
          <b-card-img :src="require('../../assets/logos/message.jpg')"></b-card-img>
          <b-card
            header-id="cafe"
            header="Forum messages"
            header-text-variant="white"
            header-bg-variant="info"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Venez discuter et voir les derniers messages ici !</b-card-text>
            <b-card-footer > 
              <h4>Les derniers messages</h4>  
            </b-card-footer >
            <b-alert show variant="secondary" v-if="messages.length == null">Il n'y a aucuns messages !</b-alert>
              <MessageCard v-for="message in messages" :key="message.id" :message="message" class="text-left" />
          </b-card>
        </router-link>
      </b-col>
     <b-col md="6" sm="12" class="mt-3">
        <router-link :to="{ name: 'postsList'}">
          <b-card-img :src="require('../../assets/logos/cafe.jpg')"></b-card-img>
          <b-card
            header="Machine à café"
            header-text-variant="white"
            header-bg-variant="info"
            border-variant="secondary"
            class="text-center"
          >
            <b-card-text>Venez échanger librement ici !</b-card-text>
            <b-card-footer > 
              <h4>Les derniers messages</h4> 
            </b-card-footer >
            <b-alert show variant="secondary" v-if="posts.length == null">Il n'y a aucuns messages !</b-alert>
            <PostCard v-for="post in posts" :key="post.id" :post="post" class="text-left"/>
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
  import ItemCard from '@/components/items/ItemCard'
  import MediaCard from '@/components/medias/MediaCard'
  import PostCard from '@/components/posts/PostCard'
  
  export default {
    name: "Dashboard",
    props:  ['message'],
    components: {
      MessageCard,
      ItemCard,
      MediaCard,
      PostCard
    },
    computed: {
      ...mapGetters({
          userInfos: 'auth/user'
      })
    },
    data () {
      return {
        messages: {},
        items: {},
        medias: {},
        posts: {},
        }
      },
    mounted () {
      axios.get('messages').then(response => {
        this.messages = response.data.slice(0, 2)
      })
      axios.get('items').then(response => {
        this.items = response.data.slice(0, 2)
      })
      axios.get('medias').then(response => {
        this.medias = response.data.slice(0, 2)
      })
      axios.get('posts').then(response => {
        this.posts = response.data.slice(0, 2)
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
