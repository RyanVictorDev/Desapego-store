class CreateInitialSchema < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false

      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :products do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.string :size, null: false
      t.string :condition, null: false
      t.decimal :price, precision: 10, scale: 2, null: false, default: 0
      t.json :images, null: false, default: []
      t.text :description, null: false, default: ""
      t.boolean :featured, null: false, default: false
      t.boolean :available, null: false, default: true

      t.timestamps
    end
    add_index :products, :category
    add_index :products, :available

    create_table :orders do |t|
      t.string :status, null: false, default: "enviado"
      t.decimal :total, precision: 10, scale: 2, null: false, default: 0

      t.timestamps
    end
    add_index :orders, :status
    add_index :orders, :created_at

    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :product, foreign_key: true
      t.string :name, null: false
      t.string :size, null: false
      t.decimal :price, precision: 10, scale: 2, null: false

      t.timestamps
    end

    create_table :store_settings do |t|
      t.string :whatsapp, null: false, default: ""
      t.string :email, null: false, default: ""
      t.json :hours, null: false, default: []

      t.timestamps
    end
  end
end
