<!--
  LanguageSwitcher.vue - 语言切换组件

  这个组件允许用户在中文和英文之间切换
-->

<template>
  <div class="language-switcher">
    <n-dropdown
      :options="languageOptions"
      @select="handleSelect"
      trigger="click"
    >
      <n-button size="small" quaternary class="lang-btn">
        <template #icon>
          <span class="language-flag">{{ currentFlag }}</span>
        </template>
        <span class="lang-name">{{ currentLanguageName }}</span>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { availableLocales } from '../i18n'

export default {
  name: 'LanguageSwitcher',

  setup() {
    const settingsStore = useSettingsStore()

    const currentFlag = computed(() => {
      const locale = availableLocales.find(l => l.code === settingsStore.language)
      return locale?.flag || '🌐'
    })

    const currentLanguageName = computed(() => {
      const locale = availableLocales.find(l => l.code === settingsStore.language)
      return locale?.name || settingsStore.language
    })

    const languageOptions = availableLocales.map(locale => ({
      label: `${locale.flag} ${locale.name}`,
      key: locale.code
    }))

    const handleSelect = (key) => {
      settingsStore.changeLanguage(key)
    }

    return {
      currentFlag,
      currentLanguageName,
      languageOptions,
      handleSelect
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
}

.lang-btn {
  font-size: 12px;
  padding: 4px 8px;
}

.language-flag {
  font-size: 14px;
  margin-right: 2px;
}

.lang-name {
  font-size: 12px;
}
</style>
