import { useEffect, useState } from "react"
import { deleteChore, getChores } from "../../managers/choreManager"
import { Button, Table } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"

export const ChoresList = ({ loggedInUser }) => {
  const [chores, setChores] = useState([])
  const navigate = useNavigate()

  const getAndSetChores = () => {
    getChores().then(arr => setChores(arr))
  }
  // console.log(loggedInUser)
  // const isAdmin = 

  useEffect(() => {
    getAndSetChores()
  }, [])

  const handleDeleteBtn = (e, id) => {
    e.preventDefault();

    console.log(id)
    // deleteChore(id).then(() => getAndSetChores())
  }

  const handleCreateNewChoreBtn = (e) => {
    e.preventDefault()

    navigate("create")
  }

  return (
    <>
      <h2>Chores List</h2>
      <Button color="success" onClick={handleCreateNewChoreBtn}>Create New Chore</Button>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Frequency</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {chores.map((c) => (
            <tr key={c.id}>
              <th scope="row">{`${c.id}`}</th>
              <td>{c.name}</td>
              <td>{c.difficulty}</td>
              <td>{c.choreFrequencyDays}</td>
              <td>
                {loggedInUser.roles.includes("Admin") ? (
                  <><Button
                    color="danger"
                    onClick={e => handleDeleteBtn(e, c.id)}
                  >
                    Delete
                  </Button>
                  <Link to={`${c.id}`}>
                    Details
                  </Link></>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}