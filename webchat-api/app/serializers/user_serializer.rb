class UserSerializer < ActiveModel::Serializer
  attributes :id, :name
  # :messages, :channels
  has_many :messages, serializer: MessageSerializer, include_nested_associations: true
  has_many :channels, serializer: ChannelSerializer
end
