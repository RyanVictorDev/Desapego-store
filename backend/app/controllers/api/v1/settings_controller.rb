module Api
  module V1
    class SettingsController < ApplicationController
      include Authenticatable

      before_action :authenticate_user!, only: [:update]

      def show
        render json: StoreSetting.current.as_api_json
      end

      def update
        setting = StoreSetting.current
        if setting.update(settings_params)
          render json: setting.as_api_json
        else
          render json: { errors: setting.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def settings_params
        params.permit(:whatsapp, :email, hours: [:day, :open, :close, :closed])
      end
    end
  end
end
