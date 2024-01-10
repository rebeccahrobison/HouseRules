import { useEffect, useState } from "react"
import { getChores } from "../../managers/choreManager"
import { useParams } from "react-router-dom";

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
    const foundUserChores = chores?.filter(c => c.choreAssignments.some(ca => ca.userProfileId === loggedInUser.id))
    setUserChores(foundUserChores)
  }, [chores, loggedInUser])

  return (
    "Hello from UserChores"
  )
}