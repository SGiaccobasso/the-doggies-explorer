<template>
  <div class="doggy-card">
    <div v-html="formattedParagraph"></div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    paragraph: String,
  },
  setup(props) {
    const formattedParagraph = computed(() => {
      const nonFormattedText = props.paragraph.replace(/\*\*(.*?)\*\*/g, "");

      const formattedText = nonFormattedText.replace(/(⚡️)/g, "$1");

      const formattedLink = formattedText.replace(
        /\[([^\]]+)\]\(([^\)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: white;">$1</a>'
      );

      return `${formattedLink}`;
    });

    return {
      formattedParagraph,
    };
  },
};
</script>

<style scoped>
.doggy-card {
  text-align: left;
}
</style>
