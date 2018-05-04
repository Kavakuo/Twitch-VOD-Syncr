<template>
  <div id="app">
    <h1 style="text-align: center;">Twitch VOD Syncr</h1>
    <div style="height:20px"></div>
    <p>
      This tool is really great, if you want to watch a streaming project on Twitch with multiple streamers later as VOD. It calculates the timestamps of multiple VODs so that you can play them synchronized in multiple browser windows. The <strong>Main VOD</strong> is together with the required <strong>Relative timestamp</strong> the reference point in time. All other VODs will be synced to this point in time. 
    </p>

    <Alert id="alert" variant="danger" :msg="this.errorMsg" ref="alert"></Alert>

    <b-form id="form">

      <StreamsInput id="input-1" ref="main"></StreamsInput>

      <TimestampInput id="input-2" ref="time"></TimestampInput>

      <StreamsInput id="input-3" multiple=1 ref="vods"></StreamsInput>

      <div style="display: flex;">
        
        <b-button :variant="state ? 'primary': 'secondary'" @click="submit()" style="flex: 0 1 auto;" :disabled="!state">Sync them!</b-button>

        <div class="spinner" style="margin: auto 20px" v-show="loading">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        
      </div>
      
    </b-form>

    <transition name="fade">
      <div v-if="(finished && !loading)">
        <h3 id="result">Result:</h3>
        <li style="margin-bottom:10px">Target date: {{ target_date_string }}</li>
        <ul style="margin-left:7px; margin-top:5px; font-size:16px">
          <li v-for="vod in vodInfo" :key="vod.id" style="margin-bottom:10px">
            {{ vod.display_name }} ({{ vod.created_at.toLocaleDateString() }}):<br> 
            <div v-if="vod.syncError" style="color: red">
              {{ vod.syncErrorMsg }}
            </div>
            <div v-else>
              <a :href="vod.url">{{vod.url}}</a>
            </div>            
          </li> 
        </ul>  
      </div>
    </transition>

    
    <p style="font-size:13px; text-align:center; margin-top:50px">
      Open source on <a href="https://github.com/Kavakuo/Twitch-VOD-Syncr">GitHub</a><br>
      Powered by <a href="https://vuejs.org/">Vue.js</a>
    </p>
  </div>
</template>

<script>
import TimestampInput from "./TimestampInput.vue";
import StreamsInput from "./StreamsInput.vue";
import Alert from "./Alert.vue";
import jump from 'jump.js'

