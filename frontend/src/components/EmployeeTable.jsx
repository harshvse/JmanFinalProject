import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EmployeeTable = ({
  onFetchEmployees,
  OnTeamUpdate,
  OnDepartmentUpdate,
  departments,
  teams,
}) => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, searchTerm]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await onFetchEmployees(page + 1, rowsPerPage, searchTerm);
      setEmployees(result.users);
      setTotalEmployees(result.pagination.totalUsers);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTeamUpdate = async (employeeId, teamId) => {
    try {
      await OnTeamUpdate(employeeId, teamId);
      fetchEmployees();
    } catch (error) {
      console.error(`Failed to update employee team ${teamid}`, error);
    }
  };

  const handleDepartmentUpdate = async (employeeId, departmentId) => {
    try {
      await OnDepartmentUpdate(employeeId, departmentId);
      fetchEmployees();
    } catch (error) {
      console.error(
        `Failed to update employee department ${departmentId}`,
        error
      );
    }
  };

  return (
    <div>
      <TextField
        label="Search employees"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
        style={{ marginBottom: "20px" }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Department</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id={`team-label-${employee.id}`}>
                        Team
                      </InputLabel>
                      <Select
                        labelId={`team-label-${employee.id}`}
                        value={employee.teamId ? employee.teamId : 0}
                        label="Team"
                        onChange={(e) =>
                          handleTeamUpdate(employee.id, e.target.value)
                        }
                      >
                        {teams.map((team) => (
                          <MenuItem key={team.id} value={team.id}>
                            {team.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id={`department-label-${employee.id}`}>
                        Department
                      </InputLabel>
                      <Select
                        labelId={`department-label-${employee.id}`}
                        value={
                          employee.departmentId ? employee.departmentId : 0
                        }
                        label="Department"
                        onChange={(e) =>
                          handleDepartmentUpdate(employee.id, e.target.value)
                        }
                      >
                        {departments.map((department) => (
                          <MenuItem
                            key={department.id}
                            value={department.id ? department.id : ""}
                          >
                            {department.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalEmployees}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default EmployeeTable;
