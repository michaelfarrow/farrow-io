Component('image-inline', {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  template: `<img :src="src" />`
})
