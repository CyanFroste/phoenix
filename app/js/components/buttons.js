// static buttons
import { icon } from '../utilities.js'

const SORT_ICON_SIZE = 16
/**
 *  @param {number} order
 */
export const sortPriority = (order) => `
  <button class="sort-priority">
    Priority ${
      order === 0
        ? icon('no-order', SORT_ICON_SIZE)
        : order === 1
        ? icon('desc', SORT_ICON_SIZE)
        : icon('asc', SORT_ICON_SIZE)
    }
  </button>
`

/**
 *  @param {number} order
 */
export const sortDate = (order) => `
  <button class="sort-date">
    Date ${
      order === 0
        ? icon('no-order', SORT_ICON_SIZE)
        : order === 1
        ? icon('desc', SORT_ICON_SIZE)
        : icon('asc', SORT_ICON_SIZE)
    }
  </button>
`
