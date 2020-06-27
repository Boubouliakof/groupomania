<template>
    <div>
        <b-row>
            <b-col sm="8">
                <h3>Les posts</h3>
            </b-col>
            <b-col sm="4">
                <router-link :to="{ name: 'addPost'}">
                    <b-button class="float-right" variant="success">Ajouter</b-button>
                </router-link>
            </b-col>
        </b-row>
        <hr>
        <b-alert show dismissible fade variant="success" v-if="$route.params.message"> {{ $route.params.message }}</b-alert>
        
        <template v-if="posts.length == null">
            <b-alert show variant="secondary" >Il n'y a aucun post !</b-alert>
        </template>

        <template v-else>
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </template>
    </div>
</template>

<script>
    import axios from "axios"
    import PostCard from '@/components/posts/PostCard'

    export default {
        name: "postsList",
        components: {
            PostCard
        },
        data () {
            return {
                posts: {}
            }
        },
        mounted () {
            axios.get('posts').then(response => {
                this.posts = response.data
                // console.log(this.items)
            })
        }
    };
</script>
