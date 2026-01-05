namespace Backend.Features.Customers.Dto {
    public class CustomerListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Address { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Iban { get; set; } = "";

        public string? CategoryCode { get; set; }
        public string? CategoryDescription { get; set; }
    }
}