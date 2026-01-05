using Backend.Features.Customers; // per MapCustomersEndpoints
using Backend.Infrastructure.Database; // per BackendContext e DbSet
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());

// Setup Database
var connectionString = builder.Configuration.GetConnectionString("Backend") 
                       ?? throw new ArgumentNullException("Backend ConnectionString not set");
builder.Services.AddDbContext<BackendContext>(x => x.UseSqlite(connectionString));

// Build app
var app = builder.Build();

app.InitAndSeedBackendContest();

// Register Swagger UI
app.UseSwaggerDocumentation();

// Register all the routes for the api
app.UseApiRoutes();

// Register customer endpoints
app.MapCustomersEndpoints();

// Run the application
app.Run();