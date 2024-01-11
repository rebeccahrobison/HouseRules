import { useEffect, useState } from "react"
import { createChoreCompletion, getChores } from "../../managers/choreManager"
import { Link, useParams } from "react-router-dom";
import { Button, Table } from "reactstrap";

export const UserChores = ({ loggedInUser }) => {
  const [chores, setChores] = useState([])
  const [userChores, setUserChores] = useState([])

  const getAndSetChores = () => {
    getChores().then(arr => setChores(arr))
  }

  useEffect(() => {
    getAndSetChores()
  }, [])

  useEffect(() => {
    const foundUserChores = chores?.filter(c => c.choreAssignments.some(ca => ca.userProfileId === loggedInUser.id && c.isOverdue))
    setUserChores(foundUserChores)
  }, [chores, loggedInUser])

  const handleCompleteBtn = (e, choreId) => {
    e.preventDefault()

    // const userProfileId = loggedInUser.id
    // console.log("choreId", choreId, "userProfileId", userProfileId)
    const userProfileToSend = {
      id: loggedInUser.id,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      address: loggedInUser.address,
      identityUserId: loggedInUser.identityUserId,
      choreAssignments: [],
      choreCompletions: [],
      identityUser: {}
    }
    createChoreCompletion(choreId, userProfileToSend).then(() => getAndSetChores())
  }

  return (
    <>
      <h2>My Chores List</h2>
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
          {userChores.map((c) => (
            <tr key={c.id} >
              <th scope="row">{`${c.id}`}</th>
              <td>{c.name}</td>
              <td>{c.difficulty}</td>
              <td>{c.choreFrequencyDays}</td>
              <td>
                <Button color="info" onClick={e => handleCompleteBtn(e, c.id)}>Complete</Button>
                {loggedInUser.roles.includes("Admin") ? (
                  <>
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