using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;
using ZenNote.Application.Common.Interfaces;

namespace ZenNote.Infrastructure.Realtime;

public class SignalRService : ISignalRService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToUserAsync(string userId, string method, object arg, CancellationToken cancellationToken = default)
    {
        if (cancellationToken.IsCancellationRequested) return;
        await _hubContext.Clients.User(userId).SendAsync(method, arg, cancellationToken);
    }

    public async Task SendToAllAsync(string method, object arg, CancellationToken cancellationToken = default)
    {
        if (cancellationToken.IsCancellationRequested) return;
        await _hubContext.Clients.All.SendAsync(method, arg, cancellationToken);
    }
}
