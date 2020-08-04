<template>
    <div>
        <router-link :to="{ name: 'showItem', params: {itemId: item.id } }">
            <b-card>
                <b-media>
                    <template v-slot:aside>
                        <b-img :src="item.User.imgUrl" width="64" :alt="item.User.firstname" rounded="circle"></b-img>
                    </template>

                    <h4 class="mt-0">{{ item.User.firstname }} {{ item.User.lastname }}</h4>
                    <p>{{ item.User.service }}</p>
                    <b-img :src="item.imageUrl" fluid alt="" style="float: left; margin-right: 20px; margin-bottom: 10px;"></b-img>
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.description }}</p>
                    <p>Prix : {{ item.price }} €</p>
                </b-media>
            </b-card>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "ItemCard",
        props: ['item']
    };
</script>
