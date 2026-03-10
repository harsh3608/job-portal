var builder = WebApplication.CreateBuilder(args);

// Add YARP Reverse Proxy with configuration from appsettings
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();

app.Run();
