module Api
  module V1
    class AuthController < ApplicationController
      def login
        user = User.find_by(email: params[:email]&.strip&.downcase)

        if user&.authenticate(params[:password])
          render json: {
            token: JwtService.encode(user.id),
            user: { id: user.id, email: user.email }
          }
        else
          render json: { error: "E-mail ou senha inválidos" }, status: :unauthorized
        end
      end

      def me
        token = request.headers["Authorization"]&.split&.last
        payload = JwtService.decode(token)
        user = User.find_by(id: payload&.dig("user_id"))

        if user
          render json: { user: { id: user.id, email: user.email } }
        else
          render json: { error: "Não autorizado" }, status: :unauthorized
        end
      end
    end
  end
end
