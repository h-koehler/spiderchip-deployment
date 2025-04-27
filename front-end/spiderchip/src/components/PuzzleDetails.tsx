import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { extraClass?: string, description: string }) {
    return (
        <div className={"details " + (props.extraClass ?? "")}>
            <p>{props.description}</p>
        </div>
    )
}
