import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import { MarpWorker } from '../src/index'
import Worker from './marp.worker'

const worker = new Worker()

const largeMd = (baseMd: string) => {
  let markdown = `${baseMd}\n\n---\n<!-- _color: #ccc -->\n`

  for (let i = 0; i < 200; i += 1) markdown += '\n$y=ax^2+bx+c$'
  return markdown
}

const Editor: React.FC<{
  children: (buffer: string) => any
  markdown?: string
}> = props => {
  const { children, markdown } = props
  const [buffer, setBuffer] = useState(markdown || '')
  const handleChange = e => setBuffer(e.target.value)

  return (
    <div style={{ display: 'flex', height: '500px' }}>
      <textarea
        value={buffer}
        onChange={handleChange}
        style={{ flex: 1, fontSize: '18px' }}
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>{children(buffer)}</div>
    </div>
  )
}

storiesOf('MarpWorker', module)
  .add('Basic usage', () => (
    <Editor
      markdown={`
# MarpWorker renderer

This renderer is using Web Worker to convert Marp Markdown.
    `.trim()}
    >
      {markdown => <MarpWorker markdown={markdown} worker={worker} />}
    </Editor>
  ))
  .add('Too large markdown', () => (
    <Editor
      markdown={largeMd(
        `
# Too large markdown

This deck has 200 math typesettings, but it has not blocked UI by conversion.

Besides, it still keeps blazing-fast preview by frame-skipped rendering. Try typing fast! :zap:
        `.trim()
      )}
    >
      {markdown => <MarpWorker markdown={markdown} worker={worker} />}
    </Editor>
  ))
  .add('Custom renderer', () => (
    <Editor
      markdown={largeMd(
        `
# Custom renderer

MarpWorker can specify initial rendering state.
        `.trim()
      )}
    >
      {markdown => (
        <MarpWorker markdown={markdown} worker={worker}>
          {slides =>
            slides ? (
              slides.map(({ slide, comments }, i) => (
                <div key={i} style={{ margin: '40px' }}>
                  <div style={{ boxShadow: '0 5px 10px #ccc' }}>{slide}</div>
                  {comments.map((comment, ci) => (
                    <p key={ci}>{comment}</p>
                  ))}
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )
          }
        </MarpWorker>
      )}
    </Editor>
  ))
