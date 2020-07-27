class User < ApplicationRecord
    has_many :messages
    has_many :channels, through: :messages

    validates :name, presence: true, uniqueness: true
end
