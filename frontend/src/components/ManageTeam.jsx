import React, { useState } from "react";
import styles from "./styles/ManageTeam.module.css";
import CreateModal from "./CreateModal";

function ManageTeam() {
  const [modalType, setModalType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal for team or department
  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Create A New Team or Department</div>
      <div className={styles.buttons}>
        <div
          className={styles.createButton}
          onClick={() => handleOpenModal("Team")}
        >
          New Team
        </div>
        <div
          className={styles.createButton}
          onClick={() => handleOpenModal("Department")}
        >
          New Department
        </div>
      </div>
      <CreateModal
        open={modalOpen}
        type={modalType}
        handleClose={handleCloseModal}
      />
    </div>
  );
}

export default ManageTeam;
