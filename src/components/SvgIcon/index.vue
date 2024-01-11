<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const iconName = computed(() => `#icon-${props.name}`);
    const svgClass = computed(() => {
      if (props.name) {
        return `svg-icon icon-${props.name}`;
      }
      return 'svg-icon';
    });

    return { iconName, svgClass };
  }
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  margin: 0px 5px 0px 0px;
  fill: currentColor;
  vertical-align: middle;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
