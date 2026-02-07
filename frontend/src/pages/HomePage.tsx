import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Flipped Classroom</h2>
      </div>

      {/* ===== BODY ===== */}
      <div style={styles.body}>
        {/* ===== IMAGE / BANNER ===== */}
        <img
          src="https://img.freepik.com/free-vector/flipped-classroom-concept-illustration_114360-8152.jpg
"
          alt="banner"
          style={styles.image}
        />

        {/* ===== BUTTONS ===== */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.chatBtn}
            onClick={() => navigate("/chatbot")}
          >
            🤖 Chatbot
          </button>

          <button
            style={styles.trainBtn}
            onClick={() => navigate("/auto-train")}
          >
            ⚙️ Auto Train
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#eef2f6",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    background: "#ffffff",
    padding: 15,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },

  image: {
    width: 420,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  buttonGroup: {
    display: "flex",
    gap: 40,
  },

  chatBtn: {
    padding: "14px 30px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    background: "#3b6cb7",
    color: "#fff",
    cursor: "pointer",
  },

  trainBtn: {
    padding: "14px 30px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    background: "#2f5da8",
    color: "#fff",
    cursor: "pointer",
  },
};
