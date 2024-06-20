const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handelChange({ target }) {
        const name = target.name
        let value = target.value
        console.log('value:', value)
        console.log('name:', name)

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <input
                onChange={handelChange}
                value={txt}
                type="text"
                name="txt"
                id="txt"
                placeholder="search in titles"
            />

            <input
                onChange={handelChange}
                value={minSeverity}
                type="number"
                name="minSeverity"
                id="minSeverity"
                placeholder="min severity"
            />
            <select name="labels" id="" onChange={handelChange}>
                <option value="all">all</option>
                <option value="critical">critical</option>
                <option value="need-CR">need-CR</option>
                <option value="dev-branch">dev-branch</option>
            </select>

            <select name="sortBy" id="" onChange={handelChange}>
                <option value="createdAt">createdAt</option>
                <option value="title">title</option>
                <option value="severity">severity</option>
            </select>
        </section>
    )
}
