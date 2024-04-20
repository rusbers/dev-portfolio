// contact form validation

const form = document.querySelector('.contact-form')
const errorStyle = 'field--error'

form.addEventListener('submit', (event) => {
  event.preventDefault()

  validateField('name', (value) => value.trim() === '')
  validateField('email', (value) => value.trim() === '' || !isValidEmail(value))
  validateField('message', (value) => value.trim() === '')
})

function validateField(fieldId, validationCondition) {
  const field = document.getElementById(fieldId)
  const value = field.value

  if (validationCondition(value)) {
    field.classList.add(errorStyle)
  } else {
    field.classList.remove(errorStyle)
  }
}

function isValidEmail(email) {
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  return email.match(emailPattern)
}

//Focuses on the first contact form field on "contact me" button click

const contactFormId = '#contact-form'
const contactButtons = document.querySelectorAll(`a[href="${contactFormId}"]`)
const firstField = document.querySelector(`${contactFormId} .field`)

contactButtons.forEach((button) => {
  button.addEventListener('click', function (event) {
    event.preventDefault()

    document.querySelector(contactFormId).scrollIntoView()

    if (firstField) firstField.focus()
  })
})
