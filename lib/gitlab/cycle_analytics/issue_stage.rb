module Gitlab
  module CycleAnalytics
    class IssueStage < BaseStage
      def start_time_attrs
        @start_time_attrs ||= issue_table[:created_at]
      end

      def end_time_attrs
        @end_time_attrs ||= [issue_metrics_table[:first_associated_with_milestone_at],
                             issue_metrics_table[:first_added_to_board_at]]
      end

      def name
        :issue
      end

      def description
        "一个问题从提出到制定计划的时间"
      end
    end
  end
end