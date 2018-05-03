<template>
  <div>
    <!--  -->
    <b-form-group v-if="multiple" :label-for="id" label="VODs to sync" :invalid-feedback="invalidFeedback" :valid-feedback="validFeedback" :state="state">
      <b-form-textarea :id="id" v-model="streams" rows=5 :state="state" placeholder="IDs or URLs, one per line."></b-form-textarea>
    </b-form-group>

    <b-form-group v-else :label-for="id" label="Main VOD" :invalid-feedback="invalidFeedback" :valid-feedback="validFeedback" :state="state">
      <b-form-input :id="id" v-model="streams" placeholder="ID or URL" :state="state"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'StreamsInput',
  props: ["id", "multiple"],
  data: function() {
    return {
      streams: '',
      errorMsg: '',
      vodIds:[]
    }
  },
  computed: {

    state: function() {
      return this.parsed ? true : false; 
    },

    validFeedback: function() {
      return this.state ? "Everything looks good!" : '';
    },

    invalidFeedback: function() {
      if (!this.parsed && this.streams != "") {
        if (this.multiple) return "Invalid format (one VOD per line)! " + this.errorMsg;
        return "Invalid format!";
      }
      else if (!this.parsed && this.streams == "") {
        return 'Required field.'
      }
    },

    parsed: function() {
      const input = this.streams.split("\n");
      const idRegex = /^([0-9]{9})$/i;
      const urlRegex = /^https?:\/\/(?:www\.)?twitch\.tv\/videos\/([0-9]{9})\/?$/i;
      this.vodIds = [];

      for (let index = 0; index < input.length; index++) {
        const element = input[index];
        
        let match = idRegex.exec(element);
        if (!match) match = urlRegex.exec(element);

        if (!match) {
          if (this.multiple) {
            this.errorMsg = "Error in line " + String(index + 1);
          }
          return null;
        }

        const streamid = match[1];
        this.vodIds.push(streamid);
      }

      return 1;
    }
  }
}
</script>



<style>

</style>



