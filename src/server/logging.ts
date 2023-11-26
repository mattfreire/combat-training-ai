import { pino } from 'pino'
import { env } from '~/env.mjs'

export const getLogger = (name: string) => {
  return pino({
    name,
    level: env.PINO_LOG_LEVEL,
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
  })
}
