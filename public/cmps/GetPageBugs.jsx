const { useState, useEffect } = React

export function GetPageBugs({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }

    return (
        <section className="get-page-bugs">
            <button onClick={() => onGetPage(-1)}>-</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => onGetPage(1)}>+</button>
        </section>
    )
}
