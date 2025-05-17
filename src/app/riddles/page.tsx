import Chat from "@/components/Chat";
import DynamicChat from "@/components/DynamicChat";

export default function RiddlesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Riddles</h1>
      <DynamicChat
        assistantId="asst_Leq2DBlCte1LbQTiYfDBAlPL"
        initialThreadId={null}
      />
    </div>
  );
}
