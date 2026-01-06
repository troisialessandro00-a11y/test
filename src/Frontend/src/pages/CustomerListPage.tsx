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
    }, 300); // 300ms delay

    // pulisce il timeout se l'utente digita ancora
    return () => clearTimeout(timeout);
  }, [nameFilter, emailFilter]);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Clients
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
        <TextField
          label="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <TextField
          label="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
      </Box>

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
