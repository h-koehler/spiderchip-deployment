import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSpider } from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState} from "react";
import {SpiderState, SpiderAnimation, SpiderAnimationType} from "../language-system/ls-interface-types"
import "./PuzzleVisualization.css"

export default function PuzzleVisualization(props: { state: SpiderState, animations: SpiderAnimation[] }) {
    const numVars = props.state.varslots.length;
    const gridStyle = {
        gridTemplateColumns: `repeat(${numVars}, 5em)`
    }
    const [spiderPos, setSpiderPos] = useState<number | null>(null);
    const [spiderVals, setSpiderVals] = useState<number[]>([])
    const [currentStep, setCurrentStep] = useState(0);
    const [localVarSlots, setLocalVarSlots] = useState(props.state.varslots)

    useEffect(() => {
        // DEBUG: showing what our new animations to visualize are
        // console.log(props.animations);
        // console.log(props.state.varslots);
        // console.log(localVarSlots);

        if (!props.animations || props.animations.length === 0) {
            setSpiderPos(null);
            setSpiderVals([])
            setCurrentStep(0);
            setLocalVarSlots([...props.state.varslots]);
            return;
        }

        setCurrentStep(0);
        setSpiderFromAnimation(props.animations[0]);

        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (next >= props.animations.length) {
                    clearInterval(interval);
                    return prev;
                }
                setSpiderFromAnimation(props.animations[next]);
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [props.animations]);

    function setSpiderFromAnimation(anim: SpiderAnimation) {
        console.log(SpiderAnimationType[anim.type])
        switch (anim.type) {
            case 1:
                // INPUT: show spider holding value
                setSpiderVals([anim.n]);
                setSpiderPos(null);
                break;
            case 2:
                // LOAD: show spider getting value from slot
                setSpiderVals((prev) => [...prev, anim.n]);
                setSpiderPos(anim.slot);
                break;
            case 3:
                // STORE: show spider putting current value into slot
                setSpiderPos(anim.slot);
                setTimeout(() => {
                    setSpiderVals((prev) => {
                        const newVals = [...prev];
                        newVals.pop();
                        return newVals;
                    });

                    setLocalVarSlots((prev) => {
                        const updated = [...prev];
                        updated[anim.slot] = {
                            ...updated[anim.slot],
                            value: anim.n, // Set the new value
                        };
                        return updated;
                    });
                }, 500);
                break;
            case 4:
                // MATH: show spider performing operation on values it is holding
                setSpiderVals([anim.result])
                break;
            case 0:
            case 10:
                // OUTPUT or HALT: move spider to inactive pos
                setSpiderPos(null);
                break;
        }
    }

    return (
        <div className="viz-container">
            <div className="slot-grid" style={gridStyle}>
                {localVarSlots.map((slot, i) => (
                    <div className="var-slot filled" key={`var-${i}`} id={`slot-${i + 1}`}>
                        <div>{slot.value}</div>
                        <div>{slot.name}</div>
                    </div>
                ))}

            </div>
            <div className="spider-grid" style={gridStyle}>
                {props.state.varslots.map((_, i) => (
                    <div className="spider-slot" key={`spider-${i}`}>
                        {spiderPos === i && (
                            <div className="spider-icon">
                                <FontAwesomeIcon icon={faSpider} size={"2xl"} />
                                {spiderVals.slice(0, 3).map((v, i) => (
                                    <div key={i} className="spider-val-line">{v}</div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="inactive-spider">
                {props.state.state !== 3 || spiderPos == null ? (
                    <div className="spider-icon">
                        <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                        {spiderVals.slice(0, 3).map((v, i) => (
                            <div key={i} className="spider-val-line">{v}</div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
