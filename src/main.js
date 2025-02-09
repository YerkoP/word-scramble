import './style.css'

const words = ['example', 'coding', 'overflow', 'webapp']
const MAX_ALLOWED_TRIES = 5
let currentWord = ''
let scramblledWord = ''
let userGuess = ''
let tries = 0
let mistakes = []

function reset() {
  tries = 0
  mistakes = []
  userGuess = ''
  document.querySelector('.tries > span').textContent = 'Tries (0/5):'
  document.querySelectorAll('.tries-counter li').forEach(li => li.classList.remove('marked'))
  document.querySelectorAll('.input input').forEach(input => input.value = '')
  document.querySelector('.mistakes-output').textContent = mistakes.join(', ')
}

function generateRandomWord() {
  const index = Math.floor(Math.random() * words.length)
  currentWord = words[index]
  console.log('Choosen word:', currentWord)
  scramblledWord = scrumbleWord(currentWord)
  createInputFields(currentWord.length)
  document.querySelector('.output').textContent = scramblledWord

  reset()
}

function scrumbleWord(word) {
  const charArray = word.split('')
  const length = charArray.length

  for(let i = length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * i + 1)
    const tmp = charArray[i]
    charArray[i] = charArray[index]
    charArray[index] = tmp
  }
  return charArray.join('')
}

function createInputFields(length) {
  const inputRow = document.querySelector('.input')

  while(inputRow.firstChild) {
    inputRow.removeChild(inputRow.firstChild)
  }

  for(let i = 0; i < length; i++) {
    const container = document.createElement('div')
    container.classList.add('input-container')
    const newInput = document.createElement('input')
    newInput.setAttribute('maxlength', 1)
    newInput.dataset['index'] = i
    newInput.addEventListener('focus', handleFocus)
    newInput.addEventListener('blur', handleBlur)
    newInput.addEventListener('input', handleInput)
    container.appendChild(newInput)
    inputRow.appendChild(container)
  }
}

function handleFocus(event) {
  const cursor = document.createElement('div')
  cursor.classList.add('cursor')
  event.target.parentElement.appendChild(cursor)
  if (event.target.classList.contains('wrong')) {
    event.target.value = ''
    event.target.classList.remove('wrong')
  }
}

function handleBlur(event) {
  const cursor = event.target.parentElement.querySelector('.cursor')
  event.target.parentElement.removeChild(cursor)
}

function handleInput(event) {
  const input = event.target
  const userValue = input.value
  const index = parseInt(input.dataset['index'], 10)
  const correctValue = currentWord.charAt(index)
  if (userValue === correctValue) {
    userGuess += userValue
    if (userGuess === currentWord) {
      document.getElementById('success-dialog').querySelector('strong').textContent = currentWord
      document.getElementById('success-dialog').showModal()
    }
  } else {
    tries++
    if (tries < MAX_ALLOWED_TRIES) {
      input.classList.add('wrong')
      document.querySelectorAll('.tries-counter li').forEach((li, i) => {
        if (i < tries) li.classList.add('marked')
      })
      document.querySelector('.tries > span').textContent = `Tries (${tries}/5):`
      mistakes.push(userValue)
      document.querySelector('.mistakes-output').textContent = mistakes.join(', ')
    } else {
      reset()
    }
  }

  const nextInput = document.querySelector(`.input-container input[data-index="${index + 1}"]`)
  if (nextInput) {
    input.blur()
    nextInput.focus()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  generateRandomWord()
  document.getElementById('random-btn').addEventListener('click', e => generateRandomWord())
  document.getElementById('reset-btn').addEventListener('click', e => reset())
  document.getElementById('close-btn').addEventListener('click', e => {
    document.getElementById('success-dialog').close()
    generateRandomWord()
  })
})