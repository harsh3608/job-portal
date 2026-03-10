FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["EmployerService.csproj", "./"]
RUN dotnet restore "EmployerService.csproj"
COPY . .
RUN dotnet build "EmployerService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EmployerService.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EmployerService.dll"]
