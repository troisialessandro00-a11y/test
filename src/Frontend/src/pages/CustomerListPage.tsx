import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  Button,
} from "@mui/material";
import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface CustomerListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  categoryCode?: string | null;
  categoryDescription?: string | null;
}

function customersToXml(customers: CustomerListQuery[]): string {
  const escapeXml = (value: string | number | null | undefined) =>
    value === null || value === undefined
      ? ""
      : String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");

  const rows = customers
    .map(
      (c) => `
    <Customer>
      <Id>${escapeXml(c.id)}</Id>
      <Name>${escapeXml(c.name)}</Name>
      <Address>${escapeXml(c.address)}</Address>
      <Email>${escapeXml(c.email)}</Email>
      <Phone>${escapeXml(c.phone)}</Phone>
      <Iban>${escapeXml(c.iban)}</Iban>
      <CategoryCode>${escapeXml(c.categoryCode)}</CategoryCode>
      <CategoryDescription>${escapeXml(c.categoryDescription)}</CategoryDescription>
    </Customer>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Customers>
  ${rows}
</Customers>`;
}

function downloadXml(xml: string, filename: string) {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.click();
  URL.revokeObjectURL(url);
}

export default function CustomerListPage() {
  const [list, setList] = useState<CustomerListQuery[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  // debounce di 300ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (nameFilter) params.append("name", nameFilter);
      if (emailFilter) params.append("email", emailFilter);

      fetch(`/api/customers/list?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => setList(data as CustomerListQuery[]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [nameFilter, emailFilter]);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
        <TextField label="Filter by name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}/>
        <TextField label="Filter by email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)}/>
        <Button variant="contained" color="primary" disabled={list.length === 0}onClick={() => {const xml = customersToXml(list); downloadXml(xml, "customers.xml");}}>
          Export XML 
          <svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20h14v-2H5v2zm7-18v12l5-5h-3V4h-4v5H7l5 5z" />
          </svg>
        </Button>
      </Box>
      {/* Pulsante Export XML */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}></Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Id</StyledTableHeadCell>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Iban</StyledTableHeadCell>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.iban}</TableCell>
                <TableCell>{row.categoryCode}</TableCell>
                <TableCell>{row.categoryDescription}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));