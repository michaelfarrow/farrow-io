function Component (name, config) {
  Vue.component(
    name,
    Object.assign({}, { delimiters: ['[[', ']]'] }, config)
  )
}
