<template>
  <v-container fluid style="height: 100vh; overflow: auto" class="pa-0">
    <v-app-bar
      color="rgb(10, 116, 156)"
      app
      style="-webkit-app-region: drag"
      clipped-right
    >
      <!-- Show window control buttons on the left for macOS -->
      <template v-if="platform == 'MacIntel'">
        <v-btn
          icon
          x-small
          class="windowButton"
          style="background: #fc4e50; margin-left: -9px"
          @click="close"
        >
        </v-btn>
        <v-btn
          icon
          x-small
          class="windowButton"
          style="background: #ffc031; margin-left: 8px"
          @click="minimise"
        >
        </v-btn>
        <v-btn
          icon
          x-small
          class="windowButton"
          style="background: #37d343; margin-left: 8px"
          @click="maximise"
        >
        </v-btn>
        <v-divider vertical inset style="border-color: white" class="mx-2" />
      </template>
      <img
        :src="mxslogo"
        style="height: 32px; filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5))"
      />
      <img :src="mxstext" style="height: 28px; filter: saturate(150%)" class="pl-4" />
      <v-divider vertical inset class="mx-2" style="border-color: white" />
      <span class="text-h5 shimmerText">Shimmer</span>
      <v-spacer />
      <v-toolbar-items style="-webkit-app-region: no-drag">
        <v-btn icon @click="closePanel" title="Close Panel">
          <v-icon>mdi-monitor-dashboard</v-icon>
        </v-btn>
        <!-- Hide window control buttons on macOS -->
        <template v-if="platform != 'MacIntel'">
          <v-divider vertical inset />
          <v-btn icon @click="minimise">
            <v-icon>mdi-window-minimize</v-icon>
          </v-btn>
          <v-btn icon @click="maximise">
            <v-icon>{{
              maximised ? "mdi-window-restore" : "mdi-window-maximize"
            }}</v-icon>
          </v-btn>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <iframe src="https://login.maximumsettings.com/dashboard" name="mxs-disable-x-frame-options" />
  </v-container>
</template>

<script>
import mxslogo from "@/assets/Maximum_Settings_Logo.png";
import mxstext from "@/assets/Maximum_Settings_Text.png";
import mxstextalt from "@/assets/Maximum_Settings_Text_Alt.png";

import electron from "electron";
console.log(electron);

const remote = require("electron").remote;
const window = remote.getCurrentWindow();

export default {
  data() {
    return {
      platform: navigator.platform,

      mxslogo,
      mxstext,
      mxstextalt,

      maximised: false,
      window,
    };
  },

  mounted() {
    this.maximised = this.window.isMaximized();
    setInterval(() => {
      this.maximised = this.window.isMaximized();
    }, 500);
  },

  methods: {
    closePanel() {
      this.$router.push("/");
    },
    close() {
      window.close();
    },
    maximise() {
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
      this.maximised = this.window.isMaximized();
    },
    minimise() {
      window.minimize();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Righteous&display=swap");

.windowButton {
  width: 12.5px !important;
  height: 12.5px !important;
  border-radius: 100% !important;
}

.v-application .shimmerText.text-h5 {
  background: radial-gradient(
    ellipse at top right,
    #fff 0%,
    #fff 25%,
    silver 50%,
    #fff 75%,
    #fff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  background-size: 400% 400%;
  background-position: bottom left;

  animation-duration: 4s;
  animation-name: shimmer;
  animation-iteration-count: infinite;

  font-family: "Righteous" !important;
}

@keyframes shimmer {
  0% {
    background-position: bottom left;
  }
  100% {
    background-position: top right;
  }
}

iframe {
  width: 100%;
  height: calc(100% - 10px);
  border: none;
}
</style>
