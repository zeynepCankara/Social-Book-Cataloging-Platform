import React from 'react'

export default function Progress({progress}) {
    // TODO: Use Material UI Slider to show progresses better
    return (
        <div>
            {progress.map(e => {
                return <div>
                    {`pageNumber: ${e.pageNumber}, date: ${e.date}`}
                </div>
            })}
        </div>
    )
}
