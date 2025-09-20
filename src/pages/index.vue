<script lang="ts" setup>
/* import { ref } from "vue"; */

// Get S3 bucket contents
const { data } = await useFetch("/s3");
const { Contents } = data.value;
const contentKeys = Contents.map((x) => x.Key);
console.debug(contentKeys);
//Data manip of contentKeys
//depends on consistent data structure of S3 file storage
//see README for notes on data struct
const reducedKeys = contentKeys.reduce((arr, key) => {
  const split = key.split('/').filter(x => x !== '')
  if (split.length === 3 && split[2].indexOf('transmission') > -1) {
    const id = ''.concat(
      split[0].replaceAll('-', ''),
      split[1].replaceAll('.', ''),
    )
    const newKey = `${split[0]}_${split[1]}`
    return arr.concat({id,key:newKey})
  }
  else return arr
}, [])

// For file upload
/*
const s3BucketURI = `https://${process.env.S3_BUCKET}.s3.us-east-2.amazonaws.com`;
const selectedFile = ref(null);
const uploadStatus = ref("");
const today = new Date();
const dateSelected = ref(
  `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
);

function handleFileUpload(e) {
  const file = e.target.files[0];
  selectedFile.value = file;
}

async function uploadFile() {
  console.debug("upload", selectedFile.value);

  if (selectedFile.value === null) {
    uploadStatus.value = "No file selected";
  } else {
    const response = await useFetch("/upload", {
      method: "POST",
      body: { selectedFile: selectedFile.value, dateSelected },
      headers: {
        "Content-Type": selectedFile.value.type,
      },
    });
    console.debug("post response", response.data);
  }
}
 */
</script>

<template>
  <div>
    <h1>Shu Transmissions</h1>
  </div>
  <!--
    <div class="form-container">
      <label>Date</label>
      <input type="text" v-model="dateSelected" style="margin-bottom: 1.5rem" />
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadFile">Upload</button>
    </div>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  -->
  <ul>
    <li v-for="{id, key} in reducedKeys">
      <a :href="`/transmissions/${id}`" target="blank">
        {{ key }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-flow: column;
}

.form-container * {
  margin-bottom: 0.5rem;
}
</style>
