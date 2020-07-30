class UsersController < ApplicationController

    # READ

    def index
        users = User.all
        render json: users
    end

    def show
        user = User.find(params[:id])
        render json: user
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
