*, *::before, *::after {
  box-sizing: border-box;
}

body {
  background: #1e1e1e;
  color: white;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 🔑 prevent vertical stretching */
  min-height: 100vh;
}

.container {
  max-width: 900px;
  width: 100%;
  background: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  margin-top: 20px;
}

/* Layout */
.content-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start; /* 🔑 key fix */
}

/* LEFT */
.form-container {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

label {
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #aaa;
  background: #555;
  color: white;
  border-radius: 5px;
}

/* RIGHT */
.output-container {
  flex: 1;
  background: transparent;
}

/* OUTPUT BOX */
.output-box {
  position: relative;
  width: 100%;
  background: #444;
  border: 1px solid #666;
  padding: 12px;
  cursor: pointer;
  white-space: pre-wrap;
  overflow-y: auto;
  text-align: left;
  font-family: monospace;
  border-radius: 5px;

  /* Align with first input field */
  margin-top: 28px;

  /* 🔑 do NOT stretch height */
  height: auto;
  min-height: 120px;
}

.output-box:hover {
  border-color: #28a745;
}

/* Copied stamp */
.copy-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-10deg);
  pointer-events: none;
  opacity: 0.85;
  max-width: 70%;
  max-height: 70%;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  z-index: 9999;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .output-box {
    margin-top: 0;
  }
}
