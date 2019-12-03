<template>
  <div v-if="ready" class="constituency" :class="[ size ]">
    <div class="zone">
      <label class="code">{{ getZone }}</label>
      <label v-if="distance" class="distance">({{ distanceShort }} mi.)</label>
    </div>
    <div class="body">
      <template v-if="size === 'sm'">
        <section v-if="size === 'sm'" class="constituency-name">{{ constituency.Name }}</section>
      </template>
      <template v-else>
        <div class="avatar">
          <img :src="member.PhotoURL" />
        </div>
        <div class="details">
          <section class="constituency-name">{{ constituency.Name }}</section>
          <section class="panel left">
            <div class="line full-name">
              <label class="label">Name: </label>
              <span class="value">{{ member.ParliamentaryName }}</span>
            </div>
            <div class="line date-of-birth">
              <label class="label">Birth date: </label>
              <span class="value">{{ getDateOfBirth }}</span>
            </div>
            <div class="line gender">
              <label class="label">Gender: </label>
              <span class="value">{{ getGender }}</span>
            </div>
            <div class="line email">
              <label class="label">Email: </label>
              <span class="value">{{ contact.Address }}</span>
            </div>
          </section>
          <section class="panel right">
            <div class="line valid-from">
              <label class="label">Valid since: </label>
              <span class="value">{{ formatDate(electionMember.ValidFromDate) }}</span>
            </div>
          </section>
        </div>
      </template>
      <div class="more-wrapper">
        <BorderedButton id="search-button" :mail="contactHref" icon="contact-us" size="sm">Contact</BorderedButton>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import BorderedButton from '@/components/BorderedButton.vue';

export default {
  components: {
    BorderedButton,
  },
  props: ['id', 'zone', 'size', 'distance'],
  data() {
    return {
      constituency: undefined,
      electionMember: undefined,
      contact: undefined,
      member: undefined,
      region: undefined,
      ready: false,
    };
  },
  mounted() {
    this.constituency = this.$store.getters.getConstituencies.find(c => c.ID === this.id);
    this.electionMember = this.$store.getters.getElectionMembers.find(em => em.ConstituencyID === this.constituency.ID);
    this.contact = this.$store.getters.getEmailAddresses.find(ca => ca.PersonID === this.electionMember.PersonID);
    this.member = this.$store.getters.getMembers.find(m => m.PersonID === this.electionMember.PersonID);
    this.region = _.chain(this.$store.getters.getRegions)
      .find(r => this.constituency.RegionID === r.ID)
      .value();
    this.ready = true;
  },
  computed: {
    distanceShort() {
      return this.distance.toFixed(1);
    },
    getGender() {
      return (this.member.GenderTypeID === 1) ? 'Female' : 'Male';
    },
    getDateOfBirth() {
      return (this.member.BirthDateIsProtected) ? 'Protected' : this.formatDate(this.member.BirthDate);
    },
    getZone() {
      return this.zone || this.region.Name;
    },
    contactHref() {
      if (!this.contact) { return undefined; }
      return `mailto:${this.contact.Address}`;
    },
  },
  methods: {
    formatDate(toFormat) {
      if (toFormat === undefined) {
        return 'Unknown';
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [date] = toFormat.split('T');
      const [year, month, day] = date.split('-');
      return `${day} ${months[month - 1]} ${year}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.constituency {
  display: flex;
  flex-direction: column;
  border: 1px solid $border-blue;
  border-radius: 4px;
  .zone {
    position: relative;
    border-bottom: 1px solid $border-blue;
    padding: 4px;
    background-color: $bg-blue;
    font-size: 1em;
    text-align: center;
    .distance {
      position: absolute;
      right: 5px;
      font-weight: 700;
    }
  }
  .body {
    flex: 1;
    padding: 20px;
    .constituency-name {
      flex: 1;
      flex-shrink: 0;
      font-size: 1.2em;
    }
    .more-wrapper {
      display: flex;
      align-items: center;
      align-self: stretch;
      justify-content: center;
      margin-top: 20px;
      > * {
        display: inline-flex;
      }
    }
  }
  &.full {
    .body {
      display: grid;
      .avatar {
        position: relative;
        grid-area: avatar;
        background-position: center;
        background-size: cover;
        border-radius: 100%;
        border: 2px solid $border-blue;
        overflow: hidden;
        img {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
        }
      }
      .details {
        grid-area: details;
        display: grid;
        justify-items: center;
        .constituency-name {
          grid-area: constituency;
          font-size: 1.5em;
          text-align: center;
          background-color: rgba(darken($text-blue, 20%), .4);
          width: 100%;
        }
        .panel {
          padding: 15px;
          .line {
            margin: 2px 0;
            word-break: break-all;
            label {
              color: darken($text-blue, 15%);
            }
          }
        }
        .left {
          grid-area: left;
          justify-self: left;
        }
        .right {
          grid-area: right;
        }
      }
      .more-wrapper {
        grid-area: more;
        align-self: center;
        flex-direction: column;
        margin: 0;
      }
    }
  }
  &.sm {
    height: 220px;
    .body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}

@media (min-width: 320px)  { /* smartphones, iPhone, portrait 480x320 phones */
  .constituency { min-width: 230px; }
  .constituency.full {
    .body {
      grid-template-areas:
        "avatar more"
        "details details";
      grid-template-columns: 64px 1fr;
      grid-template-rows: 64px 1fr;
      grid-row-gap: 20px;
      grid-column-gap: 0;
      .details {
        grid-template-areas:
          "constituency"
          "left"
          "right";
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content;
        .panel.right { justify-self: left; }
      }
      .more-wrapper { justify-self: right; }
    }
  }
}
@media (min-width: 481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  .constituency { min-width: 350px; }
  .constituency.full {
    .body {
      grid-template-areas: "avatar details more";
      grid-template-columns: 128px 1fr min-content;
      grid-template-rows: 128px;
      grid-row-gap: 0;
      grid-column-gap: 20px;
      .details {
        grid-template-areas: "constituency constituency"
                             "        left        right";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: min-content 1fr;

        .panel .line { word-break: break-all; }
        .panel.right { justify-self: right; }
      }
      .more-wrapper { justify-self: initial; }
    }
  }
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
