class JwtService
  SECRET = ENV.fetch("JWT_SECRET") { Rails.application.secret_key_base }
  EXPIRY = 7.days

  def self.encode(user_id)
    payload = {
      user_id: user_id,
      exp: EXPIRY.from_now.to_i
    }
    JWT.encode(payload, SECRET, "HS256")
  end

  def self.decode(token)
    return nil if token.blank?

    payload, = JWT.decode(token, SECRET, true, algorithm: "HS256")
    payload
  rescue JWT::DecodeError
    nil
  end
end
