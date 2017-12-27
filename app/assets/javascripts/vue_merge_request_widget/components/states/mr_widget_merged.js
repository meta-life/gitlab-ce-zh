import Flash from '../../../flash';
import mrWidgetAuthorTime from '../../components/mr_widget_author_time';
import tooltip from '../../../vue_shared/directives/tooltip';
import loadingIcon from '../../../vue_shared/components/loading_icon.vue';
import statusIcon from '../mr_widget_status_icon';
import eventHub from '../../event_hub';

export default {
  name: 'MRWidgetMerged',
  props: {
    mr: { type: Object, required: true },
    service: { type: Object, required: true },
  },
  data() {
    return {
      isMakingRequest: false,
    };
  },
  directives: {
    tooltip,
  },
  components: {
    'mr-widget-author-and-time': mrWidgetAuthorTime,
    loadingIcon,
    statusIcon,
  },
  computed: {
    shouldShowRemoveSourceBranch() {
      const { sourceBranchRemoved, isRemovingSourceBranch, canRemoveSourceBranch } = this.mr;

      return !sourceBranchRemoved && canRemoveSourceBranch &&
        !this.isMakingRequest && !isRemovingSourceBranch;
    },
    shouldShowSourceBranchRemoving() {
      const { sourceBranchRemoved, isRemovingSourceBranch } = this.mr;
      return !sourceBranchRemoved && (isRemovingSourceBranch || this.isMakingRequest);
    },
    shouldShowMergedButtons() {
      const { canRevertInCurrentMR, canCherryPickInCurrentMR, revertInForkPath,
        cherryPickInForkPath } = this.mr;

      return canRevertInCurrentMR || canCherryPickInCurrentMR ||
        revertInForkPath || cherryPickInForkPath;
    },
  },
  methods: {
    removeSourceBranch() {
      this.isMakingRequest = true;
      this.service.removeSourceBranch()
        .then(res => res.json())
        .then((res) => {
          if (res.message === 'Branch was removed') {
            eventHub.$emit('MRWidgetUpdateRequested', () => {
              this.isMakingRequest = false;
            });
          }
        })
        .catch(() => {
          this.isMakingRequest = false;
          new Flash('出现错误，请稍后重试。'); // eslint-disable-line
        });
    },
  },
  template: `
    <div class="mr-widget-body media">
      <status-icon status="success" />
      <div class="media-body">
        <div class="space-children">
          <mr-widget-author-and-time
            actionText="合并者"
            :author="mr.mergedEvent.author"
            :date-title="mr.mergedEvent.updatedAt"
            :date-readable="mr.mergedEvent.formattedUpdatedAt" />
          <a
            v-if="mr.canRevertInCurrentMR"
            v-tooltip
            class="btn btn-close btn-xs"
            href="#modal-revert-commit"
            data-toggle="modal"
            data-container="body"
            title="撤销这个合并请求到一个新的合并请求">
            撤销
          </a>
          <a
            v-else-if="mr.revertInForkPath"
            v-tooltip
            class="btn btn-close btn-xs"
            data-method="post"
            :href="mr.revertInForkPath"
            title="撤销这个合并请求到一个新的合并请求">
            撤销
          </a>
          <a
            v-if="mr.canCherryPickInCurrentMR"
            v-tooltip
            class="btn btn-default btn-xs"
            href="#modal-cherry-pick-commit"
            data-toggle="modal"
            data-container="body"
            title="摘取(Cherry-Pick)这个合并请求到一个新的合并请求">
            摘取(Cherry-Pick)
          </a>
          <a
            v-else-if="mr.cherryPickInForkPath"
            v-tooltip
            class="btn btn-default btn-xs"
            data-method="post"
            :href="mr.cherryPickInForkPath"
            title="摘取(Cherry-Pick)这个合并请求到一个新的合并请求">
            摘取(Cherry-Pick)
          </a>
        </div>
        <section class="mr-info-list">
          <p>
            The changes were merged into
            <span class="label-branch">
              <a :href="mr.targetBranchPath">{{mr.targetBranch}}</a>
            </span>
          </p>
          <p v-if="mr.sourceBranchRemoved">源分支已经被删除。</p>
          <p v-if="shouldShowRemoveSourceBranch" class="space-children">
            <span>您现在可以删除源分支。</span>
            <button
              @click="removeSourceBranch"
              :disabled="isMakingRequest"
              type="button"
              class="btn btn-xs btn-default js-remove-branch-button">
              删除源分支。
            </button>
          </p>
          <p v-if="shouldShowSourceBranchRemoving">
            <loading-icon inline />
            <span>正在删除源分支。</span>
          </p>
        </section>
      </div>
    </div>
  `,
};
