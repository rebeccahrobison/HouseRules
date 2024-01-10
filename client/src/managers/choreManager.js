const _apiUrl = "/api/chore"

export const getChores = () => {
  return fetch(_apiUrl).then(res => res.json())
}

export const getChoreById = (id) => {
  return fetch(`${_apiUrl}/${id}`).then(res => res.json())
}

export const deleteChore = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE"
  })
}

export const createChore = (choreObj) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(choreObj),
  }).then(res => res.json())
}

export const createChoreCompletion = (choreId, userProfile) => {
  return fetch(`${_apiUrl}/${choreId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProfile)  
  })
}

export const assignChore = (choreId, userId) => {
  return fetch(`${_apiUrl}/${choreId}/assign?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  })
}

export const unassignChore = (choreId, userId) => {
  return fetch(`${_apiUrl}/${choreId}/unassign?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export const updateChore = (chore) => {
  return fetch(`${_apiUrl}/${chore.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chore)
  })
}