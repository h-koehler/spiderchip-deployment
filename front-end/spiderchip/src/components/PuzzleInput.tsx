import { useRef } from "react";
import "./PuzzleInput.css";
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const PuzzleInput: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const onEditorDidMount: OnMount = (editor, _) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
        });

        editor.getModel()?.updateOptions({ tabSize: 2 });
    }

    return (
        <div className="input-editor-container">
            <div className="editor-wrapper">
                <MonacoEditor
                    onMount={onEditorDidMount}
                    value={initialValue}
                    theme="vs-light"
                    // language="javascript"
                    height="100%"
                    options={{
                        wordWrap: 'on',
                        minimap: { enabled: false },
                        showUnused: false,
                        folding: false,
                        lineNumbersMinChars: 3,
                        fontSize: 16,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    )
}

export default PuzzleInput;