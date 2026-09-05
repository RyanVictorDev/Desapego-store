const steps = [
  {
    number: '1',
    title: 'Escolha no site',
    text: 'Navegue pelo catálogo, filtre por categoria e tamanho, e escolha a peça que mais combina com você.',
  },
  {
    number: '2',
    title: 'Adicione ao carrinho',
    text: 'Clique em "Adicionar ao carrinho" na peça desejada. Você pode montar seu pedido com várias peças.',
  },
  {
    number: '3',
    title: 'Finalize no WhatsApp',
    text: 'Abra o carrinho, confira os itens e clique em "Finalizar no WhatsApp". A mensagem já vem pronta!',
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
      </div>
    </section>
  )
}
