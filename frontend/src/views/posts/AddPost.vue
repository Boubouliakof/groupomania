<template>
    <div>
        <h3>Ajouter un post</h3>
        <hr>
        <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>
        
        <!-- Create Post Form -->
        <b-form @submit.prevent="createPost" enctype="multipart/form-data">
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

            <!-- Title input -->
            <b-form-group id="input-group-1" label="Post :" label-for="input-post" >
                <b-form-input
                    id="input-post"
                    type="text"
                    placeholder="Entrer un message"
                    required
                    v-model="post.post"
                >
                </b-form-input>
            </b-form-group>

            <!-- Submit Button -->
            <b-button class="float-right" type="submit" variant="primary">Créer le post</b-button>
        </b-form>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: "AddPost",
        components: {
            //
        },
        data () {
            return {
                post: {
                    post: '',
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
            async createPost() {
                const formData = new FormData();
                formData.append('post', this.post.post);
                formData.append('file', this.file);

                console.log(formData);

                try {
                    let response = await axios.post("posts", formData);
                    console.log(response.data);

                    this.$router.replace({
                        name: 'postsList',
                        params: { message: response.data.success}
                    })
                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        }
    }
</script>