<template>
  <v-container fluid style="height: calc(100vh - (64px + 36px)); overflow: auto">
    <v-app-bar
      :color="config.theme.headerColour"
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
      <template v-if="config.theme.name == 'FirePowerCloud'">
        <img :src="firepowerlogo" style="height: 32px" />
        <img :src="firepowertext" style="height: 16px" class="pl-2" />
        <v-divider vertical inset class="mx-2" style="border-color: white" />
        <span class="text-h5 shimmerText">Shimmer</span>
      </template>
      <template v-else-if="config.theme.name == 'Maximum Settings'">
        <img
          :src="mxslogo"
          style="height: 32px; filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5))"
        />
        <img :src="mxstext" style="height: 28px; filter: saturate(150%)" class="pl-4" />
        <v-divider vertical inset class="mx-2" style="border-color: white" />
        <span class="text-h5 shimmerText">Shimmer</span>
      </template>
      <template v-else-if="config.theme.name == 'Maximum Settings Alt'">
        <img :src="mxslogo" style="height: 32px" />
        <img :src="mxstextalt" style="height: 28px" class="pl-4" />
        <v-divider vertical inset class="mx-2" style="border-color: #444" />
        <span class="text-h5 shimmerText">Shimmer</span>
      </template>
      <template v-else>
        <strong class="text-h5 font-weight-bold shimmerText">Shimmer</strong>
        <v-divider vertical inset class="mx-2" style="border-color: white" />
        <span class="text-h5"> Moonlight Interface </span>
      </template>
      <v-spacer />
      <v-toolbar-items style="-webkit-app-region: no-drag">
        <v-divider vertical inset />
        <v-btn icon @click="launchDesktop" title="Launch Desktop">
          <v-icon> mdi-monitor </v-icon>
        </v-btn>
        <v-btn icon @click="launchPlaynite" title="Launch Playnite">
          <v-icon> mdi-gamepad-variant </v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-menu bottom :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="Search">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-text-field
                type="search"
                placeholder="Search"
                prepend-icon="mdi-magnify"
                v-model="search"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-menu bottom :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="Filter">
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <span class="title"> Platform Filters </span>
              <v-list>
                <v-list-item v-for="innerFilter in filters" :key="innerFilter">
                  <v-list-item-content>
                    {{ innerFilter }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox v-model="filter" :value="innerFilter"></v-checkbox>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-divider vertical inset />
        <v-btn icon @click="toggleMic" title="Toggle Mic Forwarding">
          <v-badge color="red" dot :value="micEnabled">
            <v-icon>mdi-microphone</v-icon>
          </v-badge>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="refresh" title="Refresh Games List">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <!-- <v-btn icon @click="config.darkMode = !config.darkMode" title="Dark Mode Toggle">
          <v-icon>{{config.darkMode ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'}}</v-icon>
        </v-btn> -->
        <v-btn icon @click="$refs.settings.showSettings()" title="Settings">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn
          icon
          @click="config.showInfo = !config.showInfo"
          title="Toggle Information"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-divider vertical inset/>
        <v-menu bottom :close-on-content-click="true" v-if="mxs">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="Power Options" :class="powerStatus">
              <v-icon>mdi-power</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <span class="title">
                Power Options
              </span>
            </v-list-item>
            <v-list-item @click="powerOn">
              <v-list-item-icon>
                <v-icon>mdi-power</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Start
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="powerRestart">
              <v-list-item-icon>
                <v-icon>mdi-restart</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Restart
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="powerOff">
              <v-list-item-icon>
                <v-icon>mdi-power-off</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Shutdown
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="powerKill">
              <v-list-item-icon>
                <v-icon>mdi-skull</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Force Shutdown
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          icon
          @click="openPanel"
          title="Open Panel"
          v-if="mxs"
        >
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
    <v-navigation-drawer
      app
      clipped
      :color="config.darkMode ? 'grey darken-4' : ''"
      right
      :value="config.showInfo && selected != -1 && currentGame.Name && currentGame.Description"
      :width="config.infoWidth || 300"
    >
      <v-layout column>
        <v-col>
          <span class="display-2">{{ currentGame.Name }}</span>
        </v-col>
        <v-col v-html="currentGame.Description" class="description"> </v-col>
      </v-layout>
    </v-navigation-drawer>
    <v-container v-if="error">
      <v-row align="center" justify="center" class="fill-height">
        <v-card>
          <v-toolbar color="secondary">
            <v-toolbar-title> Data Server Communication Failure </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text v-if="config.ip" class="title pt-4 text-center">
            There was an issue connecting to the remote data server. Please ensure you have
            set the correct IP address in the settings, and have installed the latest
            version of the data server on your NVIDIA GameStream host (<em>NOT</em> this
            machine).<br />
            Also ensure that you have set the correct communication password. This can be
            found inside the ".env" file next to your ShimmerServer.exe file.
            <template v-if="config.mxs.username">
              <br/><br/>
              Since you have entered your Maximum Settings credentials, you can attempt to start your machine from within Shimmer.
              Please press the power button in the top right and we will automatically try to reconnect.
            </template>
          </v-card-text>
          <v-card-text v-else class="title pt-4 text-center">
            It appears this is either your first run of the program, or you have removed the
            IP address from the settings menu. Close this dialogue to open the settings menu
            to configure the application.
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn :color="config.theme.primaryColour || config.theme.headerColour" @click="$refs.settings.showSettings()">
              Open Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
    <v-row align="center" justify="center" class="fill-height" v-resize="handleResize" v-else>
      <v-col cols="8" v-if="filteredGames.length == 0">
        <v-card color="error">
          <v-card-text class="text-center title">
            No games could be found, please check your filters and search criteria, and
            ensure you have configured your host IP!
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        :cols="Math.floor(12 / config.columns)"
        v-for="(game, i) in filteredGames"
        :key="game.provider + game.Id"
      >
        <game-card
          :ref="'game-' + i"
          :selected="selected == i"
          :game="game"
          @launchGame="launchGame(game)"
          @info="
            config.showInfo = true;
            setSelected(i);
          "
          :primaryColour="config.theme.primaryColour || config.theme.headerColour"
          :transparent="transparent"
          :minHeight="minHeight"
          :providerToIcon="providerToIcon"
        ></game-card>
      </v-col>
    </v-row>
    <settings :value="config" ref="settings" @closed="load"></settings>
    <!-- <v-dialog v-model="error" max-width="50%" persistent>
    </v-dialog> -->
    <v-dialog v-model="micError" max-width="50%" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title> Microphone Error </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon @click="micError = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="title pt-4 text-center">
          There was an issue forwarding your microphone. Mic forwarding has now been
          disabled.<br />
          Please check your network connection, firewall settings, port forwarding and
          client settings and try again.<br />
          {{ micError }}
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="spawnError" max-width="50%" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title> Moonlight Error </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              @click="
                spawnError = false;
                $refs.settings.showSettings();
              "
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="title pt-4 text-center">
          There was an issue creating the Moonlight instance. Please ensure all of your
          settings are correct, that you have set the correct Moonlight executable
          location, and that Moonlight is installed on this computer.<br />
          If you are unable to figure out the issue, please create an issue on our GitHub
          page, and cite the following error:<br />
          <pre
            style="
              max-height: 4em;
              width: 100%;
              background: black;
              border: 1px solid grey;
              padding: 5px;
              overflow: auto;
              border-radius: 4px;
            "
            >{{ spawnErrorData }}</pre
          >
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm" persistent width="60%">
      <v-card>
        <v-card-title>
          Please Confirm
        </v-card-title>
        <v-card-text>
          {{confirmText}}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="confirmResolve(true); confirm = false">Confirm</v-btn>
          <v-btn color="secondary" @click="confirmResolve(false); confirm = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading" opacity="0.9" class="text-center">
      <span class="display-1">Loading Games</span><br />
      <span class="title"
        >This can take a while, especially on first run! Please give this a good 5/10
        minutes to run on the first startup whilst the game server caches your game
        lists.</span
      ><br />
      <v-progress-circular
        indeterminate
        color="primary"
        size="128"
        width="12"
      ></v-progress-circular>
    </v-overlay>
    <v-footer app :color="config.theme.footerColour" style="v-index: 1000">
      <template v-if="status.status == 'running'">
        <span>IP: {{status.ip}}</span><v-divider vertical class="mx-2" style="border-color: white;"/>
        <span>CPU: {{status.cpu}}</span><v-divider vertical class="mx-2" style="border-color: white;"/>
        <span>RAM: {{status.memory_usage}}</span><v-divider vertical class="mx-2" style="border-color: white;"/>
        <span>Auto-Shutdown In {{status.remaining_time}}
          <v-menu>
            <template v-slot:activator="{on}">
              <v-btn rounded color="white" outlined v-on="on">Snooze</v-btn>
            </template>
            <v-list>
              <v-list-item>
                <span class="title">
                  Snooze Options
                </span>
              </v-list-item>
              <v-list-item @click='snooze(10)'>
                <v-list-item-content>
                  10 Minutes
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click='snooze(30)'>
                <v-list-item-content>
                  30 Minutes
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click='snooze(60)'>
                <v-list-item-content>
                  60 Minutes
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </template>
      <v-spacer />
      <template v-if="games.length == filteredGames.length">
        Showing {{ games.length }} Games From {{ filter.length }} Platform{{
          filter.length != 1 ? "s" : ""
        }}
      </template>
      <template v-else>
        Showing {{ filteredGames.length }} / {{ games.length }} Games From
        {{ platforms.length }} Platform{{ platforms.length != 1 ? "s" : "" }} (Filtered)
      </template>
    </v-footer>
  </v-container>
</template>

<script>
import { debounce, throttle } from "lodash";
import axios from "axios";
import {v4 as uuid} from 'uuid';

import firepowerlogo from "@/assets/FirePowerLogoWhite.svg";
import firepowertext from "@/assets/FirePowerTextWhite.svg";
import mxslogo from "@/assets/Maximum_Settings_Logo.png";
import mxstext from "@/assets/Maximum_Settings_Text.png";
import mxstextalt from "@/assets/Maximum_Settings_Text_Alt.png";

import qs from 'qs';

import GameCard from "@/components/GameCard";
import Settings from "@/components/Settings";

import Gamepads from "gamepads";

const StandardMapping = Gamepads.StandardMapping;

const util = require("util");
const naudiodon = require("naudiodon");

const exec = util.promisify(require("child_process").exec);

const remote = require("electron").remote;
const { ipcRenderer } = require("electron");
const window = remote.getCurrentWindow();

const storage = require("electron-json-storage");

export default {
  name: "Home",
  components: {
    GameCard,
    Settings,
  },

  data: function () {
    return {
      window,

      platform: navigator.platform,

      maximised: false,

      firepowerlogo,
      firepowertext,

      mxslogo,
      mxstext,
      mxstextalt,

      loading: false,

      error: false,

      micError: false,

      spawnError: false,
      spawnErrorData: "",

      footerHover: false,

      minHeight: 50,

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

        infoWidth: 350,

        playniteMode: "desktop",
      },

      selected: -1,
      currentGame: {},
      controllerConnected: false,

      micEnabled: false,
      micInput: null,
      micStream: null,
      micChunker: null,
      micSocket: null,

      frameCounter: 0,

      settings: false,

      filter: [],
      filters: [],

      games: [],
      filteredGames: [],

      search: "",

      status: {},

      confirm: false,
      confirmText: "",
      confirmResolve: () => {},

      changeSelected: throttle(function (value) {
        console.log("Changing selected by " + value);
        this.selected = Math.min(
          Math.max(0, this.selected + value),
          this.games.length - 1
        );
      }, 100),

      setSelected: function (value) {
        this.selected = value;
      },

      setConfig: debounce(async function (value) {
        console.log("Setting value");
        if (!value || !value.theme || !value.theme.name) {
          value = { theme: { name: "NA" } };
        }
        if(!value.darkMode)
        {
          value.darkMode = true;
        }
        this.$vuetify.theme.dark = value.darkMode;
        console.log(
          "Changing class to " + value.theme.name.toLowerCase().replace(/ /g, "")
        );
        document.body.className = value.theme.name.toLowerCase().replace(/ /g, "");
        console.log("Setting config.");
        ipcRenderer.send("saveConfig", value);

        axios.defaults.headers.common["Authorization"] = value.authorization;

        this.handleResize();

        this.statusInterval = setInterval(() => {
          ipcRenderer.send('getStatus');
        }, 1000);
      }, 1500),

      changeBitrate: debounce(function (value) {
        this.config.moonlight.bitrate = value * 1000;
      }, 1000),

      changeSearch: debounce(function (search) {
        this.handleFilterChange();
      }, 1000),

      handleFilterChange: debounce(function () {
        let search = this.search;
        let filter = this.filter;
        if (!search) {
          this.filteredGames = [...this.games].filter((item) => {
            return filter.includes(item.provider);
          });
          this.filteredGames.sort((a, b) => {
            let aName = a.search;
            let bName = b.search;

            if (aName < bName) {
              return -1;
            }
            if (bName < aName) {
              return 1;
            }
            return 0;
          });
        } else {
          let searchQuery = search.toLowerCase().replace(/\W/g, "");
          let regex = new RegExp(searchQuery, "g");
          this.filteredGames = [...this.games].filter((value) => {
            if (!filter.includes(value.provider)) {
              return false;
            }
            let result = regex.test(value.search);
            return result;
          });
          this.filteredGames.sort((a, b) => {
            let aName = a.search;
            let bName = b.search;

            if (aName < bName) {
              return -1;
            }
            if (bName < aName) {
              return 1;
            }
            return 0;
          });
        }
        this.$forceUpdate();
      }, 1000),

      transparent:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAADXCAMAAACgY5FYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAAAAAKVnuc8AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAeFJREFUeF7t0QENAAAMw6DPv+n7IMUCtzDKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZjO0BklSCZJZXPFQAAAAASUVORK5CYII=",
    };
  },

  computed: {
    platforms() {
      let platforms = [];
      this.games.forEach((item) => {
        if (!platforms.includes(item.provider)) {
          platforms.push(item.provider);
        }
      });

      return platforms;
    },

    powerStatus() {
      let status = this.status;

      switch(status.status)
      {
        case "stopped":
          return "red";
        case "running":
          return "green";
        default:
          return "red";
      }
    },
    
    mxs() {
      return this.config.mxs && this.config.mxs.username && this.config.mxs.password;
    }
  },

  async mounted() {
    console.log(storage.getDefaultDataPath());
    ipcRenderer.on("micError", (event, data) => {
      this.micError = data;
    });

    Gamepads.start();
    Gamepads.addEventListener("connect", (e) => {
      this.handleConnect(e);
    });

    Gamepads.addEventListener("disconnect", (e) => {
      this.handleDisconnect(e);
    });
    let config = storage.getSync("config");
    console.log(config);
    if (config && config.moonlight.resolution) {
      this.config = config;
      document.body.className = config.theme.name.toLowerCase().replace(/ /g, "");

      console.log(this.config);

      axios.defaults.headers.common["Authorization"] = this.config.authorization;
    }
    if (this.config.moonlightExe == "") {
      switch (navigator.platform) {
        case "Win32":
          this.config.moonlightExe =
            "C:\\Program Files\\Moonlight Game Streaming\\Moonlight.exe";
          break;
        case "MacIntel":
          this.config.moonlightExe =
            "/Applications/Moonlight.app/Contents/MacOS/Moonlight";
          break;
        default:
          try {
            const { stdout } = await exec("which moonlight");
            if (stdout) {
              this.config.moonlightExe = stdout;
            } else {
              throw new Exception("Executable not found!");
            }
          } catch (ex) {
            console.log(ex);
          }
          break;
      }
    }
    this.load();
    setInterval(() => {
      this.maximised = this.window.isMaximized();
    }, 500);
    setInterval(() => {
      this.handleResize();
    }, 5000);
    

    this.statusInterval = setInterval(() => {
      ipcRenderer.send('getStatus');
    }, 1000);
    ipcRenderer.send('getStatus');
    ipcRenderer.on('sendStatus', (event, data) => {
      this.status = data;
      console.log(data);
    });

    ipcRenderer.on('notLoggedIn', (event, data) => {
      clearInterval(this.statusInterval);
      if(this.mxs)
      {
        this.$notify({group: 'global', type: 'error', title: 'Not Logged In', text: 'You are not logged in to Maxmimum Settings. Please ensure you have entered your username and password correctly in the settings.'});
      }
    });
  },

  methods: {
    $confirm(text) {
      return new Promise((resolve, reject) => {
        this.confirmResolve = resolve;
        this.confirmText = text;
        this.confirm = true;
      });
    },
    openPanel() {
      this.$router.push('/panel');
    },
    close() {
      ipcRenderer.send("close");
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
    providerToIcon(provider) {
      switch (provider) {
        case "Steam":
          return "mdi-steam";
        case "Origin":
          return "mdi-origin";
        case "Ubisoft Connect":
        case "Uplay":
          return "mdi-ubisoft";
        case "GOG":
          return "mdi-gog";
        case "Xbox":
          return "mdi-xbox";
        case "Nintendo Game Boy":
        case "Nintendo Game Boy Color":
        case "Nintendo Game Boy Advance":
          return "mdi-nintendo-gameboy";
        case "Nintendo Wii U":
          return "mdi-nintendo-wiiu";
        case "Nintendo Wii":
          return "mdi-nintendo-wii";
        case "Nintendo Switch":
          return "mdi-nintendo-switch";
        case "Nintendo Entertainment System":
        case "Super Nintendo Entertainment System":
          return "mdi-gamepad-square";
        case "Sony PlayStation":
        case "Sony PlayStation 2":
        case "Sony PlayStation 3":
        case "Sony PlayStation 4":
        case "Sony PSP":
          return "mdi-sony-playstation";
        case "Nintendo GameCube":
          return "mdi-google-controller";
        default:
          return "mdi-monitor";
      }
    },
    handleResize() {
      let element = document.querySelector(".game");
      if (!element) {
        console.log("Checked game did not exist.");
        return;
      }
      let imageElement = document.querySelector(".game > .v-image");
      if (!imageElement || imageElement.clientHeight == 0) {
        console.log("Checked game image not yet loaded.");
        return;
      }
      let height = element.clientHeight;
      this.minHeight = height;
    },
    async load(keepLoading) {
      axios.defaults.timeout = 2500;
      axios.defaults.headers.common["Authorization"] = this.config.authorization;
      if(!this.loading)
      {
        this.loading = true;
      }
      try {
        let authenticate = await axios.get(`http://${this.config.ip}:2606/authenticate`, {timeout: 2500});
        let response = await axios.get(`http://${this.config.ip}:2606/games`, {timeout: 30000});
        if (response.status != 200) {
          this.error = true;
          this.loading = false;
          return;
        }
        this.games = response.data;
        this.games = this.games.map((game) => {
          return {
            ...game,
            search: game.Name.toLowerCase().replace(/\W/g, ""),
            poster: game.poster.replace(
              "${backend}",
              "http://" + this.config.ip + ":2606"
            ),
          };
        });
        this.filters = [];
        for (let game of this.games) {
          if (!this.filters.includes(game.provider)) {
            this.filters.push(game.provider);
          }
        }
        this.filters.sort();
        if (this.filter.length == 0) {
          this.filter = this.filters;
        }
        this.filteredGames = [...this.games];
        this.filteredGames.sort((a, b) => {
          let aName = a.search;
          let bName = b.search;

          if (aName < bName) {
            return -1;
          }
          if (bName < aName) {
            return 1;
          }
          return 0;
        });
        this.error = false;
        this.loading = false;
      } catch (ex) {
        this.error = true;
        console.error(ex);
      }
      if(!keepLoading)
      {
        this.loading = false;
      }
    },

    async refresh() {
      this.load();
    },

    async launchGame(game) {
      let authenticate = await axios.get(`http://${this.config.ip}:2606/authenticate`, {timeout: 2500});
      let response = await axios.post(`http://${this.config.ip}:2606/launch`, game);
      console.log(response.data);

      this.launchDesktop();
    },

    async launchPlaynite() {
      let response = await axios.post(
        `http://${this.config.ip}:2606/launchPlaynite/${
          this.config.playniteMode || "desktop"
        }`,
      );

      this.launchDesktop();
    },

    launchDesktop() {
      ipcRenderer.send("spawnMoonlight", this.config.moonlight);
      ipcRenderer.once('spawnError', (event, data) => {
        this.spawnError = true;
        this.spawnErrorData = data;
      });

      ipcRenderer.send("hideWindow");
    },

    handleConnect(e) {
      this.controllerConnected = true;
      e.gamepad.addEventListener("buttonpress", (e) => {
        switch (e.index) {
          case StandardMapping.Button.D_PAD_LEFT:
            this.changeSelected(-1);
            break;
          case StandardMapping.Button.D_PAD_RIGHT:
            this.changeSelected(1);
            break;
          case StandardMapping.Button.D_PAD_UP:
            this.changeSelected(-this.config.columns);
            break;
          case StandardMapping.Button.D_PAD_BOTTOM:
            this.changeSelected(this.config.columns);
            break;
          case StandardMapping.Button.BUTTON_BOTTOM:
            this.launchGame(this.currentGame);
            break;
        }
      });
    },

    handleDisconnect(e) {
      this.controllerConnected = false;
    },

    async toggleMic() {
      console.log(this.micEnabled);
      if (this.micEnabled) {
        this.micEnabled = false;
        ipcRenderer.send("endRecord");
        return;
      }

      if (this.config.chosenMic == -1) {
        return;
      }

      this.micEnabled = true;

      let device = naudiodon.getDevices().filter((device) => {
        console.log(device.id, this.config.chosenMic);
        return device.id == this.config.chosenMic;
      })[0];

      ipcRenderer.send("startRecord", { device, ip: this.config.ip });
    },

    async snooze(amount)
    {
      ipcRenderer.send('sendSnoozeRequest', amount);
      ipcRenderer.once('snoozeRequestSent', (event, data) => {
        this.$notify({group: 'global', type: 'success', title: 'Snooze Request Sent', text: `The snooze request has been sent, your auto-shutdown timer has been extended by ${amount} minutes.`});
      });
    },

    async powerOn()
    {
      ipcRenderer.send('sendPowerRequest', 'start');
      ipcRenderer.once('powerRequestSent', (event, data) => {
        this.$notify({group: 'global', type: 'success', title: 'Start Request Sent', text: 'A start request has been sent. Please wait 30 seconds for your machine to start.'});
      });
    },

    async powerRestart()
    {
      if(await this.$confirm("Are you sure you wish to restart your machine?"))
      {
        ipcRenderer.send('sendPowerRequest', 'restart');
        ipcRenderer.once('powerRequestSent', (event, data) => {
          this.$notify({group: 'global', type: 'success', title: 'Restart Request Sent', text: 'A restart request has been sent. Please wait a couple of minutes for your machine to restart.'});
        });
      }
    },

    async powerOff()
    {
      if(await this.$confirm("Are you sure you wish to shutdown your machine?"))
      {
        ipcRenderer.send('sendPowerRequest', 'shutdown');
        ipcRenderer.once('powerRequestSent', (event, data) => {
          this.$notify({group: 'global', type: 'success', title: 'Shutdown Request Sent', text: 'A shutdown request has been sent. Please wait a couple of minutes for your machine to shutdown.'});
        });
      }
    },

    async powerKill()
    {
      if(await this.$confirm("Are you sure you wish to force kill your machine? This can lead to data loss and corruption. Please only do this if your machine is completely inaccessible, and the regular shutdown option isn't working."))
      {
        ipcRenderer.send('sendForceShutdown');
        ipcRenderer.once('forceShutdownSent', (event, data) => {
          this.$notify({group: 'global', type: 'success', title: 'Force Shutdown Request Sent', text: 'A force shutdown request has been sent. Please wait a minute for your machine to be killed.'});
        });
      }
    },

    // async sendRequest(url) {
    //   let response;
    //   try
    //   {
    //     response = await this.sendCORSRequest("GET", url);
    //   }
    //   catch(ex)
    //   {
    //     await this.login();
    //     response = await this.sendCORSRequest("GET", url);
    //   }
    //   return response;
    // },

    // async login() {
      // let url = 'https://login.maximumsettings.com/';
      
      // let data = qs.stringify({
      //   login_username: this.config.mxs.username,
      //   login_password: this.config.mxs.password,
      //   submit: "Login"
      // });

      // try {
      //   let response = await this.sendCORSRequest("POST", url, data, {
      //     withCredentials: true,
      //     headers: {
      //       'content-type': 'application/x-www-form-urlencoded',
      //     }
      //   });
      //   this.$notify({group: 'global', type: 'success', title: 'Successfully Logged In', text: 'Logged into Maximum Settings successfully.'});
      //   return response;
      // }
      // catch(ex)
      // {
      //   this.$notify({group: 'global', type: 'error', title: 'Error Logging In', text: 'Failed to login! Please ensure you have set your credentials correctly in the settings.'});
      //   return {};
      // }
    // },

    // async sendCORSRequest(method, url, data, config) {
    //   let id = uuid();
    //   return new Promise((resolve, reject) => {
    //     ipcRenderer.send('sendRequest', {
    //       id,
    //       url,
    //       method,
    //       data,
    //       config: config || {
    //         withCredentials: true
    //       }
    //     });

    //     ipcRenderer.once('response' + id, (event, data) => {
    //       if(data.error)
    //       {
    //         return reject();
    //       }
    //       if(data.includes('<input type="checkbox" id="checkbox"><label for="checkbox">Keep me logged in</label>'))
    //       {
    //         return reject();
    //       }
    //       resolve(data);
    //     });
    //   });
    // },
  },

  watch: {
    async search(value) {
      this.changeSearch(value);
    },
    async filter(value) {
      this.handleFilterChange(value);
    },

    config: {
      handler(value) {
        this.setConfig(value);
      },
      deep: true,
    },

    status: {
      async handler(value, oldValue) {
        if(value.status == 'running' && oldValue.status == 'stopped')
        {
          this.$notify({group: 'global', type: 'success', title: 'Machine Started', text: 'Your machine has now started! We will now attempt to re-connect.'});
          
          let times = 0;
          while(times < 25)
          {
            console.log("Loading " + times);
            await this.load(true);
            if(!this.error)
            {
              return;
            }
            times++;
          }
        }
        else if(value.status == 'stopped' && oldValue.status != 'stopped')
        {
          this.$notify({group: 'global', type: 'error', title: 'Machine Stopped', text: 'Your machine is not running. Please start it to connect.'});
          this.error = "Machine Stopped.";
        }
      }
    },

    selected(value, oldValue) {
      const card = this.$refs["game-" + value][0];
      if (card) {
        this.currentGame = card.game;
        const inView = card.inView;
        if (!inView) {
          if (value > oldValue) {
            card.$el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            card.$el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Righteous&display=swap");

.v-toolbar__content {
  padding-right: 0px !important;
}
::-webkit-scrollbar {
  width: 0.35vw;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
}
::-webkit-scrollbar-track:hover {
  background: rgba(255, 255, 255, 0.1);
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  width: 20px;
  background: rgba(255, 255, 255, 0.4);
}
::-webkit-scrollbar-thumb:active {
  width: 20px;
  background: rgba(255, 255, 255, 0.8);
}

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

.game {
  cursor: pointer;
  padding: 2px;
}
.game .v-image {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.provider {
  position: absolute;
  top: 0;
  right: 0;
  padding-bottom: 4px;
  padding-left: 4px;
  padding-top: 2px;
  padding-right: 2px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 4px;
}
.installed {
  position: absolute;
  bottom: 0;
  right: 0;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-top: 4px;
  padding-right: 2px;
  background: rgba(0, 0, 0, 0.5);
  border-top-left-radius: 4px;
}

.description img {
  max-width: 100% !important;
}

.description video {
  max-width: 100% !important;
}

.maximumsettingsalt .v-app-bar .v-btn .v-icon {
  color: #444 !important;
}

.maximumsettingsalt .v-application .shimmerText.text-h5 {
  background: radial-gradient(
    ellipse at top right,
    #444 0%,
    #444 25%,
    rgb(200, 200, 200) 50%,
    #444 75%,
    #444 100%
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
</style>
