<template>
  <div
    class="pet-avatar-root"
    :class="[statusClass]"
    :style="containerStyle"
  >
    <svg
      class="pet-svg"
      viewBox="0 0 120 120"
      stroke-linecap="round"
      stroke-linejoin="round"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- ==================== 小紫 · 蛞蝓猫 ==================== -->
      <g v-if="type === 'cat'">
        <!-- 尾巴：身体右侧伸出的小问号 -->
        <path d="M 84,100 C 94,99 99,93 96,86" fill="none" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 身体：糯米团 -->
        <path d="M 36,100 C 35,87 46,80 60,80 C 74,80 85,87 84,100 C 84,110 74,114 60,114 C 46,114 36,110 36,100 Z"
              fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 背上的小圆壳 -->
        <circle cx="41" cy="93" r="9" fill="#e8d8f0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 37.5,93 a 3.5,3.5 0 1,1 7,0 a 2,2 0 1,1 -4,0" fill="none" stroke="#3d3d3d" stroke-width="1.6"/>
        <!-- 耳朵 -->
        <path d="M 39,33 L 28,14 L 49,29 Z" fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 81,33 L 92,14 L 71,29 Z" fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 38,28 L 32,19 L 44,26 Z" fill="#ff9ecd"/>
        <path d="M 82,28 L 88,19 L 76,26 Z" fill="#ff9ecd"/>
        <!-- 头部 -->
        <path d="M 60,20 C 79,19 96,36 97,57 C 98,78 82,95 60,96 C 39,97 23,80 22,58 C 21,37 41,21 60,20 Z"
              fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 腮红 -->
        <circle cx="30" cy="70" r="7" fill="#ff9ecd" opacity="0.4"/>
        <circle cx="90" cy="70" r="7" fill="#ff9ecd" opacity="0.4"/>

        <!-- 鼻子：常驻 -->
        <path d="M 56.8,68.5 L 63.2,68.5 L 60,73 Z" fill="#ff9ecd" stroke="#3d3d3d" stroke-width="1.8"/>

        <!-- ==================== 眼睛表情 ==================== -->
        <!-- 睡觉 / 进食：眯眼弧线 -->
        <g v-if="['sleeping', 'eating'].includes(status)">
          <path d="M38 56 Q44 61 50 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M70 56 Q76 61 82 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 开心 / 玩耍：笑眯眯弧线 -->
        <g v-else-if="['happy', 'playing'].includes(status)">
          <path d="M38 56 Q44 51 50 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M70 56 Q76 51 82 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：睁眼 + 眼皮下垂 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <circle cx="44" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="76" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="44" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="76" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="46" cy="52" r="2" fill="#ffffff"/>
          <circle cx="78" cy="52" r="2" fill="#ffffff"/>
          <path d="M38 56 Q44 52 50 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <path d="M70 56 Q76 52 82 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <g v-if="status === 'sad'">
            <circle cx="38" cy="64" r="3" fill="#60a5fa"/>
            <circle cx="82" cy="64" r="3" fill="#60a5fa"/>
          </g>
        </g>
        <!-- 狩猎：锐利斜眼 -->
        <g v-else-if="status === 'hunting'">
          <path d="M38 52 L46 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M82 52 L74 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 死亡：X 眼 -->
        <g v-else-if="status === 'dead'">
          <path d="M38 50 L46 58 M46 50 L38 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M74 50 L82 58 M82 50 L74 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- idle / 默认：正常睁眼 -->
        <g v-else>
          <circle cx="44" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="76" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="44" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="76" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="46" cy="52" r="2" fill="#ffffff"/>
          <circle cx="78" cy="52" r="2" fill="#ffffff"/>
        </g>

        <!-- ==================== 嘴巴表情 ==================== -->
        <!-- 开心 / 玩耍：大笑 -->
        <g v-if="['happy', 'playing'].includes(status)">
          <path d="M 52,77 C 55,82 65,82 68,77" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：委屈嘴 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <path d="M 52,80 C 55,76 65,76 68,80" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 睡觉：小圆嘴 -->
        <g v-else-if="status === 'sleeping'">
          <circle cx="60" cy="76" r="2.5" fill="#3d3d3d"/>
        </g>
        <!-- 狩猎 / 死亡：严肃直线 -->
        <g v-else-if="['hunting', 'dead'].includes(status)">
          <path d="M 54,76 L 66,76" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 进食：咀嚼的椭圆嘴 -->
        <g v-else-if="status === 'eating'">
          <ellipse cx="60" cy="77" rx="5" ry="4" fill="#3d3d3d"/>
        </g>
        <!-- idle：ω 嘴 -->
        <g v-else>
          <path d="M 60,73.5 C 59,77 55,79 52,77 M 60,73.5 C 61,77 65,79 68,77" fill="none" stroke="#3d3d3d" stroke-width="2"/>
        </g>
      </g>

      <!-- ==================== 青鸟 · 风羽鸟 ==================== -->
      <g v-else-if="type === 'bird'">
        <!-- 冠羽：三片小叶子 -->
        <path d="M 57,30 C 54,17 56,8 60,5 C 64,8 66,17 63,30 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 48,31 C 41,23 39,14 43,10 C 48,12 52,22 53,30 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 72,31 C 79,23 81,14 77,10 C 72,12 68,22 67,30 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <!-- 尾羽 -->
        <path d="M 46,96 C 41,100 39,108 43,113 C 48,111 50,103 46,96 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 60,98 C 56,103 56,111 60,114 C 64,111 64,103 60,98 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 74,96 C 70,103 72,111 77,113 C 81,108 79,100 74,96 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <!-- 翅膀 -->
        <path d="M 33,58 C 21,56 12,65 14,76 C 16,87 27,91 34,84 C 38,77 38,66 33,58 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 87,58 C 99,56 108,65 106,76 C 104,87 93,91 86,84 C 82,77 82,66 87,58 Z" fill="#8dd4e0" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 20,66 C 24,70 29,72 34,72 M 21,76 C 25,79 30,80 34,79" fill="none" stroke="#3d3d3d" stroke-width="2"/>
        <path d="M 100,66 C 96,70 91,72 86,72 M 99,76 C 95,79 90,80 86,79" fill="none" stroke="#3d3d3d" stroke-width="2"/>
        <!-- 身体（头身一体圆球） -->
        <path d="M 60,26 C 82,25 101,43 102,64 C 103,86 84,102 60,102 C 36,102 18,86 18,64 C 18,43 38,27 60,26 Z"
              fill="#a8e6f0" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 腮红 -->
        <circle cx="28" cy="68" r="6" fill="#ff9ecd" opacity="0.4"/>
        <circle cx="92" cy="68" r="6" fill="#ff9ecd" opacity="0.4"/>

        <!-- ==================== 眼睛表情 ==================== -->
        <!-- 睡觉 / 进食：眯眼弧线 -->
        <g v-if="['sleeping', 'eating'].includes(status)">
          <path d="M36 60 Q42 65 48 60" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M72 60 Q78 65 84 60" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 开心 / 玩耍：笑眯眯弧线 -->
        <g v-else-if="['happy', 'playing'].includes(status)">
          <path d="M36 60 Q42 55 48 60" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M72 60 Q78 55 84 60" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：睁眼 + 眼皮下垂 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <circle cx="42" cy="60" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="78" cy="60" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="42" cy="58" r="5.5" fill="#3d3d3d"/>
          <circle cx="78" cy="58" r="5.5" fill="#3d3d3d"/>
          <circle cx="44.5" cy="55.5" r="2.2" fill="#ffffff"/>
          <circle cx="80.5" cy="55.5" r="2.2" fill="#ffffff"/>
          <path d="M36 60 Q42 56 48 60" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <path d="M72 60 Q78 56 84 60" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <g v-if="status === 'sad'">
            <circle cx="36" cy="68" r="3" fill="#60a5fa"/>
            <circle cx="84" cy="68" r="3" fill="#60a5fa"/>
          </g>
        </g>
        <!-- 狩猎：锐利斜眼 -->
        <g v-else-if="status === 'hunting'">
          <path d="M36 56 L44 64" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M84 56 L76 64" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 死亡：X 眼 -->
        <g v-else-if="status === 'dead'">
          <path d="M36 54 L44 62 M44 54 L36 62" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M76 54 L84 62 M84 54 L76 62" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- idle / 默认：正常睁眼 -->
        <g v-else>
          <circle cx="42" cy="60" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="78" cy="60" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="42" cy="58" r="5.5" fill="#3d3d3d"/>
          <circle cx="78" cy="58" r="5.5" fill="#3d3d3d"/>
          <circle cx="44.5" cy="55.5" r="2.2" fill="#ffffff"/>
          <circle cx="80.5" cy="55.5" r="2.2" fill="#ffffff"/>
        </g>

        <!-- ==================== 喙表情 ==================== -->
        <!-- 睡觉 / 疲惫 / 狩猎 / 死亡：闭合小喙 -->
        <g v-if="['sleeping', 'tired', 'hunting', 'dead'].includes(status)">
          <path d="M 58,74 L 62,74" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 进食：张开的大喙 -->
        <g v-else-if="status === 'eating'">
          <ellipse cx="60" cy="74" rx="5" ry="5" fill="#ffb347" stroke="#3d3d3d" stroke-width="2"/>
        </g>
        <!-- 默认 / 开心 / 玩耍 / 难过：三角喙 -->
        <g v-else>
          <path d="M 54,69 L 66,69 L 60,77 Z" fill="#ffb347" stroke="#3d3d3d" stroke-width="2"/>
        </g>

        <!-- 小脚爪 -->
        <ellipse cx="49" cy="109" rx="2.6" ry="2" fill="#ffb347" stroke="#3d3d3d" stroke-width="1.6"/>
        <ellipse cx="54.5" cy="110" rx="2.6" ry="2" fill="#ffb347" stroke="#3d3d3d" stroke-width="1.6"/>
        <ellipse cx="65.5" cy="110" rx="2.6" ry="2" fill="#ffb347" stroke="#3d3d3d" stroke-width="1.6"/>
        <ellipse cx="71" cy="109" rx="2.6" ry="2" fill="#ffb347" stroke="#3d3d3d" stroke-width="1.6"/>
      </g>

      <!-- ==================== 赤狐 · 焰尾狐 ==================== -->
      <g v-else-if="type === 'fox'">
        <!-- 大尾巴：火焰形，末端橙红外露 -->
        <path d="M 72,104 C 86,107 100,101 107,90 C 112,81 112,70 109,60 C 106,50 100,44 93,42 C 92,41 90,42 90,44 C 92,50 92,57 89,63 C 86,69 82,74 80,80 C 78,87 75,96 72,104 Z"
              fill="#ffd4a8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 92,42 C 101,43 108,51 110,62 C 104,60 95,52 91,44 Z" fill="#ff6b4a" stroke="#3d3d3d" stroke-width="2"/>
        <path d="M 80,88 C 86,82 90,75 91,68" fill="none" stroke="#3d3d3d" stroke-width="2"/>
        <!-- 耳朵 -->
        <path d="M 37,29 L 22,8 L 51,27 Z" fill="#ffd4a8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 83,29 L 98,8 L 69,27 Z" fill="#ffd4a8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 36,24 L 27,12 L 45,23 Z" fill="#ffffff"/>
        <path d="M 84,24 L 93,12 L 75,23 Z" fill="#ffffff"/>
        <!-- 身体 -->
        <path d="M 42,100 C 42,88 50,83 60,83 C 70,83 78,88 78,100 C 78,108 70,113 60,113 C 50,113 42,108 42,100 Z"
              fill="#ffd4a8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 51,92 C 53,100 56,107 60,109 C 64,107 67,100 69,92 C 65,95.5 55,95.5 51,92 Z" fill="#fff4e6"/>
        <ellipse cx="51" cy="110" rx="4.5" ry="3" fill="#ffd4a8" stroke="#3d3d3d" stroke-width="2"/>
        <ellipse cx="69" cy="110" rx="4.5" ry="3" fill="#ffd4a8" stroke="#3d3d3d" stroke-width="2"/>
        <!-- 头部：上宽下窄圆润三角 -->
        <path d="M 60,23 C 80,23 94,36 93,52 C 92,66 78,81 60,85 C 42,81 28,66 27,52 C 26,36 40,23 60,23 Z"
              fill="#ffd4a8" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 脸颊白毛 -->
        <path d="M 43,61 C 47,72 52,81 60,85 C 68,81 73,72 77,61 C 71,68 49,68 43,61 Z" fill="#fff4e6"/>
        <!-- 腮红 -->
        <circle cx="34" cy="72" r="5" fill="#ff9ecd" opacity="0.4"/>
        <circle cx="86" cy="72" r="5" fill="#ff9ecd" opacity="0.4"/>

        <!-- 鼻子：常驻 -->
        <path d="M 56.5,71 L 63.5,71 L 60,76 Z" fill="#3d3d3d"/>

        <!-- ==================== 眼睛表情 ==================== -->
        <!-- 睡觉 / 进食：眯眼弧线 -->
        <g v-if="['sleeping', 'eating'].includes(status)">
          <path d="M36 56 Q42 61 48 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M72 56 Q78 61 84 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 开心 / 玩耍：笑眯眯弧线 -->
        <g v-else-if="['happy', 'playing'].includes(status)">
          <path d="M36 56 Q42 51 48 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M72 56 Q78 51 84 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：睁眼 + 眼皮下垂 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <circle cx="42" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="78" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <path d="M 31,53 C 29,51 28,49 29,47 M 89,53 C 91,51 92,49 91,47" fill="none" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="42" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="78" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="44" cy="52" r="2" fill="#ffffff"/>
          <circle cx="80" cy="52" r="2" fill="#ffffff"/>
          <path d="M36 56 Q42 52 48 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <path d="M72 56 Q78 52 84 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <g v-if="status === 'sad'">
            <circle cx="36" cy="64" r="3" fill="#60a5fa"/>
            <circle cx="84" cy="64" r="3" fill="#60a5fa"/>
          </g>
        </g>
        <!-- 狩猎：锐利斜眼 -->
        <g v-else-if="status === 'hunting'">
          <path d="M36 52 L44 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M84 52 L76 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 死亡：X 眼 -->
        <g v-else-if="status === 'dead'">
          <path d="M36 50 L44 58 M44 50 L36 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M76 50 L84 58 M84 50 L76 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- idle / 默认：正常睁眼 -->
        <g v-else>
          <circle cx="42" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="78" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <path d="M 31,53 C 29,51 28,49 29,47 M 89,53 C 91,51 92,49 91,47" fill="none" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="42" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="78" cy="54.5" r="5" fill="#3d3d3d"/>
          <circle cx="44" cy="52" r="2" fill="#ffffff"/>
          <circle cx="80" cy="52" r="2" fill="#ffffff"/>
        </g>

        <!-- ==================== 嘴巴表情 ==================== -->
        <!-- 开心 / 玩耍：大笑 -->
        <g v-if="['happy', 'playing'].includes(status)">
          <path d="M 52,77 C 55,82 65,82 68,77" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：委屈嘴 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <path d="M 52,80 C 55,76 65,76 68,80" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 睡觉：小圆嘴 -->
        <g v-else-if="status === 'sleeping'">
          <circle cx="60" cy="78" r="2.5" fill="#3d3d3d"/>
        </g>
        <!-- 狩猎 / 死亡：严肃直线 -->
        <g v-else-if="['hunting', 'dead'].includes(status)">
          <path d="M 54,78 L 66,78" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 进食：咀嚼的椭圆嘴 -->
        <g v-else-if="status === 'eating'">
          <ellipse cx="60" cy="78" rx="5" ry="4" fill="#3d3d3d"/>
        </g>
        <!-- idle：微笑 -->
        <g v-else>
          <path d="M 60,76 C 59,79.5 55,81.5 52,79.5 M 60,76 C 61,79.5 65,81.5 68,79.5" fill="none" stroke="#3d3d3d" stroke-width="2"/>
        </g>
      </g>

      <!-- ==================== 晶晶 · 晶石龙 ==================== -->
      <g v-else-if="type === 'dragon'">
        <!-- 尾巴 + 末端小水晶 -->
        <path d="M 69,105 C 78,110 87,110 91,104 L 94,108 C 89,114 78,115 68,111 Z" fill="#e8d8f0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 90,100 L 97,103 L 93,111 L 87,108 Z" fill="#a855f7" stroke="#3d3d3d" stroke-width="2"/>
        <!-- 翅膀：小蝙蝠翼 -->
        <path d="M 47,90 C 39,82 30,82 25,89 C 30,89 31,92 29,96 C 33,94 37,96 37,100 C 40,96 44,93 47,90 Z"
              fill="#c8a8e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 73,90 C 81,82 90,82 95,89 C 90,89 89,92 91,96 C 87,94 83,96 83,100 C 80,96 76,93 73,90 Z"
              fill="#c8a8e0" stroke="#3d3d3d" stroke-width="2.5"/>
        <!-- 头顶大水晶（头后） -->
        <path d="M 60,3 L 71,17 L 65,31 L 55,31 L 49,17 Z" fill="#a855f7" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 60,5 L 60,29 M 50,17 L 70,17" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
        <!-- 圆角小芽角 -->
        <path d="M 40,29 C 37,21 39,14 44,12 C 49,14 51,21 48,29 Z" fill="#e8d8f0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 72,29 C 69,21 71,14 76,12 C 81,14 83,21 80,29 Z" fill="#e8d8f0" stroke="#3d3d3d" stroke-width="2.5"/>
        <!-- 身体 -->
        <path d="M 44,102 C 44,90 51,85 60,85 C 69,85 76,90 76,102 C 76,110 69,114 60,114 C 51,114 44,110 44,102 Z"
              fill="#e8d8f0" stroke="#3d3d3d" stroke-width="3"/>
        <ellipse cx="60" cy="103" rx="9" ry="7.5" fill="#ffffff"/>
        <!-- 背部小水晶 -->
        <path d="M 70,85 L 78,83 L 75,94 Z" fill="#a855f7" stroke="#3d3d3d" stroke-width="2"/>
        <path d="M 74,96 L 81,95 L 78,104 Z" fill="#a855f7" stroke="#3d3d3d" stroke-width="2"/>
        <!-- 头部：圆润方脑袋 -->
        <path d="M 42,27 C 51,24 69,24 78,27 C 88,31 93,42 93,54 C 93,71 78,86 60,86 C 42,86 27,71 27,54 C 27,42 32,31 42,27 Z"
              fill="#e8d8f0" stroke="#3d3d3d" stroke-width="3"/>
        <!-- 鼻梁隆起线 -->
        <path d="M 60,34 C 60.6,39 60.6,44 60,48" fill="none" stroke="#3d3d3d" stroke-width="1.5" opacity="0.35"/>
        <!-- 腮红 -->
        <circle cx="30" cy="72" r="6" fill="#ff9ecd" opacity="0.4"/>
        <circle cx="90" cy="72" r="6" fill="#ff9ecd" opacity="0.4"/>

        <!-- 鼻孔：常驻 -->
        <circle cx="56" cy="74" r="1.8" fill="#3d3d3d"/>
        <circle cx="64" cy="74" r="1.8" fill="#3d3d3d"/>

        <!-- ==================== 眼睛表情 ==================== -->
        <!-- 睡觉 / 进食：眯眼弧线 -->
        <g v-if="['sleeping', 'eating'].includes(status)">
          <path d="M34 56 Q40 61 46 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M74 56 Q80 61 86 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 开心 / 玩耍：笑眯眯弧线 -->
        <g v-else-if="['happy', 'playing'].includes(status)">
          <path d="M34 56 Q40 51 46 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M74 56 Q80 51 86 56" fill="none" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：睁眼 + 眼皮下垂 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <circle cx="40" cy="56" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="80" cy="56" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <path d="M 31,51 C 34,46 46,46 49,51 M 71,51 C 74,46 86,46 89,51" fill="none" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="40" cy="54" r="5.5" fill="#3d3d3d"/>
          <circle cx="80" cy="54" r="5.5" fill="#3d3d3d"/>
          <circle cx="42.5" cy="51.5" r="2.2" fill="#ffffff"/>
          <circle cx="82.5" cy="51.5" r="2.2" fill="#ffffff"/>
          <path d="M34 56 Q40 52 46 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <path d="M74 56 Q80 52 86 56" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
          <g v-if="status === 'sad'">
            <circle cx="34" cy="64" r="3" fill="#60a5fa"/>
            <circle cx="86" cy="64" r="3" fill="#60a5fa"/>
          </g>
        </g>
        <!-- 狩猎：锐利斜眼 -->
        <g v-else-if="status === 'hunting'">
          <path d="M34 52 L42 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M86 52 L78 60" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- 死亡：X 眼 -->
        <g v-else-if="status === 'dead'">
          <path d="M34 50 L42 58 M42 50 L34 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
          <path d="M78 50 L86 58 M86 50 L78 58" stroke="#3d3d3d" stroke-width="3" stroke-linecap="round"/>
        </g>
        <!-- idle / 默认：正常睁眼 -->
        <g v-else>
          <circle cx="40" cy="56" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="80" cy="56" r="10" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
          <path d="M 31,51 C 34,46 46,46 49,51 M 71,51 C 74,46 86,46 89,51" fill="none" stroke="#3d3d3d" stroke-width="2"/>
          <circle cx="40" cy="54" r="5.5" fill="#3d3d3d"/>
          <circle cx="80" cy="54" r="5.5" fill="#3d3d3d"/>
          <circle cx="42.5" cy="51.5" r="2.2" fill="#ffffff"/>
          <circle cx="82.5" cy="51.5" r="2.2" fill="#ffffff"/>
        </g>

        <!-- ==================== 嘴巴表情 ==================== -->
        <!-- 开心 / 玩耍：大笑（无尖牙） -->
        <g v-if="['happy', 'playing'].includes(status)">
          <path d="M 51,79 C 55,83 65,83 69,79" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 难过 / 疲惫：委屈嘴 -->
        <g v-else-if="['sad', 'tired'].includes(status)">
          <path d="M 51,81 C 55,77 65,77 69,81" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 睡觉：小圆嘴 -->
        <g v-else-if="status === 'sleeping'">
          <circle cx="60" cy="80" r="2.5" fill="#3d3d3d"/>
        </g>
        <!-- 狩猎 / 死亡：严肃直线 -->
        <g v-else-if="['hunting', 'dead'].includes(status)">
          <path d="M 54,80 L 66,80" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- 进食：咀嚼的椭圆嘴 -->
        <g v-else-if="status === 'eating'">
          <ellipse cx="60" cy="80" rx="5" ry="4" fill="#3d3d3d"/>
        </g>
        <!-- idle：微笑 + 小尖牙 -->
        <g v-else>
          <path d="M 51,79 C 55,83 65,83 69,79" fill="none" stroke="#3d3d3d" stroke-width="2"/>
          <path d="M 52,79.5 L 56.5,80.5 L 53.5,85 Z" fill="#ffffff" stroke="#3d3d3d" stroke-width="1.5"/>
          <path d="M 68,79.5 L 63.5,80.5 L 66.5,85 Z" fill="#ffffff" stroke="#3d3d3d" stroke-width="1.5"/>
        </g>
      </g>

      <!-- ==================== 兜底：未知类型按猫渲染 ==================== -->
      <g v-else>
        <path d="M 84,100 C 94,99 99,93 96,86" fill="none" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 36,100 C 35,87 46,80 60,80 C 74,80 85,87 84,100 C 84,110 74,114 60,114 C 46,114 36,110 36,100 Z"
              fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <circle cx="41" cy="93" r="9" fill="#e8d8f0" stroke="#3d3d3d" stroke-width="2.5"/>
        <path d="M 39,33 L 28,14 L 49,29 Z" fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 81,33 L 92,14 L 71,29 Z" fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <path d="M 60,20 C 79,19 96,36 97,57 C 98,78 82,95 60,96 C 39,97 23,80 22,58 C 21,37 41,21 60,20 Z"
              fill="#c8f0d8" stroke="#3d3d3d" stroke-width="3"/>
        <circle cx="44" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
        <circle cx="76" cy="56" r="9" fill="#ffffff" stroke="#3d3d3d" stroke-width="2"/>
        <circle cx="44" cy="54.5" r="5" fill="#3d3d3d"/>
        <circle cx="76" cy="54.5" r="5" fill="#3d3d3d"/>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PetAvatar',

  props: {
    /**
     * 宠物类型
     */
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['cat', 'bird', 'fox', 'dragon'].includes(value)
      }
    },

    /**
     * 宠物状态
     */
    status: {
      type: String,
      default: 'idle',
      validator(value) {
        return ['idle', 'happy', 'sleeping', 'sad', 'tired', 'hunting', 'playing', 'eating', 'dead'].includes(value)
      }
    },

    /**
     * 渲染尺寸（px）
     */
    size: {
      type: Number,
      default: 64
    }
  },

  computed: {
    /**
     * 外层容器样式
     */
    containerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },

    /**
     * 状态 CSS 类
     */
    statusClass() {
      return `status-${this.status}`
    },

    /**
     * 无障碍标签
     */
    ariaLabel() {
      return `${this.type}宠物头像，状态${this.status}`
    }
  }
}
</script>

<style scoped>
.pet-avatar-root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pet-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 状态动画 */
.status-idle .pet-svg {
  animation: breathe 3s ease-in-out infinite;
}

.status-happy .pet-svg {
  animation: happy-bounce 0.6s ease-in-out infinite;
}

.status-sleeping .pet-svg {
  animation: sway 3s ease-in-out infinite;
}

.status-sad .pet-svg {
  animation: shiver 2s ease-in-out infinite;
}

.status-tired .pet-svg {
  animation: breathe 2.5s ease-in-out infinite;
}

.status-hunting .pet-svg {
  animation: shake-fast 0.2s ease-in-out infinite;
}

.status-playing .pet-svg {
  animation: wiggle 0.3s ease-in-out infinite;
}

.status-eating .pet-svg {
  animation: chew 0.25s ease-in-out infinite;
}

.status-dead .pet-svg {
  animation: none;
  transform: rotate(90deg);
  opacity: 0.6;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03) translateY(1px); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.06); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes shiver {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes shake-fast {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes chew {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05) translateY(-2px); }
}
</style>
