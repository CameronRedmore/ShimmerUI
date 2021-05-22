<template>
  <v-lazy
    transition="fade-transition"
    :value="inView"
    :min-height="minHeight"
    :options="intersectOptions"
    ref="lazy"
  >
    <div ref="container" style="position: relative;">
      <v-card
        ref="card"
        :class="'game ' + (visible ? 'scaled' : '')"
        :color="selected ? primaryColour : 'dfault'"
        v-intersect="{
          handler: intersect,
          options: intersectOptions,
        }"
        :elevation="visible ? 4 : 0"
        @mouseenter="visible = true"
        @mouseleave="visible = false; handleMouseMove($event)"
        @mousemove="handleMouseMove"
      >
        <v-row align="center">
          <v-col cols="12" class="title text-center text-truncate">{{
            game.Name
          }}</v-col>
        </v-row>
        <v-img :src="game.poster" :aspect-ratio="600 / 798" :gradient="gradient">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
          <div class="overlay" v-show="visible">
              <div class="inner text-center"><v-btn x-large icon @click="launchGame"><v-icon v-text="game.IsInstalled ? 'mdi-play' : 'mdi-download'"></v-icon></v-btn><v-btn x-large @click="launchInfo" icon><v-icon>mdi-information</v-icon></v-btn></div>
          </div>
          <div :class="'provider ' + game.provider">
            <v-icon size="48">
              {{ providerToIcon(game.provider) }}
            </v-icon>
          </div>
          <div class="installed" v-if="game.IsInstalled">
            <v-icon size="48"> mdi-download </v-icon>
          </div>
        </v-img>
        <div class="shimmer" ref="shimmer" v-show="visible"></div>
      </v-card>
    </div>
  </v-lazy>
</template>

<script>
import _ from 'lodash';

export default {
  props: ["game", "providerToIcon", "transparent", "minHeight", "selected", "primaryColour"],
  data() {
    return {
      inView: false,
      intersectOptions: {
        threshold: 0,
        rootMargin: "2000px 0px 2000px 0px",
      },

      visible: false,

      handleMouseMove: _.throttle((e) => {
        {
          if(!this.visible)
          {
            this.$refs.card.$el.style.transform = "";
            this.$refs.card.$el.style.zIndex = "";
            return;
          }
          this.$refs.card.$el.style.zIndex = 7;
          let xy = [e.clientX, e.clientY];

          let position = xy.concat([this.$refs.lazy.$el]);

          window.requestAnimationFrame(() => {
            this.transformElement(this.$refs.card.$el, position);
          });

          if(e.currentTarget)
          {
            let box = e.currentTarget.getBoundingClientRect();

            let x = e.pageX - box.left;
            let y = e.pageY - box.top;

            let css = `radial-gradient(circle at ${x}px ${y}px, rgba(200,200,200,0.45) 0%, rgba(0,0,0,0.25) 35%)`;
            
            this.$refs.shimmer.style.backgroundImage = css;
          }
        }
      }, 10),
    };
  },
  methods: {
    intersect(entries, observer) {
      this.inView = entries[0].isIntersecting;
    },

    isInView() {
      return this.inView;
    },

    launchGame() {
      this.$emit('launchGame');
    },

    launchInfo() {
      this.$emit('info');
    },

    transformElement(el, xyEl) {
      if(!this.visible)
      {
        el.style.transform = "";
        return;
      }
      function transforms(x, y, el) {
        let constrain = 100;
        let box = el.getBoundingClientRect();
        let calcX = -(y - box.y - (box.height / 2)) / constrain;
        let calcY = (x - box.x - (box.width / 2)) / constrain;
        
        return "perspective(100px) "
          + "   rotateX("+ calcX +"deg) "
          + "   rotateY("+ calcY +"deg) ";
      };
      el.style.transform  = transforms.apply(null, xyEl);
    }
  },

  computed: {
    gradient() {
      if (this.game.IsInstalled) {
        return "";
      } else {
        return "to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.85)";
      }
    },
  },
};

</script>

<style scoped>
  .game {
    transform: scale(1);
    transition: all 0.25s;
    user-select: none;
  }

  .scaled {
    transform: scale(1.05);
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.35);
  }

  .inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .shimmer {
    pointer-events: none;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0);
    transition: all 0.25s;
  }
</style>
