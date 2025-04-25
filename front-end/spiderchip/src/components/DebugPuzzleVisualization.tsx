import { SpiderState } from "../language-system/ls-interface-types"
import "./DebugPuzzleVisualization.css"

export default function DebugPuzzleVisualization(props: { state: SpiderState }) {
    return (
        <div className="debug-viz">
            <h3>Slots</h3>
            <table className="slot-visualizer">
                <tbody>
                    <tr>
                        {props.state.varslots.map((v, i) => {
                            return (<td key={i}><p>
                                {v.value}
                            </p></td>)
                        })}
                    </tr>
                    <tr>
                        {props.state.varslots.map((v, i) => {
                            return (<td key={i}><p>
                                {v.name ?? ""}
                            </p></td>)
                        })}
                    </tr>
                </tbody>
            </table>
            <h3>Objects</h3>
            <table className="object-visualizer">
                <tbody>
                    {props.state.objs.map((o, i) => {
                        return (<tr key={i}>
                            <td><p>{o.name} ({o.type})</p></td>
                            <td><p>{o.contents.length > 0 ? o.contents.join(", ") : "empty"}</p></td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <h3>Remaining Input</h3>
            <p>{props.state.input.join(", ")}</p>
        </div>
    )
}
