class Groups::GroupMembersController < Groups::ApplicationController
  include MembershipActions
  include SortingHelper

  # Authorize
  before_action :authorize_admin_group_member!, except: [:index, :leave, :request_access]

  def index
    @sort = params[:sort].presence || sort_value_name
    @project = @group.projects.find(params[:project_id]) if params[:project_id]

    @members = GroupMembersFinder.new(@group).execute
    @members = @members.non_invite unless can?(current_user, :admin_group, @group)
    @members = @members.search(params[:search]) if params[:search].present?
    @members = @members.sort(@sort)
    @members = @members.page(params[:page]).per(50)
    @members.includes(:user)

    @requesters = AccessRequestsFinder.new(@group).execute(current_user)

    @group_member = @group.group_members.new
  end

  def update
    @group_member = @group.group_members.find(params[:id])

    return render_403 unless can?(current_user, :update_group_member, @group_member)

    @group_member.update_attributes(member_params)
  end

  def resend_invite
    redirect_path = group_group_members_path(@group)

    @group_member = @group.group_members.find(params[:id])

    if @group_member.invite?
      @group_member.resend_invite

      redirect_to redirect_path, notice: '邀请重发成功。'
    else
      redirect_to redirect_path, alert: '邀请已经被接受。'
    end
  end

  protected

  def member_params
    params.require(:group_member).permit(:access_level, :user_id, :expires_at)
  end

  # MembershipActions concern
  alias_method :membershipable, :group
end
