<template>
  <div :class="variant">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    variant: String,
  },
};
</script>

<style scoped>
.h1 {
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 32px;
  margin-top: 8px;
}
.h2 {
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 8px;
}

.p {
  font-size: 16px;
}

.strong {
  font-weight: bold;
}

.error {
  color: rgb(255, 89, 89);
  margin-top: 16px;
}
</style>
