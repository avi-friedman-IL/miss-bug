const { useEffect } = React

export function AppFooter() {
    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer>
            <p></p>
        </footer>
    )
}
