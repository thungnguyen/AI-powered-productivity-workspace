using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using ZenNote.Application.Common.Interfaces;
using ZenNote.Infrastructure.Caching;
using ZenNote.Infrastructure.Identity;
using ZenNote.Infrastructure.Persistence;
using ZenNote.Infrastructure.Persistence.Interceptors;
using ZenNote.Infrastructure.Realtime;

namespace ZenNote.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        services.AddScoped<AuditableEntityInterceptor>();

        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=localhost;Port=3306;Database=zennote_db;User=root;Password=root_password;";
        
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        var redisConnectionString = configuration["RedisSettings:ConnectionString"] ?? "localhost:6379";
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnectionString;
            options.InstanceName = "ZenNote_";
        });
        services.AddScoped<ICacheService, RedisCacheService>();

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddSignalR();
        services.AddScoped<ISignalRService, SignalRService>();

        return services;
    }
}
