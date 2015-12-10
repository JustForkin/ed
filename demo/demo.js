import Ed from '../src/'
import fixture from './fixture'

let content = fixture.content
let ed
let menu = 'tip'

// ProseMirror setup
function setup (options={menu:'tip'}) {
  if (ed) {
    ed.teardown()
    ed = null
  }
  ed = new Ed({
    container: document.querySelector('#mirror'),
    onChange: onPostChange,
    content: content,
    menutip: (options.menu === 'tip' ? true : false),
    menubar: (options.menu === 'tip' ? false : true)
  })
  console.log(ed)
}
function onPostChange () {
  // noop
}
setup()

// Debug buttons

// Switch menu
let toggleMenu = document.querySelector('#menu')
toggleMenu.onclick = function (event) {
  if (menu === 'tip') {
    menu = 'bar'
    toggleMenu.textContent = 'Switch to menu tooltip'
  } else {
    menu = 'tip'
    toggleMenu.textContent = 'Switch to menu bar'
  }
  setup({menu})
}

// Hydrate
let apiJSON = document.querySelector('#api')
apiJSON.value = JSON.stringify(content, null, 2)
function APIToEditor () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    return console.warn('bad json')
  }
  ed.content = json
}
document.querySelector('#hydrate').onclick = APIToEditor

// Dehydrate
function EditorToAPI () {
  apiJSON.value = JSON.stringify(ed.content, null, 2)
}
document.querySelector('#dehydrate').onclick = EditorToAPI

// Simulate changes from API
let timeout
const letters = 'pskzfgtaaiioo   '.split('')
let randomLetter = function () {
  return letters[ Math.floor(Math.random()*letters.length) ]
}
let toggleUpdates = function () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
    document.querySelector('#sim').textContent = 'Simulate changes from API ▶'
  } else {
    timeout = setTimeout(simulateUpdates, 500)
    document.querySelector('#sim').textContent = 'Simulate changes from API ◼︎'
  }
}
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 500)
  // Mutate
  let content = ed.content
  let html = content[0].html
  html = html.slice(0, -4) + randomLetter() + '</p>'
  content[0].html = html
  ed.content = content
}
document.querySelector('#sim').onclick = toggleUpdates