export default {
  name: 'App',
  
  data: function () {
    return {
      state: false,

      comp_main: null,
      comp_time: null,
      comp_vods: null,
      comp_alert: null,

      target_date: null,
      target_date_string: null,
      vodInfo: null,
      finished:false,
      loading: false,

      errorMsg: '',

      debug:false,
    }
  },

  components: {
    TimestampInput,
    StreamsInput,
    Alert
  },
  
  http: {
    headers: {
      "Client-Id": "g2drwz1dbbtiklml4obhjhd5ldtt18"
    }
  },

  methods: {
    submitDone: function() {
      this.finished = true;
      this.loading = false;
      setTimeout(() => {
        jump('#result', {
          duration: 500,
          offset: -10
        });
      }, 200);
    },

    submit: function() {
      this.finished = false;
      this.loading = true;
      this.vodInfo = ["main"];

      // debug only
      if (process.env.dev_env && this.debug) {
        this.vodInfo = []

        const vodInfoTemp = [{
          "id":"123456789",
          "display_name":"Test123",
          "url":"https://example.org/testLink1"
        }, {
          "id":"123456789",
          "display_name":"NextTestExample",
          "url":"https://example.org/testLink/anotherPath/test"
        }, {
          "id":"123456789",
          "display_name":"ExampleStreamer",
          "url":"https://example.org/testLink1/path123"
        }
        ]

        for (let index = 0; index < 50; index++) {
          const element = vodInfoTemp[index % 3];
          this.vodInfo.push(element);
        }

        setTimeout(() => {
          this.submitDone();
        }, 700);
        return;
      }

      const mainId = this.comp_main.vodIds[0];
      const ids = this.comp_vods.vodIds;
      let userIds = [];
      let main_created = null;
      let target_date = null;
      const timeObj = this.comp_time.parsed;
      let vodIndexMapping = {}

      // get video id info
      const url = "https://api.twitch.tv/helix/videos?id=" + mainId + "&id=" + ids.join("&id=");

      this.$http.get(url).then(response => {

        if (!response.ok) {
          throw response;
        }

        const resp = response.body.data;

        // set target_date
        for (const i of resp) {
          let vodInfoTemp = {
            "user_id": i.user_id,
            "id": i.id,
            "created_at": new Date(i.created_at),
            "duration":null,
            "main_vod":false,
            "offset":null,
            "url":null,
            "display_name":null
          };

          if (userIds.indexOf(i.user_id) == -1) userIds.push(i.user_id);

          // set duration
          const duration = i["duration"];
          const hour_regex = /([0-9]+)h/gi
          const minutes_regex = /([0-9]+)m/gi
          const seconds_regex = /([0-9]+)s/gi
          const hours = hour_regex.exec(duration);
          const minutes = minutes_regex.exec(duration);
          const seconds = seconds_regex.exec(duration);

          vodInfoTemp["duration"] = {
            "hours": hours ? parseInt(hours[1]) : 0,
            "minutes": minutes ? parseInt(minutes[1]) : 0,
            "seconds":seconds ? parseInt(seconds[1]) : 0
          }
          const duration_parsed = vodInfoTemp.duration;
          vodInfoTemp.duration["total"] = duration_parsed.hours * 3600 + duration_parsed.minutes * 60 + duration_parsed.seconds;

          if (i.id == mainId) {
            main_created = new Date(i.created_at);
            target_date = new Date(i.created_at);
            target_date.setHours(target_date.getHours() + timeObj.hours);
            target_date.setMinutes(target_date.getMinutes() + timeObj.minutes);
            target_date.setSeconds(target_date.getSeconds() + timeObj.seconds);
            this.target_date = target_date;
            this.target_date_string = target_date.toLocaleString();
            vodInfoTemp["main_vod"] = true;

            this.vodInfo[0] = vodInfoTemp;  
            vodIndexMapping[i.id] = 0; 
          }
          else {
            this.vodInfo.push(vodInfoTemp);
            vodIndexMapping[i.id] = this.vodInfo.length - 1;
          }          
        }

        for (const i of resp) {
          const elem = this.vodInfo[vodIndexMapping[i.id]]

          // calculate offset
          if (i.id == mainId) {
            elem["url"] = "https://twitch.tv/videos/" + i.id + "?t=" + timeObj.hours + "h" + timeObj.minutes + "m" + timeObj.seconds + "s";
            continue;
          };

          const date = new Date(i.created_at);
          const diff = parseInt((target_date - date) / 1000.0);
          const seconds = diff % 60;
          const minutes = ((diff - seconds) % 3600) / 60.0;
          const hours = (diff - minutes * 60 - seconds) / 3600.0;

          const offset = {
            "seconds":seconds,
            "minutes":minutes,
            "hours":hours,
            "total": hours*3600 + minutes*60 + seconds
          }
          
          elem["offset"] = offset;
          elem["url"] = "https://twitch.tv/videos/" + i.id + "?t=" + offset.hours + "h" + offset.minutes + "m" + offset.seconds + "s";
          const tDate = new Date(elem.created_at);

          if (this.target_date < elem.created_at) {
            elem.syncError = true;
            elem.syncErrorMsg = "Not syncronizable, VOD was recorded after target date.";
          }
          else if (this.target_date > tDate.setSeconds(tDate.getSeconds() + elem.duration.total)) {
            elem.syncError = true;
            elem.syncErrorMsg = "Not syncronizable, VOD is too short.";
          }
        
        }

        const url2 = "https://api.twitch.tv/helix/users?id=" + userIds.join("&id=");
        return this.$http.get(url2);
      }).then((response) => {
        
        // userid request
        if (!response.ok) {
          throw response;
          return;
        }
        // get usernames
        const resp = response.body.data;
        const userMapping = {};

        for (const elem of resp) {
          userMapping[elem.id] = elem.display_name;
        }

        for (const elem of this.vodInfo) {
          elem["display_name"] = userMapping[elem.user_id]
        }

        if (process.env.dev_env){
          console.log(this.vodInfo);
        }

        this.submitDone();

      }).catch(resp => {
        console.log(resp);

        try {
          const body = resp.body;
          if (!body.error || !body.status) throw "No real error!";
          this.errorMsg = body.error + " (statuscode: " + body.status + ").";
          if (body.status == 429) {
            this.errorMsg += " Retry in a few seconds."
          }
          this.comp_alert.showAlert();
        } catch (error) {
          this.errorMsg = "Something went wrong!";
          this.comp_alert.showAlert();
        }
        
        this.loading = false;
        this.finished = false;
      });
    },

    compState: function() {
      console.log("compState()");
      if (!this.comp_main) {
        console.log("not defined");
        this.state = false;
        return;
      }

      this.state = (this.comp_main.state && this.comp_time.state && this.comp_vods.state);
    }
  },

  mounted: function() {
    this.comp_main  = this.$refs.main;
    this.comp_time  = this.$refs.time;
    this.comp_vods  = this.$refs.vods;
    this.comp_alert = this.$refs.alert;
    if (!this.comp_main) console.log("error");

    this.$watch('comp_main.state', this.compState);
    this.$watch('comp_time.state', this.compState);
    this.$watch('comp_vods.state', this.compState);
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}

#form {
  max-width: 600px;
  margin: 30px auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}


/*loading animations*/

.spinner {
  width: 20px;
  height: 20px;

  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}

</style>
