module Api
  module V1
    class ProductsController < ApplicationController
      include Authenticatable

      before_action :authenticate_user!, only: %i[create update destroy]
      before_action :set_product, only: %i[update destroy]

      def index
        scope = Product.order(created_at: :asc)

        if params[:page].present?
          render json: paginated_products(filter_products(scope))
        else
          render json: scope.map(&:as_api_json)
        end
      end

      def create
        product = Product.new(product_params)
        if product.save
          render json: product.as_api_json, status: :created
        else
          render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @product.update(product_params)
          render json: @product.as_api_json
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @product.destroy
        head :no_content
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end

      def filter_products(scope)
        if params[:search].present?
          term = ActiveRecord::Base.sanitize_sql_like(params[:search].to_s.strip)
          scope = scope.where("name ILIKE ?", "%#{term}%")
        end

        if params[:category].present? && params[:category] != "all"
          scope = scope.where(category: params[:category])
        end

        if params[:available].present? && params[:available] != "all"
          scope = scope.where(available: params[:available] == "true")
        end

        scope
      end

      def paginated_products(scope)
        page = [params[:page].to_i, 1].max
        per_page = params[:per_page].present? ? [[params[:per_page].to_i, 1].max, 50].min : 10
        total = scope.count
        items = scope.offset((page - 1) * per_page).limit(per_page).map(&:as_api_json)

        {
          items: items,
          meta: {
            page: page,
            perPage: per_page,
            total: total,
            totalPages: total.zero? ? 0 : (total.to_f / per_page).ceil,
            summary: {
              total: Product.count,
              available: Product.where(available: true).count
            }
          }
        }
      end

      def product_params
        permitted = params.permit(
          :name, :category, :size, :condition, :price,
          :description, :featured, :available,
          images: []
        )
        permitted[:price] = permitted[:price].to_d if permitted[:price]
        permitted
      end
    end
  end
end
