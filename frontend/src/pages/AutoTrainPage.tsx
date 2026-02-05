import "./autotrain.css";

import { FileUploader } from "../components/FileUploader";
import { useState } from "react";

export default function AutoTrainPage() {
  const [jsonMode, setJsonMode] = useState(false);

  return (
    <div className="autotrain">
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">
          <span>Auto Train</span>
        </h2>

        <label>Hugging Face User</label>
        <select>
          <option>abhishek</option>
        </select>

        <label>Task</label>
        <select>
          <option>LLM SFT</option>
        </select>

        <label>Hardware</label>
        <select>
          <option>Local/Space</option>
        </select>

        <label>Parameter Mode</label>
        <select>
          <option>Basic</option>
        </select>

        <div className="menu">
          <p>📄 Logs</p>
          <p>📘 Documentation</p>
          <p>❓ FAQs</p>
          <p>💻 GitHub Repo</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <p>Accelerators: 1</p>
            <span className="green">No running jobs</span>
          </div>

          <button className="startBtn">Start Training</button>
        </div>

        {/* PROJECT */}
        <div className="formRow">
          <div className="left">
            <label>Project Name</label>
            <input defaultValue="autotrain-sh21p-grnum" />

            <label>Base Model</label>
            <select>
              <option>openai-community/gpt2</option>
            </select>

            <label>Dataset Source</label>
            <select>
              <option>Local</option>
            </select>

            <h4 className="blue">Training Data</h4>
            <FileUploader />

            <label>Column Mapping</label>
            <input defaultValue="text" />
          </div>

          {/* PARAMETERS */}
          <div className="right">
            <div className="paramHeader">
              <h3>Parameters</h3>

              <div className="jsonToggle">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={jsonMode}
                    onChange={() => setJsonMode(!jsonMode)}
                  />
                  <span className="slider"></span>
                </label>
                <span>JSON</span>
              </div>
            </div>

            <div className="grid">
              <Field label="Chat template">
                <select disabled={jsonMode}>
                  <option>none</option>
                </select>
              </Field>

              <Field label="Mixed precision">
                <select disabled={jsonMode}>
                  <option>fp16</option>
                </select>
              </Field>

              <Field label="Optimizer">
                <select disabled={jsonMode}>
                  <option>adamw_torch</option>
                </select>
              </Field>

              <Field label="PEFT/LoRA">
                <select disabled={jsonMode}>
                  <option>true</option>
                </select>
              </Field>

              <Field label="Scheduler">
                <select disabled={jsonMode}>
                  <option>linear</option>
                </select>
              </Field>

              <Field label="Batch size">
                <input type="number" defaultValue={2} disabled={jsonMode} />
              </Field>

              <Field label="Block size">
                <input type="number" defaultValue={1024} disabled={jsonMode} />
              </Field>

              <Field label="Epochs">
                <input type="number" defaultValue={3} disabled={jsonMode} />
              </Field>

              <Field label="Gradient accumulation">
                <input type="number" defaultValue={4} disabled={jsonMode} />
              </Field>

              <Field label="Learning rate">
                <input
                  type="number"
                  step="0.00001"
                  defaultValue={0.00003}
                  disabled={jsonMode}
                />
              </Field>

              <Field label="Model max length">
                <input type="number" defaultValue={2048} disabled={jsonMode} />
              </Field>

              <Field label="Target modules">
                <input defaultValue="all-linear" disabled={jsonMode} />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
