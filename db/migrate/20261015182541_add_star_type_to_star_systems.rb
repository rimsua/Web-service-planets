class AddStarTypeToStarSystems < ActiveRecord::Migration[8.1]
  def change
    add_column :star_systems,
               :star_type,
               :string,
               null: false,
               default: "G"
  end
end
