<template>
  <div class="postcode-wrapper" :class="{ compact }">
    <div class="postcode-search">
      <div class="input-wrapper postcode" :class="{ invalid: getValidation }">
        <i v-if="getValidation" class="icon icon-warning"></i>
        <label v-if="!compact" for="postcode">POSTCODE</label>
        <input v-if="!compact" type="text" name="postcode" id="postcode" v-model="area" />
        <input v-else type="text" name="postcode" id="postcode" v-model="area" placeholder="postcode" />
      </div>
      <div class="input-wrapper distance">
        <label v-if="!compact" for="distance">DISTANCE</label>
        <input type="text" name="distance" id="distance" @blur="blurDistance" @focus="focusDistance" v-model="miles"/>
      </div>
      <BorderedButton v-if="compact" id="search-button" :href="searchHref" icon="search" size="sm">Search</BorderedButton>
    </div>
    <div v-if="!compact" class="control-wrapper">
      <OpaqueButton id="advanced-button" icon="cog">Advanced</OpaqueButton>
      <BorderedButton id="search-button" :href="searchHref" icon="search">Search</BorderedButton>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

import BorderedButton from '@/components/BorderedButton.vue';
import OpaqueButton from '@/components/OpaqueButton.vue';

export default {
  components: {
    BorderedButton,
    OpaqueButton,
  },
  props: ['compact'],
  data() {
    return {
      distance: 0,
      distanceIsActive: false,
      postcode: '',
      postcodeIsValid: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.area = this.$route.query.postcode || this.postcode;
        this.miles = this.$route.query.distance || this.distance;
      }, 500);
    });
  },
  methods: {
    blurDistance() {
      this.distanceIsActive = false;
    },
    focusDistance() {
      this.distanceIsActive = true;
    },
    parseDistance(distance) {
      return Number.parseInt(distance.toString().replace(/[^\d]/g, ''), 10);
    },
    checkValidation(postcode) {
      if (!postcode.length) {
        this.postcodeIsValid = false;
      } else {
        axios.get(`https://api.postcodes.io/postcodes/${postcode}/validate`).then((response) => {
          this.postcodeIsValid = response.data.result;
        }, () => {
          this.postcodeIsValid = false;
        });
      }
    },
  },
  computed: {
    searchHref() {
      if (!this.postcodeIsValid) { return undefined; }
      return { name: 'search-result', query: { postcode: this.postcode, distance: this.parseDistance(this.distance) } };
    },
    getValidation() {
      return (this.postcode.length > 0 && !this.postcodeIsValid);
    },
    area: {
      get() {
        return this.postcode;
      },
      set(newValue) {
        this.postcode = newValue;
        this.checkValidation(newValue);
      },
    },
    miles: {
      get() {
        const distance = this.distance.toString();
        if (this.distanceIsActive) { return distance; }
        return `${distance} mi.`;
      },
      set(newValue) {
        let distance = this.parseDistance(newValue);
        if (Number.isNaN(distance)) { distance = 0; }
        this.distance = _.clamp(distance, 0, 15);
      },
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.postcode-wrapper {
  &:not(.compact) .postcode-search {
    margin: 10px 15%;
    .input-wrapper {
      border-radius: 8px;
      &.distance input {
        font-size: 2em;
        font-weight: 500;
      }
      input {
        font-size: 3em;
        height: 70px;
      }
    }
  }
  &.compact {
    width: 50%;
    .postcode-search .input-wrapper {
      border-radius: 4px;
      input { height: 30px; }
    }
    #search-button { margin-left: 10px; }
  }
  .postcode-search {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .input-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      border: 1px solid $text-blue;
      text-align: center;
      &.postcode {
        width: 75%;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        .icon-warning {
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
          color: #ff6347;
        }
        &.invalid {
          border-color: #ff6347;
          background-color: darken(#ff6347, 50%);
          input { color: #ff6347; }
          label { color: #ff6347; }
        }
      }
      &.distance {
        width: 25%;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: none;
      }
      input {
        background: rgba($border-blue, 0.2);
        border: none;
        outline: none;
        box-shadow: none;
        color: $text-blue;
        text-align: center;
      }
      label {
        font-size: 0.9em;
        padding: 2px 0;
        font-weight: 500;
      }
    }
  }

  .control-wrapper {
    display: flex;
    flex-flow: row-wrap;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 20px 15%;
    padding: 0 2%;
    #advanced-button {
      .icon {
        transform: rotate(0deg);
        transition: transform .2s ease;
      }
      &:hover .icon {
        transform: rotate(90deg);
      }
    }
  }
}

@media (min-width: 320px)  { /* smartphones, iPhone, portrait 480x320 phones */
  .postcode-wrapper:not(.compact) {
    .postcode-search, .control-wrapper {
      margin-left: 2%;
      margin-right: 2%;
      .input-wrapper input { height: 40px }
      .input-wrapper label { font-size: 0.8em }
      .input-wrapper.postcode input { font-size: 1.8em; }
      .input-wrapper.distance input { font-size: 1.4em; }
    }
  }
}
@media (min-width: 481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  .postcode-wrapper:not(.compact) {
    .postcode-search, .control-wrapper {
      margin-left: 15%;
      margin-right: 15%;
      .input-wrapper input { height: 70px }
      .input-wrapper label { font-size: 0.9em }
      .input-wrapper.postcode input { font-size: 3em; }
      .input-wrapper.distance input { font-size: 2em; }
    }
  }
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  header { text-align: initial; }
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
