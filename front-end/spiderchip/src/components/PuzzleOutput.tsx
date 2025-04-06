import "./PuzzleOutput.css"

interface PuzzleOutputProps {
    output: string;
}

export default function PuzzleOutput({ output }: PuzzleOutputProps) {
    return (
        <div className="output">
            <div className="output-content">
                {output.split('\n').map((line, index) => (
                    <p key={index}>&gt; {line}</p>
                ))}
            </div>
        </div>
    )
}