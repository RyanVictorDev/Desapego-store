class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product, optional: true

  validates :name, :size, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }

  def as_api_json
    {
      productId: product_id&.to_s,
      name: name,
      size: size,
      price: price.to_f
    }
  end
end
