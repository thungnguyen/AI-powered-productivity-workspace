using System;
using ZenNote.Domain.Common;

namespace ZenNote.Domain.Entities;

public class Workspace : AuditableEntity
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public Guid OwnerId { get; set; }
    public string? LogoUrl { get; set; }

    // Navigation properties
    public virtual User Owner { get; set; } = null!;
}
