import tooltip from '../../vue_shared/directives/tooltip';
import { pluralize } from '../../lib/utils/text_utility';

export default {
  name: 'MRWidgetHeader',
  props: {
    mr: { type: Object, required: true },
  },
  directives: {
    tooltip,
  },
  computed: {
    shouldShowCommitsBehindText() {
      return this.mr.divergedCommitsCount > 0;
    },
    commitsText() {
      return pluralize('commit', this.mr.divergedCommitsCount);
    },
    branchNameClipboardData() {
      // This supports code in app/assets/javascripts/copy_to_clipboard.js that
      // works around ClipboardJS limitations to allow the context-specific
      // copy/pasting of plain text or GFM.
      return JSON.stringify({
        text: this.mr.sourceBranch,
        gfm: `\`${this.mr.sourceBranch}\``,
      });
    },
  },
  methods: {
    isBranchTitleLong(branchTitle) {
      return branchTitle.length > 32;
    },
  },
  template: `
    <div class="mr-source-target">
      <div class="normal">
        <strong>
          Request to merge
          <span
            class="label-branch"
            :class="{'label-truncated': isBranchTitleLong(mr.sourceBranch)}"
            :title="isBranchTitleLong(mr.sourceBranch) ? mr.sourceBranch : ''"
            data-placement="bottom"
            :v-tooltip="isBranchTitleLong(mr.sourceBranch)"
            v-html="mr.sourceBranchLink"></span>
          <button
            v-tooltip
            class="btn btn-transparent btn-clipboard"
            data-title="Copy branch name to clipboard"
            :data-clipboard-text="branchNameClipboardData">
            <i
              aria-hidden="true"
              class="fa fa-clipboard"></i>
          </button>
          into
          <span
            class="label-branch"
            :v-tooltip="isBranchTitleLong(mr.sourceBranch)"
            :class="{'label-truncatedtooltip': isBranchTitleLong(mr.targetBranch)}"
            :title="isBranchTitleLong(mr.targetBranch) ? mr.targetBranch : ''"
            data-placement="bottom">
            <a :href="mr.targetBranchTreePath">{{mr.targetBranch}}</a>
          </span>
        </strong>
        <span
          v-if="shouldShowCommitsBehindText"
          class="diverged-commits-count">
          (<a :href="mr.targetBranchPath">{{mr.divergedCommitsCount}} {{commitsText}} behind</a>)
        </span>
      </div>
      <div v-if="mr.isOpen">
        <a
          href="#modal_merge_info"
          data-toggle="modal"
          class="btn btn-sm inline">
          检出分支
        </a>
        <span class="dropdown prepend-left-10">
          <a
            class="btn btn-sm inline dropdown-toggle"
            data-toggle="dropdown"
            aria-label="Download as"
            role="button">
            <i
              class="fa fa-download"
              aria-hidden="true">
            </i>
            <i
              class="fa fa-caret-down"
              aria-hidden="true">
            </i>
          </a>
          <ul class="dropdown-menu dropdown-menu-align-right">
            <li>
              <a
                :href="mr.emailPatchesPath"
                download>
                电子邮件补丁
              </a>
            </li>
            <li>
              <a
                :href="mr.plainDiffPath"
                download>
                差异文件
              </a>
            </li>
          </ul>
        </span>
      </div>
    </div>
  `,
};