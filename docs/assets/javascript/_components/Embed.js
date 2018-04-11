// var embed_players = []

// function embed_players_pause_others (player) {
//   for (var i = 0; i < embed_players.length; i++) {
//     var embedPlayer = embed_players[i].instance
//     if (!embedPlayer.background && embedPlayer.player !== player) {
//       embedPlayer.pause()
//     }
//   }
// }

Component('embed-inline', {
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
    }
  },
  data: function () {
    return {
      apiLoaded: false
    }
  },
  computed: {
    providerNormalised: function () {
      return this.provider.toLowerCase().trim()
    },
    embedPadding: function () {
      var ratio = this.ratio.split(':')
      var x = parseFloat(ratio[0])
      var y = parseFloat(ratio[1])
      return `${y / x * 100}%`
    },
    playerOptions: function () {
      var bg = this.background ? 1 : 0
      var prodiver = this.providerNormalised
      switch (prodiver) {
        case 'youtube':
          return {
            playlist: String(this.id),
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            color: 'white',
            controls: 0,
            enablejsapi: 1,
            loop: bg,
            autoplay: bg
          }
        case 'vimeo':
          return {
            quality: '720p',
            title: 0,
            byline: 0,
            portrait: 0,
            background: bg
          }
      }
      return {}
    }
  },
  template: `
    <div class="embed-wrapper">
      <div class="embed-inner" :style="{paddingTop: embedPadding}">
        <youtube v-if="providerNormalised === 'youtube'" :video-id="id" :player-vars="playerOptions" :mute="background" />
        <vimeo-player v-if="providerNormalised === 'vimeo'" :video-id="id" :options="playerOptions" />
      </div>
    </div>
  `
})
