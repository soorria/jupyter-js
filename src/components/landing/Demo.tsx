import CodeCell from '#src/components/notebook/CodeCell'
import MarkdownCell from '#src/components/notebook/MarkdownCell'
import noop from '#src/utils/noop'
import { Heading } from '@chakra-ui/layout'

const INITIAL_CODE = `import { useState } from 'react'
import 'bulma/css/bulma.css'

const App = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div className="content m-4">
      <h1 className="title">Count: {count}</h1>
      <button className="button is-primary" onClick={() => setCount(count + 1)}>Click me!</button>
    </div>
  )
}

show(<App />)
`

const INITIAL_MARKDOWN = `# Double-Click to Edit

## Here's some lorem ipsum

Natus veniam cumque et vitae consequatur perferendis ipsam et. Et aliquam cupiditate provident voluptatum deleniti ullam voluptatem. Provident magnam dolores amet voluptas qui magnam cumque architecto. Ullam maiores in ipsam alias et quas.

A vitae quo voluptatem earum. Quo adipisci eveniet dolor dolorem dolorem eos veritatis quidem. Eos quidem ex vitae odio. Iusto quam est odit. Consequatur totam nesciunt recusandae minima expedita possimus suscipit beatae. Nisi natus ab fugit quis et possimus officiis enim.
`

const Demo: React.FC = () => {
  return (
    <>
      <Heading as="h2">Try it out</Heading>
      <CodeCell
        initialValue={INITIAL_CODE}
        onDelete={noop}
        onChange={noop}
        onMove={noop}
        cellId="demo"
      />
      <MarkdownCell
        initialValue={INITIAL_MARKDOWN}
        onDelete={noop}
        onChange={noop}
        onMove={noop}
        cellId="demo"
      />
    </>
  )
}

export default Demo
