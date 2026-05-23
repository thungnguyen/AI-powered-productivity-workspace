using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using ZenNote.Domain.Entities;

namespace ZenNote.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Workspace> Workspaces { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
