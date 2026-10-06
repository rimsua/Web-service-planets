class CreatePlanets < ActiveRecord::Migration[8.1]
  def change
    create_table :planets do |t|
      t.string :name, null: false
      t.string :planet_type, null: false
      t.integer :temperature, null: false
      t.string :atmosphere, null: false
      t.boolean :water, null: false, default: false
      t.references :star_system, null: false, foreign_key: true

      t.timestamps
    end
  end
end
