import { marked } from 'marked'

import { defineMDPlugin } from '../index'

function uuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const previewCodeWrapper = (zodString: string) => `
import * as z from 'zod'

export default ${zodString}
`.trim()

export default defineMDPlugin({
  code(code, lang) {
    if (lang?.includes('zodui:preview')) {
      const id = uuid()
      const previewCode = previewCodeWrapper(code)
      return `
      </div>
      <div class='zodui-preview' data-schema-eval-key='${id}' data-code='${
        encodeURIComponent(previewCode)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
      }'>
        <div class='draw-bar'>
          <div class='icon' data-key='StackBlitz' title='open in StackBlitz'>
            <svg viewBox="0 0 28 28" height="24"><path fill="currentColor" d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"></path></svg>
          </div>
          <div class='icon' data-key='CodeSandBox' title='open in CodeSandBox'>
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><path d="m11.5 11.6166v11.1704c.1945 0 .3223-.0422.4969-.1419l8.9445-5.1111c.3531-.2024.4971-.5158.4971-.9229v-10.36419c0-.2042-.043-.32636-.1422-.49691l-9.5102 5.3735c-.1769.1011-.2861.2893-.2861.4931zm4.9691 6.4143c0 .2839-.1064.4259-.3549.5679l-2.9815 1.7037c-.2129.1419-.4969.071-.4969-.213v-7.5957c0-.2032.1788-.4665.3549-.5679l6.8149-3.90429c.1893-.10894.3549.06554.3549.28395v4.04634c0 .2097-.0989.3982-.284.4969l-3.0524 1.6327c-.1851.0987-.355.2871-.355.4969z" fill="currentColor"></path><path d="m1.56152 16.611v-10.36416c0-.40759.21402-.7916.5679-.99383l8.66048-4.898146c.1866-.098883.4969-.141973.7099-.141973s.5415.052741.7099.141975l8.5895 4.898144c.1699.10042.4008.33172.4969.49692l-9.5124 5.39507c-.1769.1011-.2839.2931-.2839.4969v11.1451c-.1945 0-.3933-.0423-.5679-.142l-8.73149-5.0401c-.35389-.2023-.63889-.5863-.63889-.9939zm1.27778-8.30552v4.04632c0 .2839.07099.4259.35494.5679l2.98148 1.7037c.28395.142.35494.3549.35494.5679v2.8395c0 .2839.07099.4259.35494.5679l2.98148 1.7037c.28392.142.49692.071.49692-.213v-7.5956c0-.213-.071-.426-.3549-.5679l-6.67289-3.83338c-.21296-.14197-.49691-.07099-.49691.21296zm11.642-4.82716-2.6266 1.49074c-.2129.14198-.4969.14198-.7098 0l-2.62659-1.49074c-.17289-.09772-.39472-.09722-.5679 0l-3.26543 1.84568c-.28395.14198-.28395.42593 0 .5679l6.53082 3.76235c.1748.10006.3932.10006.5679 0l6.5309-3.76235c.213-.14197.284-.42592 0-.5679l-3.2654-1.84568c-.1732-.09722-.395-.09772-.5679 0z" fill="currentColor"></path></g></svg>
          </div>
          <div class='icon' data-key='Code' title='display code'>
            <div class='material-icons'>code</div>
          </div>
          <div class='icon' data-key='Playground' title='open in Playground'>
            <div class='material-icons'>play_arrow</div>
          </div>
          <div class='icon' data-key='open/close'>
            <div class='material-icons'>chevron_right</div>
          </div>
        </div>
        <div class='wrap'>
          <div class='markdown-body'>
            ${marked(`\`\`\`typescript\n${code}\n\`\`\``)}
          </div>
          <%- include('components/schema-eval', {
            key: '${id}'
          }) %>
        </div>
        <div class='output'>
          <div class='content'></div>
          <span class='material-icons'>expand_more</span>
        </div>
      </div>
      <div class='markdown-body'>`
    }
    return false
  }
}, [
  '/src/builder/marked-plugins/preview.client.ts',
  '/src/components/schema-eval.tsx'
])
