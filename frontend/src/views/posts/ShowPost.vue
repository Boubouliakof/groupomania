<template>
    <div>
        <b-row>
            <b-col sm="8">
                <h3>Post</h3>
            </b-col>
            <b-col sm="4">
                <template v-if="post.UserId === userInfos.id || userInfos.isAdmin === true">
                    <div class="float-right">
                        <router-link :to="{ name: 'updatePost', params: { postId: post.id}}">
                            <b-button variant="warning">Modifier</b-button>
                        </router-link>

                        <b-button v-on:click="deletePost" variant="danger" class="ml-2">Supprimer</b-button>
                    </div>
                </template>
            </b-col>
        </b-row>
        <hr>
        <b-media>
            <template v-slot:aside>
                <b-img :src="user.imgUrl" width="64" :alt="user.firstname" rounded="circle"></b-img>
            </template>

            <h5 class="mt-0">{{ user.firstname }} {{ user.lastname }}</h5>
            <p>{{ post.post }}</p>
            <b-img :src="post.imageUrl" fluid alt=""></b-img>
        </b-media>
    </div>
</template>

<script>
    import axios from "axios"
    import { mapGetters } from 'vuex'

    export default {
        name: "showItem",
        computed: {
            ...mapGetters({
                userInfos: 'auth/user'
            })
        },
        data () {
            return {
                post: {},
                user: {}
            }
        },
        methods: {
            async deletePost() {
                try {
                    let response = await axios.delete("posts/"+this.$route.params.postId);
                    console.log(response);

                    this.$router.replace({
                        name: 'postsList',
                        params: { message: response.data.success}
                    });
                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        },
        mounted () {
            axios.get('posts/'+this.$route.params.postId).then(response => {
                this.post = response.data
                this.user = response.data.User
            })
        }
    };
</script>
