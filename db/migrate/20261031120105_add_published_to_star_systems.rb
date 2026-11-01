class AddPublishedToStarSystems < ActiveRecord::Migration[8.1]
  def change
    add_column :star_systems,
               :published,
               :boolean,
               default: false,
               null: false
  end
end