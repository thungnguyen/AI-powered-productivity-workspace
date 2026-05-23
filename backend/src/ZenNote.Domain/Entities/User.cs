using System;
using System.Collections.Generic;
using ZenNote.Domain.Common;

namespace ZenNote.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public virtual ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();
}
