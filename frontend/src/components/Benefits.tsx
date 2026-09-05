const benefits = [
  {
    title: 'Ótimo estado',
    text: 'Peças selecionadas, limpas e prontas para usar',
  },
  {
    title: 'A partir de R$ 10',
    text: 'Moda acessível sem abrir mão do estilo',
  },
  {
    title: 'Maracanaú, CE',
    text: 'Retirada local ou entrega a combinar',
  },
]

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Benefícios">
      <div className="container benefits-grid">
        {benefits.map((item) => (
          <div key={item.title} className="benefit-item">
            <span className="benefit-line" aria-hidden="true" />
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
