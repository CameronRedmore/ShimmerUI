<template>
  <v-container fluid style="height: calc(100vh - (64px + 36px)); overflow: auto;">
    <v-app-bar :color="config.theme.headerColour" app style="-webkit-app-region: drag; border-radius: 500px;">
        <template v-if="config.theme.name == 'FirePowerCloud'">
          <img :src="firepowerlogo" style="height: 32px;"/>
          <img :src="firepowertext" style="height: 16px;" class="pl-2"/>
          <v-divider vertical inset class="mx-2" style="border-color: white"/>
          <span class="text-h5 shimmerText">Shimmer</span>
        </template>
        <template v-else>
          <strong class="text-h5 font-weight-bold shimmerText">Shimmer</strong>
          <v-divider vertical inset class="mx-2" style="border-color: white"/>
          <span class="text-h5">
            Moonlight Interface
          </span>
        </template>
      <v-spacer/>
      <v-toolbar-items style="-webkit-app-region: no-drag;">
        <v-divider vertical inset/>
        <v-btn icon @click="launchDesktop" title="Launch Desktop">
          <v-icon>
            mdi-monitor
          </v-icon>
        </v-btn>
        <v-divider vertical inset/>
        <v-menu bottom :close-on-content-click="false">
          <template v-slot:activator={on}>
            <v-btn icon v-on="on" title="Search">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-text-field type="search" placeholder="Search" prepend-icon="mdi-magnify" v-model="search"></v-text-field>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-btn icon @click="refresh" title="Refresh Games List">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-divider vertical inset/>
        <v-btn icon @click="settings = true" title="Settings">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
        <v-divider vertical inset/>
        <v-btn icon @click="minimise">
          <v-icon>mdi-window-minimize</v-icon>
        </v-btn>
        <v-btn icon @click="maximise">
          <v-icon>{{maximised ? 'mdi-window-restore' : 'mdi-window-maximize'}}</v-icon>
        </v-btn>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-row align="center" justify="center" class="fill-height" v-resize="handleResize">
      <v-col cols="8" v-if="filteredGames.length == 0">
        <v-card color="error">
          <v-card-text class="text-center title">
          No games could be found, please check your filters and search criteria, and ensure you have configured your host IP!
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="Math.floor(12 / config.columns)" v-for="(game) in filteredGames" :key="game.provider + game.id">
        <game-card :game="game" @launch="launchGame(game.id)" :transparent="transparent" :minHeight="minHeight" :providerToIcon="providerToIcon"></game-card>
      </v-col>
    </v-row>
    <v-dialog v-model="settings" max-width="75%" scrollable height="85%" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>
            Settings
          </v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn icon @click="settings = false; load()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="py-0">
              <v-subheader class="pa-0">UI Configuration</v-subheader>
              <v-divider/>
            </v-col>
            <v-col cols="12">
              <v-select outlined hide-details v-model="config.columns" label="Grid Columns" :items="[1, 2, 3, 4, 6, 12]"></v-select>
            </v-col>
            <v-col cols="12">
              <v-select outlined hide-details v-model="config.theme" label="Theme" :items="themes" return-object item-key="name" item-text="name"></v-select>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-subheader class="pa-0">Primary Configuration</v-subheader>
              <v-divider/>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-row>
                <v-col cols="6">
                  <v-text-field outlined hide-details v-model="config.ip" label="Machine IP"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field outlined hide-details v-model="config.appName" label="Desktop App Name"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field outlined hide-details v-model="config.moonlightExe" label="Moonlight Executable Location"></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-subheader class="pa-0">Display Options</v-subheader>
                  <v-divider/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-subheader class="pa-0">Audio Options</v-subheader>
                  <v-divider/>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="3" class="pt-0">
                      <v-text-field type="number" label="Width" outlined hide-details v-model="resolutionX"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="pt-0">
                      <v-text-field type="number" label="Height" outlined hide-details v-model="resolutionY"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="pt-0">
                      <v-text-field type="number" label="FPS" outlined hide-details v-model="config.moonlight.fps"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="pt-0">
                      <v-select hide-details outlined label="Display Mode" :items="[{value: 'fullscreen', text: 'Fullscreen'}, {value: 'borderless', text: 'Borderless'}, {value: 'windowed', text: 'Windowed'}]" v-model="config.moonlight['display-mode']"></v-select>
                    </v-col>
                    <v-col cols="3" class="">
                      <v-select outlined hide-details label="Video Codec" v-model="config.moonlight['video-codec']" :items="[{value: 'auto', text: 'Auto'}, {value: 'H.264', text: 'H264'}, {value: 'HEVC', text: 'H265 (HEVC)'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="">
                      <v-select outlined hide-details label="Video Decoder" v-model="config.moonlight['video-decoder']" :items="[{value: 'auto', text: 'Auto'}, {value: 'software', text: 'Software (Not Recommended)'}, {value: 'hardware', text: 'Hardware'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="">
                      <v-select label="V-Sync" outlined hide-details v-model="config.moonlight['vsync']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="">
                      <v-select label="Frame Pacing" outlined hide-details v-model="config.moonlight['frame-pacing']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                    <v-col cols="8">
                      <v-slider class="pt-3" hide-details v-model="bitrate" label="Bitrate (Mbps)" min="5" max="100" thumb-label></v-slider>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field hide-details outlined type="number" v-model="bitrate" min="5" max="100" label="Bitrate (Mbps)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="8" class="py-0">
                      <v-select outlined hide-details label="Audio Configuration" v-model="config.moonlight['audio-config']" :items="[{value: 'stereo', text: 'Stereo'}, {value: '5.1-surround', text: '5.1 Surround Sound'}, {value: '7.1-surround', text: '7.1 Surround Sound'}]"></v-select>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-select outlined hide-details label="Host Audio" v-model="config.moonlight['audio-on-host']" :items="[{value: false, text: 'Do Not Play Audio'}, {value: true, text: 'Play Audio On Host'}]"></v-select>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-subheader class="pa-0">Miscellanous Flags</v-subheader>
                  <v-divider/>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="3" class="py-0">
                      <v-select label="Absolute Mouse" outlined hide-details v-model="config.moonlight['absolute-mouse']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="py-0">
                      <v-select label="Touchscreen Trackpad" outlined hide-details v-model="config.moonlight['touchscreen-trackpad']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="py-0">
                      <v-select label="Multi Controller" outlined hide-details v-model="config.moonlight['multi-controller']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                    <v-col cols="3" class="py-0">
                      <v-select label="Quit on Exit" outlined hide-details v-model="config.moonlight['quit-after']" :items="[{value: false, text: 'Disabled'}, {value: true, text: 'Enabled'}]"></v-select>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="error" max-width="50%" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>
            Data Server Communication Failure
          </v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn icon @click="error = false; settings = true;">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text v-if="config.ip" class="title pt-4 text-center">
          There was an issue connecting to the remote data server. Please ensure you have set the correct IP address in the settings,
          and have installed the latest version of the data server on your NVIDIA GameStream host (<em>NOT</em> this machine).
        </v-card-text>
        <v-card-text v-else class="title pt-4 text-center">
          It appears this is either your first run of the program, or you have removed the IP address from the settings menu. Close this dialogue to open the settings menu to configure the application.
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="spawnError" max-width="50%" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>
            Moonlight Error
          </v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn icon @click="spawnError = false; settings = true;">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="title pt-4 text-center">
          There was an issue creating the Moonlight instance. Please ensure all of your settings are correct, that you have set the correct Moonlight executable location, and that Moonlight is installed on this computer.<br/>
          If you are unable to figure out the issue, please create an issue on our GitHub page, and cite the following error:<br/>
          <pre style="max-height: 4em; width: 100%; background: black; border: 1px solid grey; padding: 5px; overflow: auto; border-radius: 4px;">{{spawnErrorData}}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading" opacity="0.9" class="text-center">
      <span class="display-1">Loading Games</span><br/>
      <span class="title">This can take a while, especially on first run! Please give this a good 5/10 minutes to run on the first startup whilst the game server caches your game lists.</span><br/>
      <v-progress-circular indeterminate color="primary" size="128" width="12"></v-progress-circular>
    </v-overlay>
    <v-footer app :color="config.theme.footerColour">
      <v-spacer/>
      <template v-if="games.length == filteredGames.length">
        Showing {{games.length}} Games From {{filteredPlatforms.length}} Platform{{filteredPlatforms.length != 1 ? 's' : ''}}
      </template>
      <template v-else>
        Showing {{filteredGames.length}} / {{games.length}} Games From {{platforms.length}} Platform{{platforms.length != 1 ? 's' : ''}} (Filtered)
      </template>
    </v-footer>
  </v-container>
