webpackJsonp([1],{0:function(t,e){},"1/oy":function(t,e){},"9M+g":function(t,e){},Id91:function(t,e){},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("7+uW"),n=s("e6fC"),r=s("8+8L"),a=s("BO1k"),o=s.n(a),d={name:"TimestampInput",props:["id"],data:function(){return{time:""}},computed:{state:function(){return!!this.parsed},validFeedback:function(){return this.state?this.parsed.hours+"h "+this.parsed.minutes+"m "+this.parsed.seconds+"s":""},invalidFeedback:function(){return this.parsed||""==this.time?this.parsed||""!=this.time?void 0:"Required field.":"Invalid format!"},parsed:function(){var t=this.time.split(":"),e={hours:0,minutes:0,seconds:0};if(3==t.length&&/^[0-9]+:[0-9]+:[0-9]+$/i.test(t.join(":")))e.hours=parseInt(t[0]),e.minutes=parseInt(t[1]),e.seconds=parseInt(t[2]);else if(2==t.length&&/^[0-9]+:[0-9]+$/i.test(t.join(":")))e.hours=0,e.minutes=parseInt(t[0]),e.seconds=parseInt(t[1]);else if(1==t.length&&/^[0-9]+$/i.test(t[0]))e.hours=0,e.minutes=0,e.seconds=parseInt(t[0]);else{if(1!=t.length||!/^([0-9]+h)?([0-9]+m)?([0-9]+s)?$/gi.test(t[0])||""==t[0])return null;t=t[0];var s=/([0-9]+)h/gi.exec(t);e.hours=s?parseInt(s[1]):0,s=/([0-9]+)m/gi.exec(t),e.minutes=s?parseInt(s[1]):0,s=/([0-9]+)s/gi.exec(t),e.seconds=s?parseInt(s[1]):0}return isNaN(e.hours)&&(e.hours=0),isNaN(e.minutes)&&(e.minutes=0),isNaN(e.seconds)&&(e.seconds=0),e}}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("b-form-group",{attrs:{"label-for":t.id,label:"Relative timestamp of main VOD","invalid-feedback":t.invalidFeedback,"valid-feedback":t.validFeedback,state:t.state}},[s("b-form-input",{attrs:{id:t.id,placeholder:"hh:mm:ss",state:t.state},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}})],1)},staticRenderFns:[]};var u=s("VU/8")(d,l,!1,function(t){s("POjc")},null,null).exports,c={name:"StreamsInput",props:["id","multiple"],data:function(){return{streams:"",errorMsg:"",vodIds:[]}},computed:{state:function(){return!!this.parsed},validFeedback:function(){return this.state?"Everything looks good!":""},invalidFeedback:function(){return this.parsed||""==this.streams?this.parsed||""!=this.streams?void 0:"Required field.":this.multiple?"Invalid format (one VOD per line)! "+this.errorMsg:"Invalid format!"},parsed:function(){var t=this.streams.split("\n"),e=/^([0-9]{9})$/i,s=/^https?:\/\/(?:www\.)?twitch\.tv\/videos\/([0-9]{9})\/?$/i;this.vodIds=[];for(var i=0;i<t.length;i++){var n=t[i],r=e.exec(n);if(r||(r=s.exec(n)),!r)return this.multiple&&(this.errorMsg="Error in line "+String(i+1)),null;var a=r[1];this.vodIds.push(a)}return 1}}},h={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t.multiple?s("b-form-group",{attrs:{"label-for":t.id,label:"VODs to sync","invalid-feedback":t.invalidFeedback,"valid-feedback":t.validFeedback,state:t.state}},[s("b-form-textarea",{attrs:{id:t.id,rows:"5",state:t.state,placeholder:"IDs or URLs, one per line."},model:{value:t.streams,callback:function(e){t.streams=e},expression:"streams"}})],1):s("b-form-group",{attrs:{"label-for":t.id,label:"Main VOD","invalid-feedback":t.invalidFeedback,"valid-feedback":t.validFeedback,state:t.state}},[s("b-form-input",{attrs:{id:t.id,placeholder:"ID or URL",state:t.state},model:{value:t.streams,callback:function(e){t.streams=e},expression:"streams"}})],1)],1)},staticRenderFns:[]};var m=s("VU/8")(c,h,!1,function(t){s("xbRM")},null,null).exports,v=s("q7+D"),p={name:"Alert",props:["msg","variant"],data:function(){return{dismissSecs:8,dismissCountDown:0,showDismissibleAlert:!1}},methods:{countDownChanged:function(t){this.dismissCountDown=t},showAlert:function(){this.dismissCountDown=this.dismissSecs,setTimeout(function(){Object(v.a)("#alert",{duration:500,offset:-10})},200)}}},f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.dismissCountDown>0?s("div",[s("b-alert",{attrs:{show:t.dismissCountDown,dismissible:"",variant:t.variant},on:{dismissed:function(e){t.dismissCountDown=0},"dismiss-count-down":t.countDownChanged}},[s("p",{domProps:{textContent:t._s(t.msg)}}),t._v(" "),s("b-progress",{attrs:{variant:t.variant,max:t.dismissSecs,value:t.dismissCountDown-1,height:"4px"}})],1)],1):t._e()},staticRenderFns:[]},_={name:"App",data:function(){return{state:!1,comp_main:null,comp_time:null,comp_vods:null,comp_alert:null,target_date:null,target_date_string:null,vodInfo:null,finished:!1,loading:!1,errorMsg:"",debug:!1}},components:{TimestampInput:u,StreamsInput:m,Alert:s("VU/8")(p,f,!1,null,null,null).exports},http:{headers:{"Client-Id":"g2drwz1dbbtiklml4obhjhd5ldtt18"}},methods:{submitDone:function(){this.finished=!0,this.loading=!1,setTimeout(function(){Object(v.a)("#result",{duration:500,offset:-10})},200)},submit:function(){var t=this;this.finished=!1,this.loading=!0,this.vodInfo=["main"];var e=this.comp_main.vodIds[0],s=this.comp_vods.vodIds,i=[],n=null,r=this.comp_time.parsed,a={},d="https://api.twitch.tv/helix/videos?id="+e+"&id="+s.join("&id=");this.$http.get(d).then(function(s){if(!s.ok)throw s;var d=s.body.data,l=!0,u=!1,c=void 0;try{for(var h,m=o()(d);!(l=(h=m.next()).done);l=!0){var v=h.value,p={user_id:v.user_id,id:v.id,created_at:new Date(v.created_at),duration:null,main_vod:!1,offset:null,url:null,display_name:null};-1==i.indexOf(v.user_id)&&i.push(v.user_id);var f=v.duration,_=/([0-9]+)h/gi.exec(f),g=/([0-9]+)m/gi.exec(f),b=/([0-9]+)s/gi.exec(f);p.duration={hours:_?parseInt(_[1]):0,minutes:g?parseInt(g[1]):0,seconds:b?parseInt(b[1]):0};var w=p.duration;p.duration.total=3600*w.hours+60*w.minutes+w.seconds,v.id==e?(new Date(v.created_at),(n=new Date(v.created_at)).setHours(n.getHours()+r.hours),n.setMinutes(n.getMinutes()+r.minutes),n.setSeconds(n.getSeconds()+r.seconds),t.target_date=n,t.target_date_string=n.toLocaleString(),p.main_vod=!0,t.vodInfo[0]=p,a[v.id]=0):(t.vodInfo.push(p),a[v.id]=t.vodInfo.length-1)}}catch(t){u=!0,c=t}finally{try{!l&&m.return&&m.return()}finally{if(u)throw c}}var y=!0,x=!1,I=void 0;try{for(var S,D=o()(d);!(y=(S=D.next()).done);y=!0){var k=S.value,$=t.vodInfo[a[k.id]];if(k.id!=e){var M=new Date(k.created_at),O=parseInt((n-M)/1e3),V={seconds:b=O%60,minutes:g=(O-b)%3600/60,hours:_=(O-60*g-b)/3600,total:3600*_+60*g+b};$.offset=V,$.url="https://twitch.tv/videos/"+k.id+"?t="+V.hours+"h"+V.minutes+"m"+V.seconds+"s";var C=new Date($.created_at);t.target_date<$.created_at?($.syncError=!0,$.syncErrorMsg="Not syncronizable, VOD was recorded after target date."):t.target_date>C.setSeconds(C.getSeconds()+$.duration.total)&&($.syncError=!0,$.syncErrorMsg="Not syncronizable, VOD is too short.")}else $.url="https://twitch.tv/videos/"+k.id+"?t="+r.hours+"h"+r.minutes+"m"+r.seconds+"s"}}catch(t){x=!0,I=t}finally{try{!y&&D.return&&D.return()}finally{if(x)throw I}}var j="https://api.twitch.tv/helix/users?id="+i.join("&id=");return t.$http.get(j)}).then(function(e){if(!e.ok)throw e;var s=e.body.data,i={},n=!0,r=!1,a=void 0;try{for(var d,l=o()(s);!(n=(d=l.next()).done);n=!0){var u=d.value;i[u.id]=u.display_name}}catch(t){r=!0,a=t}finally{try{!n&&l.return&&l.return()}finally{if(r)throw a}}var c=!0,h=!1,m=void 0;try{for(var v,p=o()(t.vodInfo);!(c=(v=p.next()).done);c=!0){var f=v.value;f.display_name=i[f.user_id]}}catch(t){h=!0,m=t}finally{try{!c&&p.return&&p.return()}finally{if(h)throw m}}t.submitDone()}).catch(function(e){console.log(e);try{var s=e.body;if(!s.error||!s.status)throw"No real error!";t.errorMsg=s.error+" (statuscode: "+s.status+").",429==s.status&&(t.errorMsg+=" Retry in a few seconds."),t.comp_alert.showAlert()}catch(e){t.errorMsg="Something went wrong!",t.comp_alert.showAlert()}t.loading=!1,t.finished=!1})},compState:function(){if(console.log("compState()"),!this.comp_main)return console.log("not defined"),void(this.state=!1);this.state=this.comp_main.state&&this.comp_time.state&&this.comp_vods.state}},mounted:function(){this.comp_main=this.$refs.main,this.comp_time=this.$refs.time,this.comp_vods=this.$refs.vods,this.comp_alert=this.$refs.alert,this.comp_main||console.log("error"),this.$watch("comp_main.state",this.compState),this.$watch("comp_time.state",this.compState),this.$watch("comp_vods.state",this.compState)}},g={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("h1",{staticStyle:{"text-align":"center"}},[t._v("Twitch VOD Syncr")]),t._v(" "),s("div",{staticStyle:{height:"20px"}}),t._v(" "),t._m(0),t._v(" "),s("Alert",{ref:"alert",attrs:{id:"alert",variant:"danger",msg:this.errorMsg}}),t._v(" "),s("b-form",{attrs:{id:"form"}},[s("StreamsInput",{ref:"main",attrs:{id:"input-1"}}),t._v(" "),s("TimestampInput",{ref:"time",attrs:{id:"input-2"}}),t._v(" "),s("StreamsInput",{ref:"vods",attrs:{id:"input-3",multiple:"1"}}),t._v(" "),s("div",{staticStyle:{display:"flex"}},[s("b-button",{staticStyle:{flex:"0 1 auto"},attrs:{variant:t.state?"primary":"secondary",disabled:!t.state},on:{click:function(e){t.submit()}}},[t._v("Sync them!")]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"spinner",staticStyle:{margin:"auto 20px"}},[s("div",{staticClass:"double-bounce1"}),t._v(" "),s("div",{staticClass:"double-bounce2"})])],1)],1),t._v(" "),s("transition",{attrs:{name:"fade"}},[t.finished&&!t.loading?s("div",[s("h3",{attrs:{id:"result"}},[t._v("Result:")]),t._v(" "),s("li",{staticStyle:{"margin-bottom":"10px"}},[t._v("Target date: "+t._s(t.target_date_string))]),t._v(" "),s("ul",{staticStyle:{"margin-left":"7px","margin-top":"5px","font-size":"16px"}},t._l(t.vodInfo,function(e){return s("li",{key:e.id,staticStyle:{"margin-bottom":"10px"}},[t._v("\n          "+t._s(e.display_name)+" ("+t._s(e.created_at.toLocaleDateString())+"):"),s("br"),t._v(" "),e.syncError?s("div",{staticStyle:{color:"red"}},[t._v("\n            "+t._s(e.syncErrorMsg)+"\n          ")]):s("div",[s("a",{attrs:{href:e.url}},[t._v(t._s(e.url))])])])}))]):t._e()]),t._v(" "),t._m(1)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("\n    This tool is really great, if you want to watch a streaming project on Twitch with multiple streamers later as VOD. It calculates the timestamps of multiple VODs so that you can play them synchronized in multiple browser windows. The "),e("strong",[this._v("Main VOD")]),this._v(" is together with the required "),e("strong",[this._v("Relative timestamp")]),this._v(" the reference point in time. All other VODs will be synced to this point in time. \n  ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",{staticStyle:{"font-size":"13px","text-align":"center","margin-top":"50px"}},[this._v("\n    Open source on "),e("a",{attrs:{href:"https://github.com/Kavakuo/Twitch-VOD-Syncr"}},[this._v("GitHub")]),e("br"),this._v("\n    Powered by "),e("a",{attrs:{href:"https://vuejs.org/"}},[this._v("Vue.js")])])}]};var b=s("VU/8")(_,g,!1,function(t){s("uZsS")},null,null).exports;s("qb6w"),s("9M+g");i.a.use(n.a),i.a.use(r.a);new i.a({el:"#app",render:function(t){return t(b)}})},POjc:function(t,e){},qb6w:function(t,e){},uZsS:function(t,e){},xbRM:function(t,e){},zj2Q:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.f96a184921006fae140d.js.map