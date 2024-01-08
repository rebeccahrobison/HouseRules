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
        .Select(c => new ChoreDTO
        {
          Id = c.Id,
          Name = c.Name,
          Difficulty = c.Difficulty,
          ChoreFrequencyDays = c.ChoreFrequencyDays
        })
        .ToList());
    }
}
