import { useEffect, useState } from "react"
import { assignChore, getChoreById, unassignChore, updateChore } from "../../managers/choreManager"
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, Table } from "reactstrap";
import { getUserProfiles } from "../../managers/userProfileManager";
import "../chores/Chores.css"

export const ChoreDetails = () => {
  const [chore, setChore] = useState([])
  const [users, setUsers] = useState([])
  const [assignedUsers, setAssignedUsers] = useState([])

  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    getChoreById(id).then(obj => {
      setChore(obj)
      setAssignedUsers(obj?.choreAssignments?.map(ca => ca.userProfileId) || [])
    })
  }, [id])

  useEffect(() => {
    getUserProfiles().then(arr => setUsers(arr))
  }, [])


  const mostRecentCompletionDate = chore?.choreCompletions && chore.choreCompletions.length > 0
    ? new Date(Math.max(...chore.choreCompletions.map(cc => new Date(cc.completedOn))))
    : null;

  const handleCheckBox = async (userId) => {
    const isAssigned = assignedUsers.includes(userId)

    try {
      if (isAssigned) {
        await unassignChore(chore.id, userId);
      } else {
        await assignChore(chore.id, userId);
      }

      // Update local state
      if (isAssigned) {
        setAssignedUsers(assignedUsers.filter(id => id !== userId));
      } else {
        setAssignedUsers([...assignedUsers, userId]);
      }

      // Re-fetch the chore
      getChoreById(id).then(obj => setChore(obj));

    } catch (error) {
      console.error("Error updating chore assignments:", error);
    }
  }

  const handleSubmitBtn = (e) => {
    e.preventDefault()

    const updatedChore = {
      id: chore.id,
      name: chore.name,
      difficulty: chore.difficulty,
      choreFrequencyDays: chore.choreFrequencyDays,
      choreAssignments: [],
      choreCompletions: []
    }
    updateChore(updatedChore).then(() => navigate("/chores"))
  }

  return (
    <>
      <h2>Chore Details</h2>
      <Form className="chore-details">
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={chore.name}
            onChange={(e) => {
              // const stateCopy = {...chore}
              // stateCopy[e.target.name] = e.target.value
              // setChore(stateCopy)
              setChore(prevChore => ({
                ...prevChore,
                [e.target.name]: e.target.value
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Difficulty</Label>
          <Input
            type="text"
            name="difficulty"
            value={chore.difficulty}
            onChange={(e) => {
              setChore(prevChore => ({
                ...prevChore,
                [e.target.name]: parseInt(e.target.value)
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Frequency</Label>
          <Input
            type="text"
            name="choreFrequencyDays"
            value={chore.choreFrequencyDays}
            onChange={(e) => {
              setChore(prevChore => ({
                ...prevChore,
                [e.target.name]: parseInt(e.target.value)
              }))
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Current Assignees</Label>
          {users.map(u => {
            return (
              <div key={u.id}>
                <input
                  type="checkbox"
                  name={`user_${u.id}`}
                  id={`user_${u.id}`}
                  checked={assignedUsers.includes(u.id)}
                  onChange={() => handleCheckBox(u.id)}
                />
                <label className="assignee-label" htmlFor={`user_${u.id}`}>{u.firstName} {u.lastName}</label>
              </div>
            )
          })}
        </FormGroup>
        <FormGroup>
          <Label>Most Recent Completion</Label>
          <div>{mostRecentCompletionDate ? mostRecentCompletionDate.toISOString().slice(0, 10) : ''}</div>
        </FormGroup>
      </Form>
      <Button color="danger" onClick={e => handleSubmitBtn(e)}>Submit</Button>
    </>
  )
}




      {/* <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Frequency</th>
            <th>Current Assignees</th>
            <th>Most Recent Completion</th>
          </tr>
        </thead>
        <tbody>
          <tr key={chore.id}>
            <td>{chore.name}</td>
            <td>{chore.difficulty}</td>
            <td>{chore.choreFrequencyDays}</td>
            <td>
              {users.map(u => {
                return (
                  <div key={u.id}>
                    <input
                      type="checkbox"
                      name={`user_${u.id}`}
                      id={`user_${u.id}`}
                      checked={assignedUsers.includes(u.id)}
                      onChange={() => handleCheckBox(u.id)}
                    />
                    <label htmlFor={`user_${u.id}`}>{u.firstName} {u.lastName}</label>
                  </div>
                )
              })}
            </td>
            {chore?.choreAssignments?.length > 0 ?
              chore?.choreAssignments?.map(ca => {
                return (
                  <td key={ca.id}>{ca?.userProfile?.firstName} {ca?.userProfile?.lastName}</td>
                )
              })
              :
              <td>No Assignees</td>
            }
            <td>{mostRecentCompletionDate ? mostRecentCompletionDate.toISOString().slice(0, 10) : ''}</td>
          </tr>
        </tbody>
      </Table> */}