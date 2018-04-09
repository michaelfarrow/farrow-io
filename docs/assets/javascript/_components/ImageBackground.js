Component('image-background', {
  props: {
    src: {
      type: String,
      required: true
    },
    span: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    imageClass: function () {
      var classes = { image: true }
      classes[`image-span-${ this.span }`] = true
      return classes
    }
  },
  template: `
    <span :class="imageClass">
      <span class="image-img b-lazy" :data-src="src"></span>
    </span>
  `
})
