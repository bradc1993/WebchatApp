class MessagesController < ApplicationController

    # READ

    def index
        messages = Message.all
        render json: messages
    end

    def show
        message = Message.find(params[:id])
        render json: message
    end

    #CREATE

    def new
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
