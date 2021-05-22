<template>
  <v-dialog
    v-model="settings"
    max-width="75%"
    scrollable
    height="85%"
    persistent
  >
    <v-card>
      <v-toolbar color="secondary">
        <v-toolbar-title> Settings </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="
              settings = false;
              $emit('closed');
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="py-0">
            <v-subheader class="pa-0">UI Configuration</v-subheader>
            <v-divider />
          </v-col>
          <v-col cols="6">
            <v-select
              outlined
              hide-details
              v-model="config.columns"
              label="Grid Columns"
              :items="[1, 2, 3, 4, 6, 12]"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              outlined
              hide-details
              v-model="config.infoWidth"
              label="Info Bar Width"
              type="number"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              outlined
              hide-details
              v-model="config.theme"
              label="Theme"
              :items="themes"
              return-object
              item-key="name"
              item-text="name"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              outlined
              hide-details
              v-model="config.playniteMode"
              label="Preferred Playnite Mode"
              :items="[
                { value: 'fullscreen', text: 'Fullscreen' },
                { value: 'desktop', text: 'Desktop' },
              ]"
            ></v-select>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-subheader class="pa-0">Primary Configuration</v-subheader>
            <v-divider />
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.ip"
                  label="Machine IP"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.authorization"
                  label="Authorisation Key (Obtained When Downloading Shimmer Server)"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.appName"
                  label="Desktop App Name"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.moonlightExe"
                  label="Moonlight Executable Location"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-subheader class="pa-0">Display Options</v-subheader>
                <v-divider />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-subheader class="pa-0">Audio Options</v-subheader>
                <v-divider />
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="3" class="pt-0">
                    <v-text-field
                      type="number"
                      label="Width"
                      outlined
                      hide-details
                      v-model="resolutionX"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="pt-0">
                    <v-text-field
                      type="number"
                      label="Height"
                      outlined
                      hide-details
                      v-model="resolutionY"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="pt-0">
                    <v-text-field
                      type="number"
                      label="FPS"
                      outlined
                      hide-details
                      v-model="config.moonlight.fps"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="pt-0">
                    <v-select
                      hide-details
                      outlined
                      label="Display Mode"
                      :items="[
                        { value: 'fullscreen', text: 'Fullscreen' },
                        { value: 'borderless', text: 'Borderless' },
                        { value: 'windowed', text: 'Windowed' },
                      ]"
                      v-model="config.moonlight['display-mode']"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="">
                    <v-select
                      outlined
                      hide-details
                      label="Video Codec"
                      v-model="config.moonlight['video-codec']"
                      :items="[
                        { value: 'auto', text: 'Auto' },
                        { value: 'H.264', text: 'H264' },
                        { value: 'HEVC', text: 'H265 (HEVC)' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="">
                    <v-select
                      outlined
                      hide-details
                      label="Video Decoder"
                      v-model="config.moonlight['video-decoder']"
                      :items="[
                        { value: 'auto', text: 'Auto' },
                        {
                          value: 'software',
                          text: 'Software (Not Recommended)',
                        },
                        { value: 'hardware', text: 'Hardware' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="">
                    <v-select
                      label="V-Sync"
                      outlined
                      hide-details
                      v-model="config.moonlight['vsync']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="">
                    <v-select
                      label="Frame Pacing"
                      outlined
                      hide-details
                      v-model="config.moonlight['frame-pacing']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="8">
                    <v-slider
                      class="pt-3"
                      hide-details
                      v-model="bitrate"
                      label="Bitrate (Mbps)"
                      min="5"
                      max="100"
                      thumb-label
                    ></v-slider>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      hide-details
                      outlined
                      type="number"
                      v-model="bitrate"
                      min="5"
                      max="100"
                      label="Bitrate (Mbps)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="8" class="pt-0">
                    <v-select
                      outlined
                      hide-details
                      label="Audio Configuration"
                      v-model="config.moonlight['audio-config']"
                      :items="[
                        { value: 'stereo', text: 'Stereo' },
                        { value: '5.1-surround', text: '5.1 Surround Sound' },
                        { value: '7.1-surround', text: '7.1 Surround Sound' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="4" class="pt-0">
                    <v-select
                      outlined
                      hide-details
                      label="Host Audio"
                      v-model="config.moonlight['audio-on-host']"
                      :items="[
                        { value: false, text: 'Do Not Play Audio' },
                        { value: true, text: 'Play Audio On Host' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      outlined
                      hide-details
                      label="Forward Mic"
                      v-model="config.chosenMic"
                      :items="mics"
                      item-value="id"
                      item-text="name"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-subheader class="pa-0">Miscellanous Flags</v-subheader>
                <v-divider />
              </v-col>
              <v-col cols="12">
                <v-row wrap>
                  <v-col cols="12">
                    <v-select
                      label="Capture System Keys"
                      outlined
                      hide-details
                      v-model="config.moonlight['capture-system-keys']"
                      :items="[
                        { value: 'always', text: 'Always' },
                        { value: 'fullscreen', text: 'Only in Fullscreen' },
                        { value: 'never', text: 'Never' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="py-0">
                    <v-select
                      label="Absolute Mouse"
                      outlined
                      hide-details
                      v-model="config.moonlight['absolute-mouse']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="py-0">
                    <v-select
                      label="Touchscreen Trackpad"
                      outlined
                      hide-details
                      v-model="config.moonlight['touchscreen-trackpad']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="py-0">
                    <v-select
                      label="Multi Controller"
                      outlined
                      hide-details
                      v-model="config.moonlight['multi-controller']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" class="py-0">
                    <v-select
                      label="Quit on Exit"
                      outlined
                      hide-details
                      v-model="config.moonlight['quit-after']"
                      :items="[
                        { value: false, text: 'Disabled' },
                        { value: true, text: 'Enabled' },
                      ]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-subheader class="pa-0"
              >Maximum Settings Configuration</v-subheader
            >
            <v-divider />
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.mxs.username"
                  label="Username"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.mxs.password"
                  label="Password"
                  :type="passwordView ? 'text' : 'password'"
                  :append-icon="passwordView ? 'mdi-eye' : 'mdi-eye-off'"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <v-text-field
                  outlined
                  hide-details
                  v-model="config.mxs.vid"
                  label="VM ID"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col> -->
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import naudiodon from "naudiodon";

export default {
  props: ["value"],

  data() {
    return {
      passwordView: false,

      settings: false,
      config: {
        appName: "Desktop",
        ip: "",
        moonlightExe: "",
        moonlight: {
          resolution: "1920x1080",
          "video-codec": "auto",
          "video-decoder": "auto",
          "display-mode": "fullscreen",
          "audio-config": "stereo",
          "capture-system-keys": "fullscreen",
          fps: "60",
          bitrate: 25000,
          vsync: false,
          "quit-after": true,
          "multi-controller": false,
          "absolute-mouse": false,
          "touchscreen-trackpad": false,
          "audio-on-host": false,
          "frame-pacing": false,
        },
        onlyInstalled: false,
        platforms: ["Steam"],

        columns: 4,

        theme: {
          name: "Maximum Settings",
          headerColour: "#008BD2",
          primaryColour: "#008BD2",
          footerColour: "#008BD2",
        },

        mxs: {
          username: "",
          password: "",
          vid: "",
        },

        chosenMic: -1,
      },

      themes: [
        {
          name: "Purple",
          headerColour: "purple",
          footerColour: "dark",
        },
        {
          name: "Pink",
          headerColour: "pink",
          footerColour: "dark",
        },
        {
          name: "Red",
          headerColour: "red",
          footerColour: "dark",
        },
        {
          name: "Orange",
          headerColour: "orange",
          footerColour: "dark",
        },
        {
          name: "Yellow",
          headerColour: "yellow",
          footerColour: "dark",
        },
        {
          name: "Green",
          headerColour: "green",
          footerColour: "dark",
        },
        {
          name: "Blue",
          headerColour: "primary",
          footerColour: "dark",
        },
        {
          name: "Indigo",
          headerColour: "indigo",
          footerColour: "dark",
        },
        {
          name: "Maximum Settings",
          headerColour: "#008BD2",
          primaryColour: "#008BD2",
          footerColour: "#008BD2",
        },
        {
          name: "Maximum Settings Alt",
          headerColour: "grey lighten-2",
          primaryColour: "#008BD2",
          footerColour: "#008BD2",
        },
        // {
        //   name: "FirePowerCloud",
        //   headerColour: "#009B72",
        //   footerColour: "#009B72",
        // },
      ],

      mics: [{ id: -1, name: "None" }],
    };
  },

  mounted() {
    this.config = this.value;

    let devices = naudiodon.getDevices().filter((item) => {
      return item.maxInputChannels > 0 && item.hostAPIName == "Windows WASAPI";
    });
    console.log(devices);

    this.mics = [{ id: -1, name: "None" }, ...devices];
  },

  methods: {
    showSettings() {
      this.settings = true;
    },
  },

  computed: {
    bitrate: {
      get() {
        return this.config.moonlight.bitrate / 1000;
      },
      set(value) {
        this.changeBitrate(value);
      },
    },
    resolutionX: {
      get() {
        return this.config.moonlight.resolution.split("x")[0];
      },
      set(value) {
        this.config.moonlight.resolution =
          value + "x" + this.config.moonlight.resolution.split("x")[1];
      },
    },
    resolutionY: {
      get() {
        return this.config.moonlight.resolution.split("x")[1];
      },
      set(value) {
        this.config.moonlight.resolution =
          this.config.moonlight.resolution.split("x")[0] + "x" + value;
      },
    },
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        if(!value.mxs)
        {
          value.mxs = {username: "", password: "", vid: ""};
        }
        this.config = value;
      },
    },
  },
};
</script>