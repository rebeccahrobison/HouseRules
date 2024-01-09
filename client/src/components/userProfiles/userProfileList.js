import { useEffect, useState } from "react"
import { getUserProfiles } from "../../managers/userProfileManager"
import { Table } from "reactstrap"
import { Link } from "react-router-dom"

export const UserProfileList = ({ loggedInUser }) => {
  const [userProfiles, setUserProfiles] = useState([])

  const getAndSetUsers = () => {
    getUserProfiles().then(arr => setUserProfiles(arr))
  }

  useEffect(() => {
    getAndSetUsers()
  }, [])

  return (
    <>
      <h2>User Profiles</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Username</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.map((up) => (
            <tr key={up.id}>
              <th scope="row">{`${up.firstName} ${up.lastName}`}</th>
              <td>{up.address}</td>
              <td>{up.email}</td>
              <td>{up.userName}</td>
              <td><Link to={`${up.id}`}>Details</Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}