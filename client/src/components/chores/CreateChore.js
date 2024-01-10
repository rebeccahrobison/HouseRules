import { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { createChore } from "../../managers/choreManager";
import { useNavigate } from "react-router-dom";

export const CreateChore = () => {
  const [name, setName] = useState("")
  const [choreFrequencyDays, setChoreFrequencyDays] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [errors, setErrors] = useState([])

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log("Submit button pressed.")
    const choreToSubmit = {
      name: name,
      choreFrequencyDays: parseInt(choreFrequencyDays),
      difficulty: parseInt(difficulty),
      choreCompletions: [],
      choreAssignments: []
    }
    // console.log(choreToSubmit)
    createChore(choreToSubmit).then((res) => {
      if (res.errors) {
        setErrors(res.errors)
      } else {
        navigate("/chores")
      }
    })
  }

  return (
    <>
      <h2>Create a New Chore</h2>
      <Form>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Difficulty (1-5)</Label>
          <Input
            type="text"
            value={difficulty}
            onChange={e => {
              setDifficulty(e.target.value)
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Frequency of Days</Label>
          <Input
            type="text"
            list="defaultNumbers"
            value={choreFrequencyDays}
            onChange={e => {
              setChoreFrequencyDays(e.target.value)
            }}
          />
            <datalist id="defaultNumbers">
              <option value="1"></option>
              <option value="3"></option>
              <option value="7"></option>
              <option value="10"></option>
              <option value="14"></option>
            </datalist>
        </FormGroup>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </Form>
      <div style={{ color: "red" }}>
        {Object.keys(errors).map((key) => (
          <p key={key}>
            {key}: {errors[key].join(",")}
          </p>
        ))}
      </div>
    </>
  )
}
