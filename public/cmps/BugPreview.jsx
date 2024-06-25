export function BugPreview({ bug }) {
    const color = bug.severity >= 3 ? 'red' : 'gray'

    return (
        <React.Fragment>
            <h4>{bug.title}</h4>
            <h1>🐛</h1>
            <p style={{ color: color }}>
                Severity: <span>{bug.severity}</span>
            </p>
        </React.Fragment>
    )
}
