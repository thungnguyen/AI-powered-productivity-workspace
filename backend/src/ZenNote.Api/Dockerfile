FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/ZenNote.Api/ZenNote.Api.csproj", "src/ZenNote.Api/"]
COPY ["src/ZenNote.Application/ZenNote.Application.csproj", "src/ZenNote.Application/"]
COPY ["src/ZenNote.Domain/ZenNote.Domain.csproj", "src/ZenNote.Domain/"]
COPY ["src/ZenNote.Infrastructure/ZenNote.Infrastructure.csproj", "src/ZenNote.Infrastructure/"]

RUN dotnet restore "src/ZenNote.Api/ZenNote.Api.csproj"

COPY . .
WORKDIR "/src/src/ZenNote.Api"
RUN dotnet build "ZenNote.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ZenNote.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ZenNote.Api.dll"]
