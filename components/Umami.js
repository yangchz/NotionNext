import { siteConfig } from '@/lib/config'
import ExternalScript from './ExternalScript'

/**
 * 一个开源访客统计
 * @see https://github.com/umami-software/umami
 * @returns
 */
export default function Umami() {
  const props = {
    id: '__umamiScript__',
    src: siteConfig('UMAMI_SCRIPT_URL'),
    'data-website-id': siteConfig('UMAMI_WEBSITE_ID'),
  }
  return <ExternalScript {...props}/>
}
