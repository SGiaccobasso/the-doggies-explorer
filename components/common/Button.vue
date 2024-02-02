<template>
  <button :="$attrs" v-on="$listeners" class="button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
};
</script>

<style scoped>
.button {
  border-radius: 6px;
  width: 100%;
  background-color: #197dff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #75c8ff;
}
</style>
