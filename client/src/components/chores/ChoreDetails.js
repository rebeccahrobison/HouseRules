import { useEffect, useState } from "react"
import { getChoreById } from "../../managers/choreManager"
import { useParams } from "react-router-dom";
import { Table } from "reactstrap";

export const ChoreDetails = () => {
  const [chore, setChore] = useState([])

  const { id } = useParams();

  useEffect(() => {
    getChoreById(id).then(obj => setChore(obj))
  }, [id])

  const mostRecentCompletionDate = chore?.choreCompletions && chore.choreCompletions.length > 0
    ? new Date(Math.max(...chore.choreCompletions.map(cc => new Date(cc.completedOn))))
    : null;

  return (
    <>
      <h2>Chore Details</h2>
      <Table>
        <thead>
          <tr>
            {/* <th>Id</th> */}
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
            {
              chore?.choreAssignments?.map(ca => {
                return (
                  <td key={ca.id}>{ca?.userProfile?.firstName} {ca?.userProfile?.lastName}</td>
                )
              })
            }
            <td>{mostRecentCompletionDate ? mostRecentCompletionDate.toISOString().slice(0, 10) : ''}</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}