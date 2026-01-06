using Backend.Infrastructure.Database;       // accesso a Customer e DbContext
using Backend.Features.Customers.Dto;       // accesso al DTO
using Microsoft.EntityFrameworkCore;        // per ToListAsync()
using Microsoft.AspNetCore.Builder;         // per IEndpointRouteBuilder
using Microsoft.AspNetCore.Routing;         // per MapGet

namespace Backend.Features.Customers
{
    public static class CustomersEndpoints
    {
        public static void MapCustomersEndpoints(this IEndpointRouteBuilder app)
        {
          app.MapGet("/api/customers/list",
                async (BackendContext context, HttpRequest request) =>
            {
                // Legge i filtri dalla query string
                var name = request.Query["name"].ToString();
                var email = request.Query["email"].ToString();

                var query = context.Customers.AsQueryable();

                // Filtro per name (case-insensitive, usa LIKE)
                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(c => EF.Functions.Like(c.Name, $"%{name}%"));

                // Filtro per email (case-insensitive, usa LIKE)
                if (!string.IsNullOrWhiteSpace(email))
                    query = query.Where(c => EF.Functions.Like(c.Email, $"%{email}%"));

                var customers = await query
                    .Select(c => new CustomerListDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Address = c.Address,
                        Email = c.Email,
                        Phone = c.Phone,
                        Iban = c.Iban,
                        CategoryCode = c.CustomerCategory != null
                            ? c.CustomerCategory.Code
                            : null,
                        CategoryDescription = c.CustomerCategory != null
                            ? c.CustomerCategory.Description
                            : null
                    })
                    .ToListAsync();

                return Results.Ok(customers);
            });

        }
    }
}