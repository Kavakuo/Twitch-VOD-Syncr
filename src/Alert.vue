<template>
  <div v-if="dismissCountDown > 0">
    <b-alert :show="dismissCountDown"
             dismissible
             :variant="variant"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
      <p v-text="msg"></p>
      <b-progress :variant="variant"
                  :max="dismissSecs"
                  :value="dismissCountDown - 1"
                  height="4px">
      </b-progress>
    </b-alert>

  </div>
</template>

<script>
import jump from 'jump.js'

export default {
  name:"Alert",
  props:["msg", "variant"],
  data () {
    return {
      dismissSecs: 8,
      dismissCountDown: 0,
      showDismissibleAlert: false,
    }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
      setTimeout(() => {
        jump('#alert',{
          duration: 500,
          offset: -10
        });
      }, 200);
    }
  }
}
</script>