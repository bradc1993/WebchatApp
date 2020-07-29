class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :messages, :channels

end
