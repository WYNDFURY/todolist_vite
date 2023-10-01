
export default function(data) {
    return `
    <li data-id="${data.id}" class="${ data.completed ? 'completed': '' }">
        <div class="view">
            <input class="toggle" type="checkbox" ${ data.completed ? 'checked': '' }/>
            <label>
                ${data.content}
            </label>
            <button class='destroy'></button>
        </div>
    </li>`;
}


