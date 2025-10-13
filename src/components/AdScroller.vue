<template>
  <div class="scroller-container" data-speed="slow">
    <div class="scroller-track">
      <img v-for="(ad, index) in allAds" :key="`ad1-${index}`" :src="ad.src" :alt="ad.alt" class="scroller-item rounded-3" />
      <img v-for="(ad, index) in allAds" :key="`ad2-${index}`" :src="ad.src" :alt="ad.alt" class="scroller-item rounded-3" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const allAds = ref([]);

// Dynamically import all ad images from the assets folder
const imageContext = import.meta.glob('../assets/ads/*.jpg', { eager: true });

for (const path in imageContext) {
  allAds.value.push({
    src: imageContext[path].default,
    alt: `Advertisement ${allAds.value.length + 1}`
  });
}
</script>

<style scoped>
.scroller-container {
  /* Creates the fade-out effect on the left and right edges */
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  overflow: hidden;
}

.scroller-track {
  display: flex;
  gap: 1.5rem; /* Create space between images */
  width: max-content;
  /* Animation that moves the track */
  animation: scroll 60s linear infinite;
}

/* Pause Animation: When the user hovers over the container */
.scroller-container:hover .scroller-track {
  animation-play-state: paused;
}

.scroller-item {
  height: 250px; 
  width: auto; /* Allow width to adjust based on aspect ratio */
  object-fit: contain; /* Ensures the whole image is visible without stretching */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* Zoom effect on individual image hover */
.scroller-item:hover {
    transform: scale(1.05);
    cursor: pointer;
}

/* Keyframes for the scrolling animation */
@keyframes scroll {
  to {
    /* Moves the track to the left by the width of the first set of images */
    transform: translateX(calc(-100% / 2));
  }
}
</style>