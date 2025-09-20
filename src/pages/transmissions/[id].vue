<script lang="ts" setup>
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
const transmissionAudio = pageItems.filter(x => x.indexOf('transmission') > -1)[0]
const transcriptText = pageItems.filter(x => x.indexOf('transcript') > -1)[0]
console.debug(transmissionAudio)
console.debug(transcriptText)
</script>

<template>
  <h1>Transmission: {{transmissionAudio.split('/').slice(0,-1).join(' ')}}</h1>
  <div>
    <audio controls>
      <source :src="`${s3BucketURI}/${transmissionAudio}`" type="audio/mp4" />
      <!-- fallback -->
      <p>Your browser does not support 'audio/mp4'</p>
    </audio>
  </div>
  <div>
    <a :href="`${s3BucketURI}/${transcriptText}`">text</a>
  </div>
</template>
