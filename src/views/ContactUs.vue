<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="contact-us">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Contact Us</div>
        <div class="content-wrapper">
          <div class="panel contact-no">
            <i class="icon icon-phone"></i>
            <div class="context numbers">
              <div class="number-wrapper">
                <label>Office:</label>
                <span>01632 960991</span>
              </div>
              <div class="separator"></div>
              <div class="number-wrapper">
                <label>Andreea:</label>
                <span>+44 1632 960419</span>
              </div>
              <div class="number-wrapper">
                <label>Cora:</label>
                <span>+44 1632 960454</span>
              </div>
            </div>
          </div>
          <div class="panel contact-email">
            <i class="icon icon-envelope"></i>
            <div class="context emails">
              <BorderedButton mail="mailto:office@scottisdb.com" icon="envelope" size="sm">Office</BorderedButton>
              <BorderedButton mail="mailto:support@scottisdb.com" icon="envelope" size="sm">Support</BorderedButton>
              <div class="separator"></div>
              <BorderedButton mail="mailto:andreea.office@scottisdb.com" icon="envelope" size="sm">Andreea</BorderedButton>
              <BorderedButton mail="mailto:cora.office@scottisdb.com" icon="envelope" size="sm">Cora</BorderedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Loading from '@/components/Loading.vue';
import BorderedButton from '@/components/BorderedButton.vue';

export default {
  components: {
    Loading,
    BorderedButton,
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.contact-us {
  .top-wrapper {
    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      .panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        border: 1px solid $border-blue;
        width: 260px;
        padding: 10px;
        background-color: rgba($bg-blue, .8);
        margin: 10px 0;
        > .icon {
          font-size: 10em;
          margin-bottom: 20px;
        }
        .context {
          display: flex;
          flex-direction: column;
          align-self: stretch;
          align-items: center;
          .number-wrapper {
            display: flex;
            align-self: stretch;
            label {
              flex: 1;
              margin-right: 5px;
              color: darken($text-blue, 15%);
              font-weight: 700;
              text-align: right;
            }
            span {
              flex: 1;
              margin-left: 5px;
            }
          }
          .separator {
            position: relative;
            align-self: stretch;
            margin: 10px 0;
            &:before {
              content: '';
              position: absolute;
              left: 5px;
              right: 5px;
              top: 50%;
              transform: translateY(-50%);
              height: 1px;
              background-color: $text-blue;
            }
          }
          .bordered-button {
            width: 120px;
            margin: 4px 0;
          }
        }
      }
    }
  }
}
</style>
