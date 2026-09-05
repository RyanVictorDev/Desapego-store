class Product < ApplicationRecord
  CATEGORIES = %w[vestidos blusas calcas jaquetas shorts acessorios].freeze
  SIZES = %w[P M G GG U].freeze
  CONDITIONS = ["semi nova", "ótimo estado", "como nova"].freeze

  validates :name, :category, :size, :condition, presence: true
  validates :category, inclusion: { in: CATEGORIES }
  validates :size, inclusion: { in: SIZES }
  validates :condition, inclusion: { in: CONDITIONS }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :images, presence: true

  def as_api_json
    {
      id: id.to_s,
      name: name,
      category: category,
      size: size,
      condition: condition,
      price: price.to_f,
      images: images,
      description: description,
      featured: featured,
      available: available
    }
  end
end
