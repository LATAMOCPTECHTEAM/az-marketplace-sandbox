import React from 'react';
import { CodeBlock, dracula } from 'react-code-blocks'
function CodeblockInput(props) {
    return (
        <CodeBlock
            text={props.text}
            language={props.language}
            showLineNumbers={props.showLineNumbers}
            wrapLines
        />
    )
}
export default CodeblockInput;