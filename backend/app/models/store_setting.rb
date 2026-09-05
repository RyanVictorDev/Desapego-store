class StoreSetting < ApplicationRecord
  def self.current
    first || create!(whatsapp: "", email: "", hours: default_hours)
  end

  def self.default_hours
    [
      { "day" => "Segunda", "open" => "09:00", "close" => "18:00", "closed" => false },
      { "day" => "Terça", "open" => "09:00", "close" => "18:00", "closed" => false },
      { "day" => "Quarta", "open" => "09:00", "close" => "18:00", "closed" => false },
      { "day" => "Quinta", "open" => "09:00", "close" => "18:00", "closed" => false },
      { "day" => "Sexta", "open" => "09:00", "close" => "18:00", "closed" => false },
      { "day" => "Sábado", "open" => "09:00", "close" => "13:00", "closed" => false },
      { "day" => "Domingo", "open" => "", "close" => "", "closed" => true }
    ]
  end

  def as_api_json
    {
      whatsapp: whatsapp,
      email: email,
      hours: hours.map do |h|
        {
          day: h["day"],
          open: h["open"],
          close: h["close"],
          closed: h["closed"]
        }
      end
    }
  end
end
