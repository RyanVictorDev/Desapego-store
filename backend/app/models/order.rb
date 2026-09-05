class Order < ApplicationRecord
  STATUSES = %w[enviado confirmado cancelado].freeze

  has_many :order_items, dependent: :destroy

  validates :status, inclusion: { in: STATUSES }
  validates :total, numericality: { greater_than_or_equal_to: 0 }

  def as_api_json
    {
      id: "ord-#{id}",
      items: order_items.map(&:as_api_json),
      total: total.to_f,
      status: status,
      createdAt: created_at.iso8601
    }
  end
end
