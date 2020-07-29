# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Channel.destroy_all
Message.destroy_all

# must run rails db:drop:all and re-migrate/seed

User.create(name: "Brad") #1
User.create(name: "Michael") #2
User.create(name: "Steven") #3

Channel.create(title: "Flatiron") #1
Channel.create(title: "Off-topic") #2

Message.create!(content: "this is hard", user_id: 1, channel_id: 1)
Message.create!(content: "brad sucks at coding lol", user_id: 3, channel_id: 2)
Message.create!(content: "test", user_id: 1, channel_id: 1)
Message.create!(content: "testing", user_id: 1, channel_id: 2)
Message.create!(content: "hello", user_id: 2, channel_id: 1)