import "./PuzzleOutput.css"
import OutputIcon from "../assets/images/output-icon.png";

interface PuzzleOutputProps {
    output: string;
}

export default function PuzzleOutput({ output }: PuzzleOutputProps) {
    return (
        <div className="output">
            <div className="header">
                <img src={OutputIcon} />
            </div>
            <div className="output-content">
                {output.split('\n').map((line, index) => (
                    <p key={index}>&gt; {line}</p>
                ))}
            </div>
        </div>
    )
}