</template>

<script>
import {debounce} from 'lodash';
import axios from 'axios';

import firepowerlogo from '@/assets/FirePowerLogoWhite.svg';
import firepowertext from '@/assets/FirePowerTextWhite.svg';

import GameCard from '@/components/GameCard';

const util = require('util');

const exec = util.promisify(require('child_process').exec);
const execFile = require('child_process').execFile;

const remote = require('electron').remote;
const window = remote.getCurrentWindow();


export default {
  name: 'Home',
  components: {
    GameCard
  },

  data: function() {
    return {
      window,

      maximised: false,

      firepowerlogo,
      firepowertext,

      loading: false,

      error: false,

      spawnError: false,
      spawnErrorData: "",

      minHeight: 50,

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
          name: "FirePowerCloud",
          headerColour: "#009B72",
          footerColour: "#009B72",
        }
      ],

      config: {
        appName: "Desktop",
        ip: "",
        moonlightExe: "",
        moonlight: {
          "resolution": "1920x1080",
          "video-codec": "auto",
          "video-decoder": "auto",
          "display-mode": "fullscreen",
          "audio-config": "stereo",
          "fps": "60",
          "bitrate": 25000,
          "vsync": false,
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
          name: "FirePowerCloud",
          headerColour: "#009B72",
          footerColour: "#009B72",
        }
      },

      settings: false,
      games: [],
      filteredGames: [],

      search: "",
      
      setConfig: debounce(function(value) {
        localStorage.setItem("config", JSON.stringify(value));

        this.handleResize();
      }, 1500),

      changeBitrate: debounce(function(value) {
        this.config.moonlight.bitrate = value * 1000;
      }, 1000),

      changeSearch: debounce(function(search) {
        if(!search)
        {
          this.filteredGames = [...this.games];
          this.filteredGames.sort((a, b) => {
            let aName = a.search;
            let bName = b.search;

            if(aName < bName)
            {
              return -1;
            }
            if(bName < aName)
            {
              return 1;
            }
            return 0;
          });
        }
        else
        {
          let searchQuery = search.toLowerCase().replace(/\W/g, "");
          let regex = new RegExp(searchQuery, "g");
          this.filteredGames = [...this.games].filter((value) => {
            let result = regex.test(value.search);
            return result;
          });
          this.filteredGames.sort((a, b) => {
            let aName = a.search;
            let bName = b.search;

            if(aName < bName)
            {
              return -1;
            }
            if(bName < aName)
            {
              return 1;
            }
            return 0;
          });
        }
      }, 1000),

      transparent: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAADXCAMAAACgY5FYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAAAAAKVnuc8AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAeFJREFUeF7t0QENAAAMw6DPv+n7IMUCtzDKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZkDIhZULKhJQJKRNSJqRMSJmQMiFlQsqElAkpE1ImpExImZAyIWVCyoSUCSkTUiakTEiZjO0BklSCZJZXPFQAAAAASUVORK5CYII="
    };
  },

  computed: {
    platforms() {
      let platforms = [];
      this.games.forEach((item) => {
        if(!platforms.includes(item.provider))
        {
          platforms.push(item.provider);
        }
      });

      return platforms;
    },
    filteredPlatforms() {
      let platforms = [];
      this.filteredGames.forEach((item) => {
        if(!platforms.includes(item.provider))
        {
          platforms.push(item.provider);
        }
      });

      return platforms;
    },
    bitrate: {
      get() {
        return this.config.moonlight.bitrate / 1000;
      },
      set(value) {
        this.changeBitrate(value);
      }
    },
    resolutionX: {
      get() {
        return this.config.moonlight.resolution.split("x")[0];
      },
      set(value) {
        this.config.moonlight.resolution = value + "x" + this.config.moonlight.resolution.split("x")[1];
      }
    },
    resolutionY: {
      get() {
        return this.config.moonlight.resolution.split("x")[1];
      },
      set(value) {
        this.config.moonlight.resolution = this.config.moonlight.resolution.split("x")[0] + "x" + value;
      }
    }
  },

  async mounted() {
    let config = localStorage.getItem("config");
    if(config)
    {
      this.config = JSON.parse(config);
    }
    if(this.config.moonlightExe == "")
    {
      switch(navigator.platform)
      {
        case "Win32":
          this.config.moonlightExe = "C:\\Program Files\\Moonlight Game Streaming\\Moonlight.exe";
          break;
        case "MacIntel":
          this.config.moonlightExe = "/Applications/Moonlight.app/Content/MacOS/Moonlight";
        default:
          try 
          {
            const {stdout} = await exec("which moonlight");
            if(stdout)
            {
              this.config.moonlightExe = stdout;
            }
            else
            {
              throw new Exception("Executable not found!");
            }
          }
          catch(ex)
          {
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
  },

  methods: {
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
    providerToIcon(provider)
    {
      switch(provider)
      {
        case "Steam":
          return "mdi-steam";
      }
    },
    handleResize() {
      let element = document.querySelector(".game");
      if(!element)
      {
        console.log("Checked game did not exist.");
        return;
      }
      let imageElement = document.querySelector(".game > .v-image");
      if(!imageElement || imageElement.clientHeight == 0)
      {
        console.log("Checked game image not yet loaded.");
        return;
      }
      let height = element.clientHeight;
      this.minHeight = height;
    },
    async load() {
      this.loading = true;
      try
      {
        let response = await axios.get(`http://${this.config.ip}:2606/games`);
        if(response.status != 200)
        {
          this.loading = false;
          return;
        }
        this.games = response.data;
        this.games = this.games.map((game) => {
          return {
            ...game,
            search: game.name.toLowerCase().replace(/\W/g, ""),
          }
        });
        this.filteredGames = [...this.games];
        this.filteredGames.sort((a, b) => {
          let aName = a.search;
          let bName = b.search;

          if(aName < bName)
          {
            return -1;
          }
          if(bName < aName)
          {
            return 1;
          }
          return 0;
        });
      }
      catch(ex)
      {
        this.error = true;
      }
      this.loading = false;
    },

    async refresh()
    {
      this.loading = true;
      let response = await axios.post(`http://${this.config.ip}:2606/refresh`);
      this.load();
    },

    async launchGame(game)
    {
      let response = await axios.post(`http://${this.config.ip}:2606/launch`, game);
      console.log(response.data);

      this.launchDesktop();
    },

    launchDesktop()
    {
      let args = [];
      let moonlightargs = this.config.moonlight;
      Object.keys(this.config.moonlight).forEach((key) => {
        if(moonlightargs[key] === true)
        {
          args.push("--" + key);
        }
        else if(moonlightargs[key] === false)
        {
          args.push("--no-" + key);
        }
        else
        {
          args.push("--" + key);
          args.push(moonlightargs[key]);
        }
      });

      args.push("stream");
      args.push(this.config.ip);
      args.push(this.config.appName);

      execFile(this.config.moonlightExe, args, (error,stdout,stdin) => {
        console.log(error);
        if(error)
        {
          this.spawnError = true;
          this.spawnErrorData = error;
        }
      });
    }
  },

  watch: {
    async search(value)
    {
      this.changeSearch(value);
    },

    config:{
      handler(value)
      {
        this.setConfig(value);
      },
      deep: true,
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

  .v-toolbar__content {
    padding-right: 0px !important;
  }
  ::-webkit-scrollbar {
    width: 0.35vw;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(255,255,255,0);
  }
  ::-webkit-scrollbar-track:hover {
    background: rgba(255,255,255,0.1)
  }
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: rgba(255,255,255,0.2);
  }
  ::-webkit-scrollbar-thumb:hover{
    width: 20px;
    background: rgba(255,255,255,0.4);
  }
  ::-webkit-scrollbar-thumb:active{
    width: 20px;
    background: rgba(255,255,255,0.8);
  }

  .v-application .shimmerText.text-h5 {
    background: radial-gradient(ellipse at top right, #fff 0%, #fff 25%, silver 50%, #fff 75%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    background-size: 400% 400%;
    background-position: bottom left;

    animation-duration: 4s;
    animation-name: shimmer;
    animation-iteration-count: infinite;

    font-family: 'Righteous' !important;
  }
  
  @keyframes shimmer
  {
    0% {
      background-position: bottom left;
    }
    100% {
      background-position: top right;
    }
  }

  .game {
    cursor: pointer;
  }
  .provider {
    position: absolute;
    top: 0;
    right: 0;
    padding-bottom: 4px;
    padding-left: 4px;
    padding-top: 2px;
    padding-right: 2px;
    background: rgba(0,0,0,0.5);
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
    background: rgba(0,0,0,0.5);
    border-top-left-radius: 4px;
  }
</style>
