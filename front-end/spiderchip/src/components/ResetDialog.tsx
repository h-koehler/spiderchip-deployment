import "./ResetDialog.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

export default function ResetDialog( props: {
    onYes: () => void,
    onNo: () => void
}) {
    return (
        <div className="reset-container">
            <div className="reset-menu">
                <div className="header">
                    <FontAwesomeIcon icon={faTriangleExclamation} size="2x" color={"white"}/>
                </div>
                <div className="reset-content">
                    <h3>Warning!</h3>
                    <p>Reseting your level progress is permanent.</p>
                    <p>Are you sure you want to reset your progress?</p>
                    <div className="button-row">
                        <button className="primary-button" onClick={props.onYes}>Yes, reset my progress</button>
                        <button className="primary-button" onClick={props.onNo}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}