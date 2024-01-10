import { useEffect, useState } from "react"
import { createChoreCompletion, deleteChore, getChores } from "../../managers/choreManager"
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
    deleteChore(id).then(() => getAndSetChores())
  }

  const handleCreateNewChoreBtn = (e) => {
    e.preventDefault()

    navigate("create")
  }

  const handleCompleteBtn = (e, choreId) => {
    e.preventDefault()

    // const userProfileId = loggedInUser.id
    // console.log("choreId", choreId, "userProfileId", userProfileId)
    const userProfileToSend = {
      //id firstname lastname address identityuserid
      id: loggedInUser.id,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      address: loggedInUser.address,
      identityUserId: loggedInUser.identityUserId,
      choreAssignments: [],
      choreCompletions: [],
      identityUser: {}
    }
    createChoreCompletion(choreId, userProfileToSend)
  }

  const daysSinceLastCompletion = (completions) => {
    if (!completions || completions.length === 0) {
      // If there are no completions, assume a large number of days to always render in black
      return 10000;
    }
  
    const today = new Date();
    const lastCompletionDate = new Date(Math.max(...completions.map(cc => new Date(cc.completedOn))));
    const timeDifference = today - lastCompletionDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

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
          </tr>
        </thead>
        <tbody>
          {chores.map((c) => (
            <tr key={c.id} >
              <th scope="row">{`${c.id}`}</th>
              <td style={{ color: daysSinceLastCompletion(c.choreCompletions) > c.choreFrequencyDays ? "red" : "black" }}>{c.name}</td>
              <td>{c.difficulty}</td>
              <td>{c.choreFrequencyDays}</td>
              <td>
                <Button color="info" onClick={e => handleCompleteBtn(e, c.id)}>Complete</Button>
                {loggedInUser.roles.includes("Admin") ? (
                  <><Button
                    color="danger"
                    onClick={e => handleDeleteBtn(e, c.id)}
                  >
                    Delete
                  </Button>
                    <Link to={`${c.id}`}>
                      Details
                    </Link>
                  </>
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