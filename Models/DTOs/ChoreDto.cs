using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models.DTOs;

public class ChoreDTO
{
  public int Id { get; set; }
  [Required]
  [MaxLength(100, ErrorMessage = "Chore names must be 100 characters or less")]
  public string Name { get; set; }
  [Range(1, 5)]
  public int Difficulty { get; set; }
  [Range(1, 14)]
  public int ChoreFrequencyDays { get; set; }
  public List<ChoreCompletionDTO> ChoreCompletions { get; set; }
  public List<ChoreAssignmentDTO> ChoreAssignments { get; set; }
  public bool isOverdue
  {
    get
    {
      // Check if there are any completions
      if (ChoreCompletions != null && ChoreCompletions.Any())
      {
        // Retrieve the most recent completion date using Max LINQ method
        DateTime mostRecentCompletion = ChoreCompletions.Max(c => c.CompletedOn);

        // Calculate the overdue status
        return mostRecentCompletion.AddDays(ChoreFrequencyDays) < DateTime.Today;
      }

      // If there are no completions, the chore is overdue
      return true;
    }
  }
}