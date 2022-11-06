class CreateBeers < ActiveRecord::Migration[7.0]
  def change
    create_table :beers do |t|
      t.string :name
      t.string :image_url
      t.text :description
      t.float :abv
      t.string :food_pairing

      t.timestamps
    end
  end
end
