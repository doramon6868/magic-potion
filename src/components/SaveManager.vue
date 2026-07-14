<!--
  SaveManager.vue - 存档管理组件

  这个组件提供存档管理的用户界面，包括：
  - 自动存档显示和操作
  - 3个手动存档槽位的管理
  - 存档导入导出功能
  - 加载/保存/删除存档
-->

<template>
  <!--
    存档管理弹窗
    使用 Naive UI 的 Modal 组件
  -->
  <n-modal
    class="save-manager-modal"
    v-model:show="showModal"
    :title="$t('saveManager.title')"
    preset="card"
    style="width: 650px; max-width: 95vw;"
    :mask-closable="false"
  >
    <div class="save-manager">
      <!-- ==================== 自动存档区域 ==================== -->
      <div class="save-section">
        <h3 class="section-title">
          <span class="title-icon">⟳</span>
          {{ $t('saveManager.autoSave.title') }}
        </h3>
        <div
          class="save-item"
          :class="{ active: currentSlotIndex === -1 }"
        >
          <div class="save-info">
            <span class="save-name">
              {{ autoSaveInfo?.meta?.name || $t('saveManager.autoSave.empty') }}
            </span>
            <span class="save-time">
              {{ formatTime(autoSaveInfo?.meta?.updatedAt) }}
            </span>
            <span v-if="autoSaveInfo?.meta?.playTime" class="play-time">
              {{ $t('saveManager.playTime', { time: formattedPlayTime(autoSaveInfo.meta.playTime) }) }}
            </span>
          </div>
          <div class="save-actions">
            <n-button
              size="small"
              type="primary"
              :disabled="!autoSaveInfo"
              @click="loadAutoSave"
            >
              {{ $t('saveManager.autoSave.read') }}
            </n-button>
            <n-button
              size="small"
              :disabled="!autoSaveInfo"
              @click="exportAutoSave"
            >
              {{ $t('saveManager.autoSave.export') }}
            </n-button>
          </div>
        </div>
      </div>

      <!-- ==================== 手动存档槽位 ==================== -->
      <div class="save-section">
        <h3 class="section-title">
          <span class="title-icon">🖫</span>
          {{ $t('saveManager.manualSave.title') }}
        </h3>
        <div
          v-for="(slot, index) in 3"
          :key="index"
          class="save-item"
          :class="{ active: currentSlotIndex === index }"
        >
          <div class="save-info">
            <span class="save-name">
              {{ getSlotInfo(index)?.meta?.name || $t('saveManager.manualSave.emptySlot', { number: index + 1 }) }}
            </span>
            <span class="save-time">
              {{ formatTime(getSlotInfo(index)?.meta?.updatedAt) }}
            </span>
            <span v-if="getSlotInfo(index)?.meta?.playTime" class="play-time">
              {{ $t('saveManager.playTime', { time: formattedPlayTime(getSlotInfo(index).meta.playTime) }) }}
            </span>
          </div>
          <div class="save-actions">
            <n-button
              size="small"
              type="primary"
              @click="handleSaveToSlot(index)"
            >
              {{ getSlotInfo(index) ? $t('saveManager.manualSave.overwrite') : $t('saveManager.manualSave.save') }}
            </n-button>
            <n-button
              size="small"
              :disabled="!getSlotInfo(index)"
              @click="handleLoadFromSlot(index)"
            >
              {{ $t('saveManager.manualSave.load') }}
            </n-button>
            <n-button
              size="small"
              :disabled="!getSlotInfo(index)"
              @click="exportSlot(index)"
            >
              {{ $t('saveManager.manualSave.export') }}
            </n-button>
            <n-button
              size="small"
              type="error"
              :disabled="!getSlotInfo(index)"
              @click="confirmDeleteSlot(index)"
            >
              {{ $t('saveManager.manualSave.delete') }}
            </n-button>
          </div>
        </div>
      </div>

      <!-- ==================== 导入存档 ==================== -->
      <div class="save-section">
        <h3 class="section-title">
          <span class="title-icon">↓</span>
          {{ $t('saveManager.import.title') }}
        </h3>
        <div class="import-area">
          <n-upload
            accept=".json"
            :max="1"
            :custom-request="handleCustomUpload"
            @change="handleImport"
          >
            <n-button>
              <template #icon>
                <span>↓</span>
              </template>
              {{ $t('saveManager.import.button') }}
            </n-button>
          </n-upload>
          <span class="import-hint">{{ $t('saveManager.import.hint') }}</span>
        </div>
      </div>

      <!-- ==================== 底部信息 ==================== -->
      <div class="save-footer">
        <span class="last-save-info" v-if="lastSaveTime">
          {{ $t('saveManager.footer.lastSaved', { time: formatTime(lastSaveTime) }) }}
        </span>
        <span v-else class="last-save-info">{{ $t('saveManager.footer.neverSaved') }}</span>
      </div>
    </div>
  </n-modal>

  <!-- 确认删除对话框 -->
  <n-modal
    v-model:show="showDeleteConfirm"
    preset="dialog"
    :title="$t('saveManager.confirmDelete.title')"
    type="warning"
    :positive-text="$t('ui.delete')"
    :negative-text="$t('ui.cancel')"
    @positive-click="confirmDelete"
  >
    <p>{{ $t('saveManager.confirmDelete.message') }}</p>
    <p v-if="deleteTargetIndex >= 0" class="delete-target">
      {{ $t('saveManager.confirmDelete.slotName') }}: {{ getSlotInfo(deleteTargetIndex)?.meta?.name || $t('saveManager.manualSave.emptySlot', { number: deleteTargetIndex + 1 }) }}
    </p>
  </n-modal>

  <!-- 覆盖确认对话框 -->
  <n-modal
    v-model:show="showOverwriteConfirm"
    preset="dialog"
    :title="$t('saveManager.confirmOverwrite.title')"
    type="warning"
    :positive-text="$t('saveManager.manualSave.overwrite')"
    :negative-text="$t('ui.cancel')"
    @positive-click="confirmOverwrite"
  >
    <p>{{ $t('saveManager.confirmOverwrite.message') }}</p>
    <p v-if="overwriteTargetIndex >= 0" class="overwrite-target">
      {{ $t('saveManager.confirmOverwrite.original') }}: {{ getSlotInfo(overwriteTargetIndex)?.meta?.name || $t('saveManager.manualSave.emptySlot', { number: overwriteTargetIndex + 1 }) }}
    </p>
  </n-modal>
