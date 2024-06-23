const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, labels: availableLabels }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handelChange({ target }) {
        const field = target.name
        let value = target.value
        console.log('name:', field)
        console.dir(target)

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }
        console.log('value:', value)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }

    function handleLabelChange({ target }) {
        const { name: label, checked: isChecked } = target

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            pageIdx: 0,
            labels: isChecked
                ? [...prevFilter.labels, label]
                : prevFilter.labels.filter(lbl => lbl !== label),
        }))
    }

    const { txt, minSeverity, labels } = filterByToEdit
    console.log('labels:', labels)
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

            <select name="sortBy" id="" onChange={handelChange}>
                <option value="createdAt">createdAt</option>
                <option value="title">title</option>
                <option value="severity">severity</option>
            </select>

            <input onChange={handelChange} name="checkbox" type="checkbox" />

            <h3>labels:</h3>
            {availableLabels.map(label => (
                <label key={label}>
                    <input
                        type="checkbox"
                        name={label}
                        checked={labels.includes(label)}
                        onChange={handleLabelChange}
                    />
                    {label}
                </label>
            ))}
        </section>
    )
}
