import { siteContent } from '@/content'
import type { LeyLogicaEditable } from '@/content/types'

export type LeyLogica = LeyLogicaEditable

// Fuente única de verdad: src/content/site.json -> siteContent.leyes
// Mantener compatibilidad con imports existentes (`@/data/logicLaws`)
export const LEYES_LOGICAS: LeyLogica[] = siteContent.leyes as LeyLogica[]

// Re-export para quien importe desde content
export { siteContent }
