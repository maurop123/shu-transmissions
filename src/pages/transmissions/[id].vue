<script lang="ts" setup>
import { ref } from "vue";
const route = useRoute()

// Get S3 bucket contents
const { data } = await useFetch("/s3");
const { Contents } = data.value;
const contentKeys = Contents.map((x) => x.Key);

const pageItems = contentKeys.reduce((arr, key) => {
  const split = key.split('/').filter(x => x !== '')
  if (split.length === 3) {
    const id = ''.concat(
      split[0].replaceAll('-', ''),
      split[1].replaceAll('.', ''),
    )

    if (route.params.id == id) {
      arr = arr.concat(split.join('/'))
    }
  }
  return arr
}, [])

const s3BucketURI = `https://${process.env.NUXT_PUBLIC_S3_BUCKET}.s3.us-east-2.amazonaws.com`;
/* const s3BucketURI = `https://luna-channels.s3.us-east-2.amazonaws.com`; */
const transmissionAudio = pageItems.filter(x => x.indexOf('transmission') > -1)[0]
const transcriptText = pageItems.filter(x => x.indexOf('transcript.txt') > -1)[0]

const resp = await useFetch("/getTranscript", {
  method: 'POST',
  body: transcriptText
});
const transcript = resp.data

</script>

<template>
  <h1>Transmission: {{transmissionAudio.replaceAll('.',':').split('/').slice(0,-1).join(' ')}}</h1>
  <div style="margin-top:30px">
    <audio controls>
      <source :src="`${s3BucketURI}/${transmissionAudio}`" type="audio/mp3" />
      <!-- fallback -->
      <p>Your browser does not support 'audio/mp4'</p>
    </audio>
  </div>
  <div style="margin-top:30px">
    {{transcript}}
  </div>
</template>
