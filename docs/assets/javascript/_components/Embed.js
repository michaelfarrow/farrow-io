;(function () {
  var EventBus = new Vue()

  ExtendComponent('scroll', 'embed-base', {
    props: {
      id: {
        required: true
      },
      background: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      playerOptions: function () {
        return {}
      }
    },
    methods: {
      onScrollLeave: function () {
        if (!this.background) this.pause()
      },
      onPlay: function () {
        if(!this.background) EventBus.$emit('play', this)
        this.$emit('play')
      },
      onEventBusPlay: function (c) {
        if (!this.background && c !== this) this.pause()
      },
      pause: function () {}
    },
    created: function () {
      EventBus.$on('play', this.onEventBusPlay)
    },
    beforeDestroy: function () {
      EventBus.$off('play', this.onEventBusPlay)
    },
    template: ``
  })

  ExtendComponent('embed-base', 'embed-youtube', {
    computed: {
      playerOptions: function () {
        var bg = this.background ? 1 : 0
        return {
          playlist: String(this.id),
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          color: 'white',
          controls: 0,
          loop: bg,
          autoplay: this.autoPlay ? 1 : 0
        }
      }
    },
    methods: {
      onReady: function (player) {
        this.player = player
      },
      pause: function () {
        this.player.pauseVideo()
      }
    },
    template: `<youtube :video-id="id" :player-vars="playerOptions" :mute="background" @ready="onReady" @playing="onPlay" />`
  })

  ExtendComponent('embed-base', 'embed-vimeo', {
    computed: {
      playerOptions: function () {
        return {
          quality: '720p',
          title: 0,
          byline: 0,
          portrait: 0,
          background: this.background ? 1 : 0,
          transparent: 1,
          autoplay: this.autoPlay ? 1 : 0
        }
      }
    },
    methods: {
      onReady: function (player) {
        this.player = player
      },
      pause: function () {
        this.$refs.player.pause()
      }
    },
    template: `<vimeo-player ref="player" :video-id="id" :options="playerOptions" @play="onPlay" />`
  })

  ExtendComponent('scroll', 'embed-inline', {
    props: {
      provider: {
        type: String,
        required: true
      },
      id: {
        required: true
      },
      ratio: {
        type: String,
        default: '16:9'
      },
      background: {
        type: Boolean,
        default: false
      },
      image: {
        type: String
      },
      background_colour: {
        type: String,
        default: 'black'
      }
    },
    data: function() {
      return {
        playing: false,
        load: false
      }
    },
    methods: {
      onPlay: function() {
        this.playing = true
      },
      onImageClick: function() {
        this.load = true
      }
    },
    computed: {
      providerComponentName: function () {
        return `embed-${this.provider.toLowerCase().trim()}`
      },
      embedPadding: function () {
        var ratio = this.ratio.split(':')
        var x = parseFloat(ratio[0])
        var y = parseFloat(ratio[1])
        return `${y / x * 100}%`
      }
    },
    template: `
      <div class="embed-wrapper" :style="{backgroundColor: background_colour}">
        <div class="embed-inner" :style="{paddingTop: embedPadding}">
          <div v-if="!image || load" :class="{ 'embed-component': true, 'embed-component-background': background, 'embed-component-playing': playing }">
            <component :is="providerComponentName" :id="id" :background="background" :autoPlay="!!image || background" @play="onPlay" />
          </div>
          <div v-if="image && !playing" class="embed-cover-image" @click="onImageClick" >
            <image-background :src="image" />
            <div v-if="!load" class="embed-controls-play-pause">
              <span>Play</span>
              <i></i>
            </div>
          </div>
        </div>
      </div>
    `
  })
})()
