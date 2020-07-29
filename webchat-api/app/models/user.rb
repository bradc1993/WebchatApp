class User < ApplicationRecord
    has_many :messages
    has_many :channels, -> { distinct }, through: :messages 

    validates :name, presence: true, uniqueness: true
end
