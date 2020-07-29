class MessagesController < ApplicationController

    # READ

    def index
        messages = Message.all
        render json: messages.to_json(include: [user: { only: [:name]}])
    end

    def show
        message = Message.find(params[:id])
        render json: message
    end

    #CREATE

    def new
        messages = Message.all
        message = Message.new
    end

    def create
    end

    #UPDATE

    def edit
    end

    def update
    end

    #DESTROY

    def destroy
    end

end
