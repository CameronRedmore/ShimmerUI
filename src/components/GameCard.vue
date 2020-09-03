<template>
    <v-lazy transition="fade-transition" :value="inView" :min-height="minHeight" :options="intersectOptions">
        <v-card class="game" @click="$emit('launch')" v-intersect="{
            handler: intersect,
            options: intersectOptions,
        }">
            <v-row align="center">
                <v-col cols="12" class="title text-center text-truncate">{{game.name}}</v-col>
            </v-row>
            <v-img :src="game.poster">
                <template v-slot:placeholder>
                <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
                </template>
                <div :class="'provider ' + game.provider">
                <v-icon size="48">
                {{providerToIcon(game.provider)}}
                </v-icon>
                </div>
                <div class="installed" v-if="game.installed">
                <v-icon size="48">
                    mdi-download
                </v-icon>
                </div>
            </v-img>
        </v-card>
    </v-lazy>
</template>

<script>
export default {
    props: ['game', 'providerToIcon', 'transparent', 'minHeight'],
    data() {
        return {
            inView: false,
            intersectOptions: {
                threshold: 0,
                rootMargin: '200% 0px 200% 0px',
            },
        }
    },
    methods: {
        intersect(entries,observer) {
            this.inView = entries[0].isIntersecting;
        },
    }
}
</script>
