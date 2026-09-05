module Api
  module V1
    class DashboardController < ApplicationController
      include Authenticatable

      before_action :authenticate_user!

      def stats
        month_start = Time.current.beginning_of_month

        confirmed_scope = Order.where(status: "confirmado")
        revenue = confirmed_scope.sum(:total).to_f
        confirmed_count = confirmed_scope.count
        avg_ticket = confirmed_count.positive? ? revenue / confirmed_count : 0

        category_rows = OrderItem
          .joins(:order, :product)
          .where(orders: { status: "confirmado" })
          .group("products.category")
          .select(
            "products.category AS category",
            "COUNT(*) AS sold_count",
            "SUM(order_items.price) AS revenue"
          )

        category_stats = category_rows.each_with_object({}) do |row, hash|
          hash[row.category] = {
            count: row.sold_count.to_i,
            revenue: row.revenue.to_f
          }
        end

        render json: {
          revenue: revenue,
          avgTicket: avg_ticket,
          monthOrders: Order.where(created_at: month_start..).count,
          pending: Order.where(status: "enviado").count,
          available: Product.where(available: true).count,
          unavailable: Product.where(available: false).count,
          categoryStats: category_stats
        }
      end
    end
  end
end
