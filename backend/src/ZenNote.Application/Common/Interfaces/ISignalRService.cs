using System.Threading;
using System.Threading.Tasks;

namespace ZenNote.Application.Common.Interfaces;

public interface ISignalRService
{
    Task SendToUserAsync(string userId, string method, object arg, CancellationToken cancellationToken = default);
    Task SendToAllAsync(string method, object arg, CancellationToken cancellationToken = default);
}
