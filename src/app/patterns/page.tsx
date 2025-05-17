"use client";

import PaperBlock from "@/components/ui-kit/PaperBlock";
import TexturedOverlay from "@/components/ui-kit/TextureOverlay";

const PatternsPage = () => {
  return (
    <TexturedOverlay opacity={0.05}>
      <PaperBlock
        className="flex  bg-amber-300 flex-col-2 items-center justify-center h-screen"
        background="texture"
      >
        <div className="flex h-full items-center justify-center">
          <TexturedOverlay position="above" className="flex" opacity={0.05}>
            <PaperBlock
              className="grid grid-rows-4 grid-cols-4 flex-row flex-grow border"
              background="default"
            >
              {" "}
            </PaperBlock>
          </TexturedOverlay>
        </div>
      </PaperBlock>
    </TexturedOverlay>
  );
};
export default PatternsPage;
