function Component (name, config) {
  var component = Vue.component(
    name,
    Object.assign({}, { delimiters: ['[[', ']]'] }, config)
  )
  if (!window._components) window._components = {}
  window._components[name] = component
  return component
}

function ExtendComponent (extendName, name, config) {
  var extend = window._components[extendName]
  if (!extend) throw new Error(`component "${extendName}" doesn't exist and cannot be extended`)
  return Component(name, Object.assign({}, config, {extends: extend}))
}
