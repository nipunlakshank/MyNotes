import API from "../constants/api"

const getUrl = (endpoint) => {
    return API.root.concat(endpoint)
}

const postData = async (endpoint, body) => {
    return await fetch(getUrl(endpoint), {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(e => console.error(e))
}

const getData = async (endpoint) => {
    return await fetch(getUrl(endpoint), {
        method: 'get',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(res => res.json())
        .catch(e => console.error(e))
}

const deleteData = async (endpoint, body) => {
    return await fetch(getUrl(endpoint), {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(e => console.error(e))
}

const putData = async (endpoint, body) => {
    return await fetch(getUrl(endpoint), {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(e => console.error(e))
}

export { getData, postData, putData, deleteData }