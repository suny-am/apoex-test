class CreateBeers < ActiveRecord::Migration[7.0]
  def change
    create_table :beers do |t|
      t.integer :uid
      t.string :name, array: true, default []
      t.text :description
      t.float :abv  #Alcohol By Volume
      t.string :food_pairing 

      t.timestamps
    end
  end
end
