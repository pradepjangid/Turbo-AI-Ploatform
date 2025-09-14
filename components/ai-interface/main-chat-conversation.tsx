import React from "react";
import { PromptEditor } from "./prompt-editor";

const MainChatInterface = () => {
  return (
    <div className="xl:col-span-3 order-2 h-full flex flex-col">
      {/* Full chat interface */}
      <section
        aria-labelledby="prompt-editor-heading"
        className="flex-1 flex flex-col min-h-0"
      >
        <h2 id="prompt-editor-heading" className="sr-only">
          Prompt Editor
        </h2>
        <PromptEditor />
      </section>
    </div>
  );
};

export default MainChatInterface;
