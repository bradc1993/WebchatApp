class MessageSerializer < ActiveModel::Serializer
  attributes :id, :user, :channel_id, :content
  has_one :user
  has_one :channel
end
