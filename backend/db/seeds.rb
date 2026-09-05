# frozen_string_literal: true

puts "Seeding..."

User.find_or_create_by!(email: "sara@admin") do |user|
  user.password = "sa1107ra"
end
puts "Admin user: sara@admin / sa1107ra"

StoreSetting.destroy_all
StoreSetting.create!(
  whatsapp: "5585987654321",
  email: "contato@lojadesapegos.com.br",
  hours: StoreSetting.default_hours
)
puts "Store settings created"

PRODUCTS = [
  {
    name: "Vestido floral midi",
    category: "vestidos", size: "M", condition: "semi nova", price: 35,
    featured: true, available: true,
    images: [
      "https://picsum.photos/seed/desapegos-p1a/800/1000",
      "https://picsum.photos/seed/desapegos-p1b/800/1000"
    ],
    description: "Vestido midi com estampa floral delicada, tecido leve e caimento perfeito. Ideal para o dia a dia ou um passeio especial."
  },
  {
    name: "Blusa cropped de linho",
    category: "blusas", size: "P", condition: "ótimo estado", price: 18,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p2/800/1000"],
    description: "Blusa cropped em linho natural, cor off-white. Combina com tudo e é super confortável no calor."
  },
  {
    name: "Calça wide leg caramelo",
    category: "calcas", size: "M", condition: "semi nova", price: 42,
    featured: true, available: false,
    images: ["https://picsum.photos/seed/desapegos-p3/800/1000"],
    description: "Calça wide leg na cor caramelo, cintura alta e tecido fluido. Peça coringa para montar looks elegantes."
  },
  {
    name: "Jaqueta jeans oversized",
    category: "jaquetas", size: "G", condition: "ótimo estado", price: 48,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p4/800/1000"],
    description: "Jaqueta jeans oversized com lavagem clássica. Perfeita para sobrepor looks casuais com estilo."
  },
  {
    name: "Vestido preto básico",
    category: "vestidos", size: "P", condition: "como nova", price: 28,
    featured: false, available: false,
    images: ["https://picsum.photos/seed/desapegos-p5/800/1000"],
    description: "Vestido preto tubo, tamanho justo e versátil. Peça essencial que nunca sai de moda."
  },
  {
    name: "Blusa de seda estampada",
    category: "blusas", size: "M", condition: "semi nova", price: 22,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p6/800/1000"],
    description: "Blusa de seda com estampa geométrica suave. Toque sofisticado para o guarda-roupa."
  },
  {
    name: "Short jeans destroyed",
    category: "shorts", size: "M", condition: "ótimo estado", price: 15,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p7/800/1000"],
    description: "Short jeans com detalhe destroyed na barra. Casual e despojado para o verão."
  },
  {
    name: "Calça mom jeans azul",
    category: "calcas", size: "P", condition: "semi nova", price: 38,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p8/800/1000"],
    description: "Mom jeans azul médio, cintura alta e modelagem confortável. Clássico atemporal."
  },
  {
    name: "Jaqueta de couro sintético",
    category: "jaquetas", size: "M", condition: "semi nova", price: 55,
    featured: true, available: false,
    images: ["https://picsum.photos/seed/desapegos-p9/800/1000"],
    description: "Jaqueta biker em couro sintético preto. Peça statement para elevar qualquer produção."
  },
  {
    name: "Vestido longo listrado",
    category: "vestidos", size: "G", condition: "ótimo estado", price: 45,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p10/800/1000"],
    description: "Vestido longo com listras verticais, visual alongado e elegante. Ótimo para eventos."
  },
  {
    name: "Blusa regata básica",
    category: "blusas", size: "P", condition: "como nova", price: 10,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p11/800/1000"],
    description: "Regata básica em algodão, cor neutra. Peça coringa com preço imbatível."
  },
  {
    name: "Cinto dourado fino",
    category: "acessorios", size: "U", condition: "como nova", price: 12,
    featured: false, available: true,
    images: ["https://picsum.photos/seed/desapegos-p12/800/1000"],
    description: "Cinto fino dourado com fivela delicada. Acessório que transforma looks simples."
  }
].freeze

Order.destroy_all
Product.destroy_all
PRODUCTS.each { |attrs| Product.create!(attrs) }
puts "#{Product.count} products created"

products = Product.all.to_a
[
  { items: [0, 10], status: "confirmado", days_ago: 2 },
  { items: [8], status: "confirmado", days_ago: 5 },
  { items: [2, 6], status: "enviado", days_ago: 1 },
  { items: [4], status: "confirmado", days_ago: 8 },
  { items: [1, 11], status: "cancelado", days_ago: 3 },
  { items: [7], status: "confirmado", days_ago: 12 },
  { items: [5, 3], status: "enviado", days_ago: 0 },
  { items: [9], status: "confirmado", days_ago: 15 }
].each do |seed|
  items = seed[:items].map { |i| products[i] }
  total = items.sum(&:price)
  order = Order.create!(status: seed[:status], total: total, created_at: seed[:days_ago].days.ago)
  items.each do |product|
    order.order_items.create!(
      product: product,
      name: product.name,
      size: product.size,
      price: product.price
    )
  end
end
puts "#{Order.count} orders created"
puts "Seed complete!"