</template>

<script>
/**
 * 导入依赖
 */
import { mapState, mapActions } from 'pinia'
import { useSaveStore } from '../stores/save.js'
import { useNotificationStore } from '../stores/notification.js'
import { useGameStore } from '../stores/game.js'

export default {
  /**
   * 组件名称
   */
  name: 'SaveManager',

  /**
   * 组件数据
   */
  data() {
    return {
      /**
       * showModal: 控制弹窗显示
       */
      showModal: false,

      /**
       * showDeleteConfirm: 控制删除确认对话框
       */
      showDeleteConfirm: false,

      /**
       * deleteTargetIndex: 要删除的槽位索引
       */
      deleteTargetIndex: -1,

      /**
       * showOverwriteConfirm: 控制覆盖确认对话框
       */
      showOverwriteConfirm: false,

      /**
       * overwriteTargetIndex: 要覆盖的槽位索引
       */
      overwriteTargetIndex: -1,

      /**
       * autoSaveInfo: 自动存档信息
       */
      autoSaveInfo: null
    }
  },

  /**
   * 计算属性
   */
  computed: {
    ...mapState(useSaveStore, [
      'currentSlotIndex',
      'saveList',
      'lastSaveTime'
    ])
  },

  /**
   * 监听
   */
  watch: {
    /**
     * 当弹窗打开时，刷新存档列表
     */
    showModal(val) {
      if (val) {
        this.refreshSaveList()
        this.refreshAutoSaveInfo()
      }
    }
  },

  /**
   * 组件方法
   */
  methods: {
    ...mapActions(useSaveStore, [
      'saveToSlot',
      'loadFromSlot',
      'deleteSlot',
      'exportSave',
      'importSave',
      'refreshSaveList',
      'getSlotInfo',
      'loadStorage'
    ]),

    /**
     * formattedPlayTime: 格式化游戏时长
     * 从 store 的 getter 获取
     */
    formattedPlayTime() {
      const saveStore = useSaveStore()
      return saveStore.formattedPlayTime
    },

    /**
     * open: 打开存档管理弹窗
     * 可以通过 ref 调用这个方法
     */
    open() {
      this.showModal = true
    },

    /**
     * close: 关闭存档管理弹窗
     */
    close() {
      this.showModal = false
    },

    /**
     * refreshAutoSaveInfo: 刷新自动存档信息
     */
    refreshAutoSaveInfo() {
      const storage = this.loadStorage()
      this.autoSaveInfo = storage.autoSave
    },

    /**
     * formatTime: 格式化时间戳
     *
     * @param {number} timestamp - 时间戳
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(timestamp) {
      if (!timestamp) return this.$t('saveManager.unsaved')

      try {
        const date = new Date(timestamp)
        const locale = this.$i18n.locale === 'zh-CN' ? 'zh-CN' : 'en-US'
        return date.toLocaleString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return this.$t('saveManager.invalidTime')
      }
    },

    /**
     * handleSaveToSlot: 处理保存到槽位
     *
     * @param {number} index - 槽位索引
     */
    async handleSaveToSlot(index) {
      const notificationStore = useNotificationStore()

      // 如果槽位已有存档，显示确认对话框
      if (this.getSlotInfo(index)) {
        this.overwriteTargetIndex = index
        this.showOverwriteConfirm = true
        return
      }

      // 直接保存
      await this.performSave(index)
    },

    /**
     * confirmOverwrite: 确认覆盖存档
     */
    async confirmOverwrite() {
      if (this.overwriteTargetIndex >= 0) {
        await this.performSave(this.overwriteTargetIndex)
      }
      this.overwriteTargetIndex = -1
    },

    /**
     * performSave: 执行保存操作
     *
     * @param {number} index - 槽位索引
     */
    async performSave(index) {
      const notificationStore = useNotificationStore()

      try {
        await this.saveToSlot(index, `存档 ${index + 1}`)
        notificationStore.success(`已保存到槽位 ${index + 1}`)
      } catch (error) {
        notificationStore.error('保存失败: ' + error.message)
      }
    },

    /**
     * loadAutoSave: 加载自动存档
     */
    async loadAutoSave() {
      const notificationStore = useNotificationStore()

      try {
        await this.loadFromSlot(-1)
        notificationStore.success('已加载自动存档')
        this.close()
      } catch (error) {
        notificationStore.error('加载失败: ' + error.message)
      }
    },

    /**
     * handleLoadFromSlot: 从指定槽位加载存档
     *
     * @param {number} index - 槽位索引
     */
    async handleLoadFromSlot(index) {
      const notificationStore = useNotificationStore()

      try {
        // 调用 store 的 loadFromSlot 方法（通过 mapActions 映射）
        await this.loadFromSlot(index)
        notificationStore.success(`已加载存档: ${this.getSlotInfo(index)?.meta?.name || `槽位 ${index + 1}`}`)
        this.close()
      } catch (error) {
        notificationStore.error('加载失败: ' + error.message)
      }
    },

    /**
     * exportAutoSave: 导出自动存档
     */
    exportAutoSave() {
      const notificationStore = useNotificationStore()

      try {
        this.exportSave(-1)
        notificationStore.success('已导出自动存档')
      } catch (error) {
        notificationStore.error('导出失败: ' + error.message)
      }
    },

    /**
     * exportSlot: 导出指定槽位的存档
     *
     * @param {number} index - 槽位索引
     */
    exportSlot(index) {
      const notificationStore = useNotificationStore()

      try {
        this.exportSave(index)
        notificationStore.success(`已导出存档: ${this.getSlotInfo(index)?.meta?.name || `槽位 ${index + 1}`}`)
      } catch (error) {
        notificationStore.error('导出失败: ' + error.message)
      }
    },

    /**
     * confirmDeleteSlot: 确认删除槽位
     *
     * @param {number} index - 槽位索引
     */
    confirmDeleteSlot(index) {
      this.deleteTargetIndex = index
      this.showDeleteConfirm = true
    },

    /**
     * confirmDelete: 确认删除存档
     */
    confirmDelete() {
      const notificationStore = useNotificationStore()

      if (this.deleteTargetIndex >= 0) {
        try {
          this.deleteSlot(this.deleteTargetIndex)
          notificationStore.success('存档已删除')
        } catch (error) {
          notificationStore.error('删除失败: ' + error.message)
        }
      }

      this.deleteTargetIndex = -1
    },

    /**
     * handleCustomUpload: 处理自定义上传请求
     * 阻止默认上传行为
     */
    handleCustomUpload({ file, onFinish }) {
      // 我们不使用默认上传，而是在 onChange 中处理
      onFinish()
    },

    /**
     * handleImport: 处理导入存档
     *
     * @param {Object} options - 上传选项
     */
    async handleImport({ fileList }) {
      const notificationStore = useNotificationStore()

      if (!fileList || fileList.length === 0) return

      const file = fileList[0].file
      if (!file) return

      // 找到第一个空槽位，如果没有则使用槽位0
      let targetSlot = 0
      for (let i = 0; i < 3; i++) {
        if (!this.getSlotInfo(i)) {
          targetSlot = i
          break
        }
      }

      try {
        await this.importSave(file, targetSlot)
        notificationStore.success(`存档已导入到槽位 ${targetSlot + 1}`)
        this.refreshSaveList()
      } catch (error) {
        notificationStore.error('导入失败: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
/**
 * 存档管理器样式
 * 书架/魔法书风格，使用设计 token
 */

/* 弹窗卡片：卷轴/书架风格 */
.save-manager-modal :deep(.n-card) {
  background: linear-gradient(135deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
  border: 4px solid var(--mp-purple);
  border-radius: var(--mp-radius-lg);
  box-shadow: var(--mp-shadow-hover);
}

.save-manager-modal :deep(.n-card-header) {
  border-bottom: 2px solid color-mix(in srgb, var(--mp-purple) 30%, transparent);
}

/* 存档管理容器 */
.save-manager {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 存档区域 */
.save-section {
  background: color-mix(in srgb, var(--mp-purple) 8%, transparent);
  border-radius: var(--mp-radius-md);
  padding: 15px;
  border: 2px solid color-mix(in srgb, var(--mp-purple) 20%, transparent);
}

/* 区域标题 */
.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--mp-ink);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.title-icon {
  font-size: 18px;
  color: var(--mp-purple);
}

/* 存档项目 */
.save-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: var(--mp-white);
  border-radius: var(--mp-radius-md);
  margin-bottom: 10px;
  border: 3px solid transparent;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-normal) ease;
}

.save-item:last-child {
  margin-bottom: 0;
}

.save-item.active {
  border-color: var(--mp-purple);
  background: var(--mp-purple-soft);
}

/* 存档信息 */
.save-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.save-name {
  font-weight: 700;
  color: var(--mp-ink);
  font-size: 15px;
}

.save-time {
  font-size: 13px;
  color: var(--mp-text-muted);
}

.play-time {
  font-size: 12px;
  color: var(--mp-purple);
  font-weight: 600;
}

/* 存档操作按钮 */
.save-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* 导入区域 */
.import-area {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.import-hint {
  font-size: 13px;
  color: var(--mp-text-muted);
}

/* 底部信息 */
.save-footer {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  border-top: 2px solid color-mix(in srgb, var(--mp-purple) 20%, transparent);
}

.last-save-info {
  font-size: 13px;
  color: var(--mp-text-muted);
}

/* 删除/覆盖提示 */
.delete-target,
.overwrite-target {
  margin-top: 10px;
  padding: 10px;
  background: color-mix(in srgb, var(--mp-gold) 20%, transparent);
  border-radius: var(--mp-radius-md);
  font-weight: 600;
  color: var(--mp-ink);
  border: 2px solid color-mix(in srgb, var(--mp-gold) 40%, transparent);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .save-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .save-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
