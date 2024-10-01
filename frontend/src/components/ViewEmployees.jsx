import React, { useEffect, useState } from "react";
import styles from "./styles/ViewEmployees.module.css";
import EmployeeTable from "./EmployeeTable";
import { fetchWrapper } from "../helpers";

const ViewEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch departments and teams when the component mounts
    fetchDepartments();
    fetchTeams();
  }, []);

  const fetchDepartments = async () => {
    const departments = await fetchWrapper.get(
      `${import.meta.env.VITE_API_URL}/v1/api/admin/departments`
    );
    setDepartments(departments);
  };

  const fetchTeams = async () => {
    const teams = await fetchWrapper.get(
      `${import.meta.env.VITE_API_URL}/v1/api/admin/teams`
    );
    setTeams(teams);
  };

  const fetchEmployees = async (page, pageSize, searchTerm) => {
    return await fetchWrapper.get(
      `${
        import.meta.env.VITE_API_URL
      }/v1/api/admin/fetchEmployees?page=${page}&pageSize=${pageSize}&search=${searchTerm}`
    );
  };

  const updateTeam = async (employeeId, updateData) => {
    console.log(employeeId, updateData);
  };
  const updateDepartment = async (employeeId, departmentId) => {
    console.log(employeeId, departmentId);
  };

  return (
    <div className={styles.container}>
      <EmployeeTable
        onFetchEmployees={fetchEmployees}
        OnTeamUpdate={updateTeam}
        OnDepartmentUpdate={updateDepartment}
        departments={departments}
        teams={teams}
      />
    </div>
  );
};

export default ViewEmployees;
