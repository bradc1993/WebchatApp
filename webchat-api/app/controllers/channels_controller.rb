class ChannelsController < ApplicationController
    
    # READ

    def index
        channels = Channel.all
        render json: channels, include: [:messages, :users]
    end

    def show
        channel = Channel.find(params[:id])
        render json: channel
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
