import { useEffect, useRef } from "react";
import "./PuzzleOutput.css"

interface PuzzleOutputProps {
    output: string;
}

export default function PuzzleOutput({ output }: PuzzleOutputProps) {
    const end = useRef<HTMLDivElement>(null);

    const outputs = output.split('\n');

    useEffect(() => {
        end.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [outputs.length]);

    return (
        <div className="output">
            <div className="output-content">
                {outputs.map((line, index) => (
                    <p key={index}>&gt; {line}</p>
                ))}
                <div ref={end} />
            </div>
        </div>
    )
}
