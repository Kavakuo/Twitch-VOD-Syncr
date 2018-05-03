<template>
  <b-form-group :label-for="id" label="Relative timestamp of main VOD" :invalid-feedback="invalidFeedback" :valid-feedback="validFeedback" :state="state">
    <b-form-input :id="id" v-model="time" placeholder="hh:mm:ss" :state="state"></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  name: 'TimestampInput',
  props: ["id"],
  data: function() {
    return {
      time: '',
    }
  },
  computed: {

    state: function() {
      return this.parsed ? true : false; 
    },

    validFeedback: function() {
      return this.state ? this.parsed.hours + "h " + this.parsed.minutes + "m " + this.parsed.seconds + "s" : '';
    },

    invalidFeedback: function() {
      if (!this.parsed && this.time != "") {
        return "Invalid format!"
      }
      else if (!this.parsed && this.time == "") {
        return 'Required field.'
      }
    },

    parsed: function() {
      let input = this.time.split(":");
      const tRes = {
        hours:   0,
        minutes: 0,
        seconds: 0,
      }
      if (input.length == 3 && /^[0-9]+:[0-9]+:[0-9]+$/i.test(input.join(':'))) {
        tRes.hours   = parseInt(input[0]);
        tRes.minutes = parseInt(input[1]);
        tRes.seconds = parseInt(input[2]);
      }
      else if (input.length == 2 && /^[0-9]+:[0-9]+$/i.test(input.join(':'))) {
        tRes.hours   = 0;
        tRes.minutes = parseInt(input[0]);
        tRes.seconds = parseInt(input[1]);
      }
      else if (input.length == 1 && /^[0-9]+$/i.test(input[0])) {
        tRes.hours   = 0;
        tRes.minutes = 0;
        tRes.seconds = parseInt(input[0]);
      }
      else if (input.length == 1 && /^([0-9]+h)?([0-9]+m)?([0-9]+s)?$/gi.test(input[0]) && input[0] != '') {
        input = input[0];
        let temp = /([0-9]+)h/gi.exec(input)
        tRes.hours = !temp ? 0 : parseInt(temp[1]);

        temp = /([0-9]+)m/gi.exec(input)
        tRes.minutes = !temp ? 0 : parseInt(temp[1]);

        temp = /([0-9]+)s/gi.exec(input)
        tRes.seconds = !temp ? 0 : parseInt(temp[1]);
      }
      else {
        return null;
      }

      if (isNaN(tRes.hours)) tRes.hours = 0;
      if (isNaN(tRes.minutes)) tRes.minutes = 0;
      if (isNaN(tRes.seconds)) tRes.seconds = 0;

      return tRes;
    }
  }
}
</script>


<style>


</style>



