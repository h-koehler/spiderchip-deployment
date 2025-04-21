import { SpiderState } from "../language-system/ls-interface-types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSpider } from '@fortawesome/free-solid-svg-icons'
import "./PuzzleVisualization.css"

export default function PuzzleVisualization(props: {
    state: SpiderState
}) {
    const numVars = props.state.varslots.length;
    const gridStyle = {
        gridTemplateColumns: `repeat(${numVars}, 5em)`
    }
    return (
        <div className="viz-container">
            <div className="slot-grid" style={gridStyle}>
                {props.state.varslots.map((slot, i) => (
                    <div className="var-slot filled" key={`var-${i}`} id={`slot-${i + 1}`}>
                        <div>{slot.value}</div>
                        <div>{slot.name}</div>
                    </div>
                ))}

            </div>
            <div className="spider-grid" style={gridStyle}>
                {props.state.varslots.map((slot, i) => {
                    const spiderHere = props.state.line - 1 === i;
                    return (
                        <div className="spider-slot" key={`spider-${i}`}>
                            {spiderHere && props.state.state === 3 ? (
                                <div className="spider-icon">
                                    <FontAwesomeIcon icon={faSpider} size={"2xl"} />
                                    {slot.value}
                                </div>
                            ) : null }
                        </div>
                    )
                })}
            </div>
            <div className="inactive-spider">
                {props.state.state !== 3 ? (
                    <div className="spider-icon">
                        <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
