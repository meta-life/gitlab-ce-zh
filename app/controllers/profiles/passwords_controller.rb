class Profiles::PasswordsController < Profiles::ApplicationController
  skip_before_action :check_password_expiration, only: [:new, :create]

  before_action :set_user
  before_action :authorize_change_password!

  layout :determine_layout

  def new
  end

  def create
    unless @user.password_automatically_set || @user.valid_password?(user_params[:current_password])
      redirect_to new_profile_password_path, alert: '必须提供一个有效的当前密码'
      return
    end

    password_attributes = {
      password: user_params[:password],
      password_confirmation: user_params[:password_confirmation],
      password_automatically_set: false
    }

    result = Users::UpdateService.new(current_user, password_attributes.merge(user: @user)).execute

    if result[:status] == :success
      Users::UpdateService.new(current_user, user: @user, password_expires_at: nil).execute

      redirect_to root_path, notice: '密码修改成功'
    else
      render :new
    end
  end

  def edit
  end

  def update
    password_attributes = user_params.select do |key, value|
      %w(password password_confirmation).include?(key.to_s)
    end
    password_attributes[:password_automatically_set] = false

    unless @user.password_automatically_set || @user.valid_password?(user_params[:current_password])
      redirect_to edit_profile_password_path, alert: '必须提供一个有效的当前密码'
      return
    end

    result = Users::UpdateService.new(current_user, password_attributes.merge(user: @user)).execute

    if result[:status] == :success
      flash[:notice] = "密码已成功更新。请使用新密码重新登录"
      redirect_to new_user_session_path
    else
      @user.reload
      render 'edit'
    end
  end

  def reset
    current_user.send_reset_password_instructions
    redirect_to edit_profile_password_path, notice: '已发送重置密码操作的邮件'
  end

  private

  def set_user
    @user = current_user
  end

  def determine_layout
    if [:new, :create].include?(action_name.to_sym)
      'application'
    else
      'profile'
    end
  end

  def authorize_change_password!
    render_404 unless @user.allow_password_authentication?
  end

  def user_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
