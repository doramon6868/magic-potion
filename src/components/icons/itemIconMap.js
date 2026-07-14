import CookieIcon from './items/CookieIcon.vue'
import CandyIcon from './items/CandyIcon.vue'
import CakeIcon from './items/CakeIcon.vue'
import WaterIcon from './items/WaterIcon.vue'
import ToyIcon from './items/ToyIcon.vue'
import PotionIcon from './items/PotionIcon.vue'
import ScrollIcon from './items/ScrollIcon.vue'
import AmuletIcon from './items/AmuletIcon.vue'
import FirstAidIcon from './items/FirstAidIcon.vue'
import ReviveIcon from './items/ReviveIcon.vue'
import LuckyCharmIcon from './items/LuckyCharmIcon.vue'
import HourglassIcon from './items/HourglassIcon.vue'
import FragmentIcon from './items/FragmentIcon.vue'

/**
 * 物品 key 到 SVG 图标组件的映射
 * 用于 Item.vue 动态渲染对应图标
 */
export const itemIconMap = {
  magic_cookie: CookieIcon,
  rainbow_candy: CandyIcon,
  magic_cake: CakeIcon,
  water: WaterIcon,
  joy_toy: ToyIcon,
  stamina_potion: PotionIcon,
  combat_ration: PotionIcon,
  rainbow_potion: PotionIcon,
  exp_scroll: ScrollIcon,
  amulet: AmuletIcon,
  first_aid_kit: FirstAidIcon,
  revive_potion: ReviveIcon,
  lucky_charm: LuckyCharmIcon,
  time_hourglass: HourglassIcon,
  common_potion: PotionIcon,
  uncommon_potion: PotionIcon,
  rare_potion: PotionIcon,
  epic_potion: PotionIcon,
  cat_fragment: FragmentIcon,
  bird_fragment: FragmentIcon,
  fox_fragment: FragmentIcon,
  dragon_fragment: FragmentIcon
}

/**
 * 碎片 key 到宠物类型的映射
 * 用于 FragmentIcon 选择对应颜色
 */
export const fragmentTypes = {
  cat_fragment: 'cat',
  bird_fragment: 'bird',
  fox_fragment: 'fox',
  dragon_fragment: 'dragon'
}
