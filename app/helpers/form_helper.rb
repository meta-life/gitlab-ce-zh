module FormHelper
  def form_errors(model, type: 'form')
    return unless model.errors.any?

    headline   = "该 #{type} 包含了以下错误:"

    content_tag(:div, class: 'alert alert-danger', id: 'error_explanation') do
      content_tag(:h4, headline) <<
        content_tag(:ul) do
          model.errors.full_messages
            .map { |msg| content_tag(:li, msg) }
            .join
            .html_safe
        end
    end
  end

  def issue_assignees_dropdown_options
    {
      toggle_class: 'js-user-search js-assignee-search js-multiselect js-save-user-data',
      title: '选择指派',
      filter: true,
      dropdown_class: 'dropdown-menu-user dropdown-menu-selectable dropdown-menu-assignee',
      placeholder: '搜索用户',
      data: {
        first_user: current_user&.username,
        null_user: true,
        current_user: true,
        project_id: @project.id,
        field_name: 'issue[assignee_ids][]',
        default_label: '未指派',
        'max-select': 1,
        'dropdown-header': '指派给',
        multi_select: true,
        'input-meta': 'name',
        'always-show-selectbox': true,
        current_user_info: current_user.to_json(only: [:id, :name])
      }
    }
  end
end
