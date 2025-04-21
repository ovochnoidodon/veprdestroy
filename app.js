// Получаем элементы DOM
const messages = document.getElementById('messages')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

// Функция для добавления сообщений в диалоговое окно
function addMessage(message, isUser) {
  const div = document.createElement('div')
  div.className = `message ${isUser ? 'user-message' : 'bot-message'}`
  div.innerHTML = marked.parse(message) // Используем marked для Markdown
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight // Автопрокрутка до последнего сообщения
}

// Функции для управления модальными окнами
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block'
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none'
}

// Обработчик формы регистрации
document.getElementById('register-form').addEventListener('submit', async event => {
  event.preventDefault()

  // Собираем данные из формы
  const username = document.getElementById('regUsername').value.trim()
  const email = document.getElementById('regEmail').value.trim()
  const password = document.getElementById('regPassword').value.trim()

  if (!username || !email || !password) {
    alert('Пожалуйста, заполните все поля.')
    return
  }

  try {
    const response = await fetch('/register_process.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    const result = await response.json()

    if (result.success) {
      alert('Вы успешно зарегистрированы!')
      closeModal('register-modal')
      openModal('login-modal')
    } else {
      alert(result.message || 'Произошла ошибка при регистрации.')
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    alert('Произошла ошибка при регистрации.')
  }
})

// Обработчик формы входа
document.getElementById('login-form').addEventListener('submit', async event => {
  event.preventDefault()

  const username = document.getElementById('logUsername').value.trim()
  const password = document.getElementById('logPassword').value.trim()

  if (!username || !password) {
    alert('Пожалуйста, заполните все поля.')
    return
  }

  try {
    const response = await fetch('/login_process.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const result = await response.json()

    if (result.success) {
      alert('Вы успешно вошли!')
      closeModal('login-modal')
    } else {
      alert(result.message || 'Неверное имя пользователя или пароль.')
    }
  } catch (error) {
    console.error('Ошибка при входе:', error)
    alert('Произошла ошибка при входе.')
  }
})

// Обработчик формы отправки сообщения
messageForm.addEventListener('submit', async event => {
  event.preventDefault()

  const userMessage = messageInput.value.trim()
  if (!userMessage) return

  addMessage(userMessage, true)
  messageInput.value = ''

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completion', {
      method: "POST",
      headers: {
        Authorization: 'Bearer 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',
        'HTTP-Referer': 'https://destroyerver.vercel.app/',
        'X-Title': 'popknsn',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3-base:free',
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    const data = await response.json()
    const botResponse = data.choices?.[0]?.message?.content || 'Я не понял ваш вопрос.'
    addMessage(botResponse, false)
  } catch (error) {
    console.error('Ошибка при общении с API:', error)
    addMessage('Произошла ошибка при общении с нейросетью.', false)
  }
})

// Управление модальными окнами
document.addEventListener('DOMContentLoaded', () => {
  // Кнопки открытия модальных окон
  document.getElementById('register-btn').addEventListener('click', () => openModal('register-modal'))
  document.getElementById('login-btn').addEventListener('click', () => openModal('login-modal'))
  document.getElementById('privacy-policy-btn').addEventListener('click', () => openModal('privacy-policy-modal'))

  // Переключение между формами
  document.getElementById('switch-to-login').addEventListener('click', e => {
    e.preventDefault()
    closeModal('register-modal')
    openModal('login-modal')
  })

  document.getElementById('switch-to-register').addEventListener('click', e => {
    e.preventDefault()
    closeModal('login-modal')
    openModal('register-modal')
  })

  // Закрытие модальных окон
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal')
      closeModal(modal.id)
    })
  })

  // Закрытие при клике вне модального окна
  window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
      closeModal(event.target.id)
    }
  })
})
