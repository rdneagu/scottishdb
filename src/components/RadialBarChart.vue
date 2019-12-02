<template>
  <div class="radial-bar-chart">
    <svg viewBox="0 0 36 36">
      <circle class="hollow" cx="18" cy="18" r="15.91549430918954" fill="#fff"></circle>
      <circle class="ring" cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke-width="1"></circle>
      <circle class="segment" cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke-width="1" :stroke-dasharray="strokePercentage" stroke-dashoffset="25"></circle>
      <text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" class="percentage">{{ value }}%</text>
    </svg>
    <label class="label">{{ label }}</label>
  </div>
</template>

<script>
// circumference − all preceding segments’ total length + first segment’s offset = current segment offset
export default {
  props: ['label', 'value'],
  computed: {
    strokePercentage() {
      const rounded = Math.ceil(this.value);
      return `${rounded} ${100 - rounded}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.radial-bar-chart {
  position: relative;
  display: grid;
  grid-template-areas: "radial" "label";
  grid-template-rows: 250px min-content;
  grid-template-columns: 250px;
  align-items: center;
  justify-content: center;
  svg {
    grid-area: radial;
    .hollow { fill: $bg-blue; }
    .ring { stroke: darken($bg-blue, 4%); }
    .segment { stroke: $text-blue; }
    .percentage {
      fill: $text-blue;
      font-size: 0.4em;
      font-weight: 500;
    }
  }
  .label {
    grid-area: label;
    display: block;
    font-size: 0.8em;
    font-weight: 700;
    text-align: center;
  }
}
</style>
