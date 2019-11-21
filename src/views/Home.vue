<template>
  <div class="home">
    <div class="top-wrapper">
      <div class="bg-city"></div>
      <div class="heading">Find out more information about your area</div>
      <div class="postcode-wrapper">
        <div class="input-wrapper postcode">
          <label for="postcode">POSTCODE</label>
          <input type="text" name="postcode" id="postcode"/>
        </div>
        <div class="input-wrapper distance">
          <label for="distance">DISTANCE</label>
          <input type="text" name="distance" id="distance" @blur="distanceIsActive=false" @focus="distanceIsActive=true" v-model="miles"/>
        </div>
      </div>
      <div class="control-wrapper">
        <OpaqueButton id="advanced-button" icon="cog">Advanced</OpaqueButton>
        <BorderedButton id="search-button" icon="search">Search</BorderedButton>
      </div>
    </div>
  </div>
</template>

<script>
import OpaqueButton from '@/components/OpaqueButton.vue';
import BorderedButton from '@/components/BorderedButton.vue';

export default {
  components: {
    OpaqueButton,
    BorderedButton,
  },
  data() {
    return {
      distance: 0,
      distanceIsActive: false,
    };
  },
  computed: {
    miles: {
      get() {
        if (this.distanceIsActive) {
          return this.distance.toString();
        }
        return `${this.distance} mi.`;
      },
      set(newValue) {
        let distance = parseInt(newValue.replace(/[^\d]/g, ''), 10);
        console.log(distance);
        if (Number.isNaN(distance)) {
          distance = 0;
        }
        this.distance = distance;
      },
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.home {
  display: flex;
  flex-direction: column;
}
.top-wrapper {
  flex: 1;
  position: relative;
  .bg-city {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/images/wallpaper.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    &:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(rgba(black, 0) 0%, rgba(black, 0.8) 60%);
    }
  }
  .heading {
    position: relative;
    font-size: 3em;
    font-weight: 300;
    text-align: center;
    margin: 35px 0;
  }
  .postcode-wrapper {
    position: relative;
    padding: 10px 20%;
    display: flex;
    text-align: center;
    justify-content: center;
    .input-wrapper {
      display: flex;
      flex-direction: column;
      border: 1px solid $text-blue;
      border-radius: 8px;
      text-align: center;
      &.postcode {
        width: 70%;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      &.distance {
        width: 25%;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: none;
      }
      input {
        font-size: 3em;
        background: rgba($border-blue, 0.2);
        border: none;
        outline: none;
        box-shadow: none;
        color: $text-blue;
        text-align: center;
        height: 70px;
      }
      &.distance input{
        font-size: 2em;
        font-weight: 500;
      }
      label {
        font-size: 0.9em;
        padding: 2px 0;
        font-weight: 500;
      }
    }
  }
  .control-wrapper{
    position: relative;
    margin: 10px 20%;
    #search-button {
      position: absolute;
      right: 30px;
    }
    #advanced-button {
      position: absolute;
      padding: 15px 0;
      left: 30px;
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
</style>
