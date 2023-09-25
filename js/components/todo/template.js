
export default function(data) {
    return `<li><input class='new-todo' type='text' value='${data.content}'>
    <button class='destroy'></button></li>`;
}

