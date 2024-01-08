using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models.DTOs;

public class ChoreCompletionDTO
{
  public int Id { get; set; }
  [Required]
  public int UserProfileId { get; set; }
  [Required]
  public int ChoreId { get; set; }
  [Required]
  public DateTime CompletedOn { get; set; }
  public UserProfileDTO UserProfile { get; set; }
  public ChoreDTO Chore { get; set; }
}