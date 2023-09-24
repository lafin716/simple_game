<script setup>
import PhaserContainer from '@/components/PhaserContainer'
</script>

<template>
  <Suspense>
    <PhaserContainer />

    <template #fallback>
      <div class="placeholder">
        로딩 중 ...
      </div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
