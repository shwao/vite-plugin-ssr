import React from 'react'
import './Navigation.css'
import 'highlight.js/styles/stackoverflow-light.css'
import { Heading } from './infra/headings'

export { Navigation }

function Navigation({ headings }: { headings: Heading[] }) {
  return (
    <div id="navigation" style={{ position: 'relative' }}>
      <NavTree headings={headings} />
      <ScrollOverlay />
    </div>
  )
}
function NavTree({ headings }: { headings: Heading[] }) {
  return (
    <>
      {headings.map((heading) => {
        return (
          <a
            className={'nav-item nav-item-h' + heading.level + (heading.isActive ? ' is-active' : '')}
            href={heading.url || undefined}
          >
            {/*
            <span dangerouslySetInnerHTML={{ __html: title }} />
            */}
            <div>{heading.titleInNav || heading.title}</div>
            <div className="nav-item-addendum">{heading.titleAddendum}</div>
          </a>
        )
      })}
    </>
  )
}

function ScrollOverlay() {
  // const width = '1px'
  // const color = '#aaa'
  return (
    <div
      id="scroll-overlay"
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        left: '0',
        width: '100%',
        /*
        background: `linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to right, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to left, ${color} ${width}, transparent ${width}) 100% 100%,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 0 0,
    linear-gradient(to bottom, ${color} ${width}, transparent ${width}) 100% 0,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 0 100%,
    linear-gradient(to top, ${color} ${width}, transparent ${width}) 100% 100%`,
        //*/
        //borderRight: `5px solid ${color}`,
        borderRight: `3px solid #666`,
        //border: `1px solid ${color}`,
        boxSizing: 'border-box',
        // backgroundColor: 'rgba(0,0,0,0.03)',
        backgroundRepeat: 'no-repeat',

        backgroundSize: '10px 10px'
      }}
    />
  )
}