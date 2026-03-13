var builder = DistributedApplication.CreateBuilder(args);

// ── Infrastructure ────────────────────────────────────────────
var sql = builder.AddSqlServer("sqlserver")
    .WithDataVolume("sqlserver-data");

var redis = builder.AddRedis("redis");
var rabbitMq = builder.AddRabbitMQ("rabbitmq");
var elasticsearch = builder.AddElasticsearch("elasticsearch");

// ── Databases (one per service) ───────────────────────────────
var authDb = sql.AddDatabase("AuthDb");
var candidateDb = sql.AddDatabase("CandidateDb");
var employerDb = sql.AddDatabase("EmployerDb");
var jobDb = sql.AddDatabase("JobDb");
var applicationDb = sql.AddDatabase("ApplicationDb");

// ── Services ──────────────────────────────────────────────────
var authService = builder.AddProject<Projects.AuthService>("auth-service")
    .WithReference(authDb).WaitFor(authDb);

var candidateService = builder.AddProject<Projects.CandidateService>("candidate-service")
    .WithReference(candidateDb).WaitFor(candidateDb);

var employerService = builder.AddProject<Projects.EmployerService>("employer-service")
    .WithReference(employerDb).WaitFor(employerDb);

var jobService = builder.AddProject<Projects.JobService>("job-service")
    .WithReference(jobDb).WaitFor(jobDb)
    .WithReference(redis).WaitFor(redis);

var applicationService = builder.AddProject<Projects.ApplicationService>("application-service")
    .WithReference(applicationDb).WaitFor(applicationDb)
    .WithReference(rabbitMq).WaitFor(rabbitMq);

var resumeSearchService = builder.AddProject<Projects.ResumeSearchService>("resume-search-service")
    .WithReference(elasticsearch).WaitFor(elasticsearch);

// ── API Gateway ───────────────────────────────────────────────
// Reuse the existing 'http' endpoint from launchSettings.json, overriding its port to 5000
// so the Angular dev server can always reach the gateway at http://localhost:5000
var apiGateway = builder.AddProject<Projects.ApiGateway>("api-gateway")
    .WithEndpoint("http", e => e.Port = 5000)
    .WithReference(authService).WaitFor(authService)
    .WithReference(candidateService).WaitFor(candidateService)
    .WithReference(employerService).WaitFor(employerService)
    .WithReference(jobService).WaitFor(jobService)
    .WithReference(applicationService).WaitFor(applicationService)
    .WithReference(resumeSearchService).WaitFor(resumeSearchService);

// ── Frontend Angular app ──────────────────────────────────────
// ng serve defaults to port 4200 and doesn't read a PORT env var,
// so isProxied: false lets Aspire register the endpoint without injecting it.
builder.AddNpmApp("frontend", "../frontend-app", "start")
    .WithHttpEndpoint(port: 4200, isProxied: false)
    .WaitFor(apiGateway);

builder.Build().Run();
