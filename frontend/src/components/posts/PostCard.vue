<template>
    <div>
        <router-link :to="{ name: 'showPost', params: {postId: post.id }}">
            <b-card>
                <b-media>
                    <template v-slot:aside>
                        <b-img :src="post.User.imgUrl" width="64" :alt="post.User.firstname" rounded="circle"></b-img>
                    </template>

                    <h5 class="mt-0">{{ post.User.firstname }} {{ post.User.lastname }}</h5>
                    <b-img :src="post.imageUrl" fluid alt="image post" style="max-width: 200px; float: left; margin-right: 20px;"></b-img>
                    <p>{{ post.post }}</p>
                </b-media>
            </b-card>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "PostCard",
        props: ['post']
    };
</script>