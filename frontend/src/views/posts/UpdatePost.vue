<template>
    <div>
        <h3>Modification du post</h3>
        <hr>
        <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>
        <!-- Create Post Form -->
        <b-form @submit.prevent="editPost">
            <!-- Image preview -->
            <div class="mb-3" id="preview">
                <img :src="imgPreview ? imgPreview : post.imageUrl" />
            </div>

            <!-- Image input -->
            <div class="mb-3">Selectionner une image</div>
            <input 
                type="file"
                ref="file"
                @change="selectFile"
            />

            <!-- Post input -->
            <b-form-group id="input-group-1" label="Titre :" label-for="input-post" >
                <b-form-input
                    id="input-post"
                    type="text"
                    placeholder="Entrer votre message"
                    required
                    v-model="post.post"
                >
                </b-form-input>
            </b-form-group>

            <!-- Submit Button -->
            <b-button class="float-right" type="submit" variant="primary">Modifier le post</b-button>
        </b-form>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: "UpdatePost",
        components: {
            //
        },
        data () {
            return {
                post: {
                    post: ''
                },
                imgPreview: '',
                file: '',
                error: ''
            }
        },
        methods: {
            selectFile() {
                this.file = this.$refs.file.files[0];
                this.imgPreview = URL.createObjectURL(this.file);
            },
            async editPost() {
                const formData = new FormData();
                formData.append('post', this.post.post);
                formData.append('file', this.file);

                try {
                    let response = await axios.put("posts/"+this.$route.params.postId, formData);
                    console.log(response.data);

                    this.$router.replace({
                        name: 'postsList',
                        params: { message: response.data.success}
                    })
                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        },
        mounted () {
            axios.get("posts/"+this.$route.params.postId).then(response => {
                this.post = response.data;
            })
        }
    }
</script>