// static buttons
import { icon } from '../utilities.js'

const SORT_ICON_SIZE = 16

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
