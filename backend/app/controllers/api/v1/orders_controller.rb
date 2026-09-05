module Api
  module V1
    class OrdersController < ApplicationController
      include Authenticatable

      before_action :authenticate_user!, only: %i[index update_status]

      def index
        scope = Order.includes(:order_items).order(created_at: :desc)
        page = [params[:page].to_i, 1].max
        per_page = params[:per_page].present? ? [[params[:per_page].to_i, 1].max, 50].min : 10
        total = scope.count
        orders = scope.offset((page - 1) * per_page).limit(per_page)

        render json: {
          items: orders.map(&:as_api_json),
          meta: {
            page: page,
            perPage: per_page,
            total: total,
            totalPages: total.zero? ? 0 : (total.to_f / per_page).ceil
          }
        }
      end

      def create
        items_params = params.require(:items)
        order = Order.new(status: "enviado")
        total = 0

        Order.transaction do
          items_params.each do |item_param|
            product_id = item_param[:productId] || item_param["productId"]
            product = Product.find(product_id)
            order.order_items.build(
              product: product,
              name: product.name,
              size: product.size,
              price: product.price
            )
            total += product.price
          end
          order.total = total
          order.save!
        end

        render json: order.as_api_json, status: :created
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Produto não encontrado" }, status: :unprocessable_entity
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      def update_status
        order = Order.find_by(id: params[:id].to_s.delete_prefix("ord-"))
        return render json: { error: "Pedido não encontrado" }, status: :not_found unless order

        status = params.require(:status)
        unless Order::STATUSES.include?(status)
          return render json: { error: "Status inválido" }, status: :unprocessable_entity
        end

        if order.update(status: status)
          render json: order.as_api_json
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
