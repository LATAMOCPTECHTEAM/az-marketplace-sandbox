import React from 'react';
import { CodeBlock, dracula } from 'react-code-blocks'

export default function CodeblockInput(props) {
    return (
        <div style={{ marginTop: "5px", marginBottom: "5px" }}>
            <CodeBlock
                text={props.text}
                language={props.language}
                showLineNumbers={props.showLineNumbers}
                theme={dracula}
            />
        </div>
    )
}