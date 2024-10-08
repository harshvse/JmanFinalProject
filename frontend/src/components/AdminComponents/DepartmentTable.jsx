import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../../helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import styles from "../styles/TeamTable.module.css"; // Import the same CSS module

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, [page, rowsPerPage, search]);

  const fetchDepartments = async () => {
    try {
      const response = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/v1/api/admin/getDepartments?page=${
          page + 1
        }&pageSize=${rowsPerPage}&search=${search}`
      );
      setDepartments(response.departments);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Fixed from 5 to 10
    setPage(0);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search Departments"
        value={search}
        className={styles.input}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow className={styles.tableHead}>
              <TableCell className={styles.tableCell}>ID</TableCell>
              <TableCell className={styles.tableCell}>Name</TableCell>
              <TableCell className={styles.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  {department.id}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {department.name}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <button className={styles.button}>Edit</button>
                  <button className={styles.button}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className={styles.pagination}
      />
    </div>
  );
};

export default DepartmentTable;
