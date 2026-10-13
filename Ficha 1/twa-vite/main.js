import './style.css'

let contador = 10

document.querySelector('#app').innerHTML = `
  <h1>Contador</h1>
  <p>Clica no botão para diminuir o número.</p>
  <button id="counter">Contagem: ${contador}</button>
`

const botao = document.querySelector('#counter')

botao.addEventListener('click', () => {
  if (contador > 0) {
    contador--
  }

  botao.textContent = `Contagem: ${contador}`
  document.title = `Contador: ${contador}`
})
