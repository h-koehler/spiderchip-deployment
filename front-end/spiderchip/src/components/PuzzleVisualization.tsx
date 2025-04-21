import { SpiderState } from "../language-system/ls-interface-types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSpider } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react";
import { SpiderState, SpiderAnimation } from "../language-system/ls-interface-types"
import "./PuzzleVisualization.css"

export default function PuzzleVisualization(props: {
    state: SpiderState
}) {
    const numVars = props.state.varslots.length;
    const gridStyle = {
        gridTemplateColumns: `repeat(${numVars}, 5em)`
    }
export default function PuzzleVisualization(props: { state: SpiderState, animations: SpiderAnimation[] }) {
    useEffect(() => {
        // DEBUG: showing what our new animations to visualize are
        console.log(props.animations);
    }, [props.animations]);

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
        <div className="viz">
            <h1>Debug Visualization</h1>
            <h2>Slots</h2>
            {
                props.state.varslots.map((v, i) => {
                    return (<h3 key={i}>
                        {v.name ?? "_"} : {v.value}
                    </h3>)
                })
            }
            <h2>Objects</h2>
            {
                props.state.objs.map((o, i) => {
                    return (<h3 key={i}>
                        {o.name} ({o.type}) : [{o.contents.join(",")}]
                    </h3>)
                })
            }
            <h2>Remaining Input</h2>
            <h3>[{props.state.input.join(",")}]</h3>
        </div>
    )
}
