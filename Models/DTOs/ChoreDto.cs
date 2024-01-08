using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models.DTOs;

public class ChoreDTO
{
  public int Id { get; set; }
  [Required]
  public string Name { get; set; }
  public int Difficulty { get; set; }
  public int ChoreFrequencyDays { get; set; }
  public List<ChoreCompletionDTO> ChoreCompletions { get; set; }
}