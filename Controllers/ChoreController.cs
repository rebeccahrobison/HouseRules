using HouseRules.Data;
using HouseRules.Models;
using HouseRules.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
      return Ok(_dbContext
        .Chores
        .Include(c => c.ChoreAssignments)
        .Include(c => c.ChoreCompletions)
        .Select(c => new ChoreDTO
        {
          Id = c.Id,
          Name = c.Name,
          Difficulty = c.Difficulty,
          ChoreFrequencyDays = c.ChoreFrequencyDays,
          ChoreAssignments = c.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
          {
            Id = ca.Id,
            UserProfileId = ca.UserProfileId,
            ChoreId = ca.ChoreId
          }).ToList(),
          ChoreCompletions = c.ChoreCompletions.Select(cc => new ChoreCompletionDTO
          {
            Id = cc.Id,
            UserProfileId = cc.UserProfileId,
            ChoreId = cc.ChoreId,
            CompletedOn = cc.CompletedOn
          }).ToList()
        })
        .ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
      Chore chore = _dbContext
        .Chores
        .Include(c => c.ChoreCompletions)
        .Include(c => c.ChoreAssignments)
          .ThenInclude(ca => ca.UserProfile)
        .SingleOrDefault(c => c.Id == id);

      if (chore == null)
      {
        return NotFound();
      }

      return Ok(chore);
    }

    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CompleteChore(int id, UserProfile user)
    {
      Chore foundChore = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
      UserProfile foundUser = _dbContext.UserProfiles.FirstOrDefault(u => u.Id == user.Id);
      if (foundChore == null)
      {
        return NotFound("Chore not found");
      }
      if (foundUser == null)
      {
        // Console.WriteLine("userId", userId);
        // Console.WriteLine("TypeOf",userId.GetType());
        return NotFound("User not found");
      }

        ChoreCompletion completedChore = new ChoreCompletion
        {
            ChoreId = id,
            CompletedOn = DateTime.Now,
            UserProfileId = user.Id
        };

      _dbContext.ChoreCompletions.Add(completedChore);
      _dbContext.SaveChanges();
      return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult PostChore(Chore chore)
    {
      _dbContext.Chores.Add(chore);
      _dbContext.SaveChanges();
      return Created($"/chores/{chore.Id}", chore);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(int id, Chore chore)
    {
      Chore choreToUpdate = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
      if (choreToUpdate == null)
      {
        return NotFound();
      }

      choreToUpdate.Name = chore.Name;
      choreToUpdate.Difficulty = chore.Difficulty;
      choreToUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;

      _dbContext.SaveChanges();
      return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
      Chore choreToDelete = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
      if (choreToDelete == null)
      {
        return NotFound();
      }
      _dbContext.Chores.Remove(choreToDelete);
      _dbContext.SaveChanges();

      return NoContent();
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public IActionResult AssignChore (int id, int? userId)
    {
      Chore foundChore = _dbContext.Chores.FirstOrDefault(c => c.Id == id);
      UserProfile foundUser = _dbContext.UserProfiles.FirstOrDefault(u => u.Id == userId);
      if (foundChore == null || foundUser == null)
      {
        return NotFound();
      }

        ChoreAssignment choreAssignment = new ChoreAssignment
        {
            UserProfileId = (int)userId,
            ChoreId = id
        };

      _dbContext.ChoreAssignments.Add(choreAssignment);
      _dbContext.SaveChanges();
      return NoContent();
    }

    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult UnassignChore (int id, int? userId)
    {
      ChoreAssignment foundChoreAssignment = _dbContext.ChoreAssignments
        .FirstOrDefault(ca => ca.ChoreId == id && ca.UserProfileId == userId);
      
      if (foundChoreAssignment == null)
      {
        return NotFound();
      }

      _dbContext.ChoreAssignments.Remove(foundChoreAssignment);
      _dbContext.SaveChanges();
      return NoContent();
    }
}
