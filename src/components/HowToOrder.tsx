import { INSTAGRAM_URL } from '../constants'

const steps = [
  {
    number: '1',
    title: 'Escolha no site',
    text: 'Navegue pelo catálogo, filtre por categoria e tamanho, e escolha a peça que mais combina com você.',
  },
  {
    number: '2',
    title: 'Chame no Direct',
    text: 'Clique em "Quero essa no Direct" — a mensagem já vem pronta. É só colar e enviar no Instagram!',
  },
  {
    number: '3',
    title: 'Retire ou receba',
    text: 'Combine a retirada em Maracanaú ou peça entrega. Simples, rápido e sem complicação.',
  },
]

export default function HowToOrder() {
  return (
    <section className="section how-to-order" id="como-pedir">
      <div className="container">
        <p className="section-label">Como funciona</p>
        <h2 className="section-title">Como fazer seu pedido</h2>

        <div className="steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-text">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="how-cta">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ir para o Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
