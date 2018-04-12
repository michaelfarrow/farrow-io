;(function () {
  var _controller = new ScrollMagic.Controller({globalSceneOptions: {}})
  window._scrollController = _controller

  Component('scroll', {
    methods: {
      onWindowResize: function (e) {
        this.sceneDuration = window.innerHeight + this.$el.clientHeight
      },
      _onScrollEnter: function (e) {
        this.onScrollEnter()
        return e.scrollDirection === 'FORWARD'
          ? this.onScrollEnterBottom()
          : this.onScrollEnterTop()
      },
      _onScrollLeave: function (e) {
        this.onScrollLeave()
        return e.scrollDirection === 'FORWARD'
          ? this.onScrollLeaveTop()
          : this.onScrollLeaveBottom()
      },
      onScrollEnter: function () {},
      onScrollLeave: function () {},
      onScrollEnterTop: function () {},
      onScrollEnterBottom: function () {},
      onScrollLeaveTop: function () {},
      onScrollLeaveBottom: function () {}
    },
    mounted: function () {
      var that = this
      window.addEventListener('resize', this.onWindowResize)
      this.onWindowResize()
      this.scene = new ScrollMagic.Scene({
        triggerElement: this.$el,
        triggerHook: 'onEnter',
        duration: function () {
          return that.sceneDuration
        }
      })
        .on('enter', this._onScrollEnter)
        .on('leave', this._onScrollLeave)
        .addTo(_controller)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.onWindowResize)
      this.scene.destroy()
      this.scene = null
    },
    template: ``
  })
})()
