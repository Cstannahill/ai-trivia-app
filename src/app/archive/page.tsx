"use client";
import QuestionCard from "@/components/QuestionCard";
import { useEffect, useState } from "react";
import { Question } from "@/types/base";

const ArchivePage = () => {
  const [qs, setQs] = useState<Question[]>([]);
  const [qcs, setQcs] = useState<React.JSX.Element[]>([]);
  const handleArchiveRoutes = async () => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      console.log(data); // Handle the generated questions as needed
    } catch (error) {
      console.error("Error generating questions:", error);
    }
  };

  useEffect(() => {
    const response = fetch("/api/questions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Question[]) => {
        console.log(data);
        console.log("datafromuse");
        setQs(data);
        const segment = data.slice(0, 30);
        const qComponents = segment.map(mapQuestions);
        setQcs(qComponents);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const mapQuestions = (question: Question) => {
    return (
      <QuestionCard
        key={question?.id ? question.id : Math.random()}
        category={question.category}
        question={question.question}
        options={question.options || []}
        answer={question.answer}
        explanation={question.explanation || ""}
        difficulty={question.difficulty}
        createdAt={question.createdAt}
      />
    );
  };

  return (
    <>
      <div className="flex items-center">
        <h3 className="text-cyan-600 text-2xl  items-center mx-auto font-bold mt-3">
          Archive
        </h3>
        {/* <button
          onClick={handleArchiveRoutes}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none max-h-9 mx-4 focus:shadow-outline"
        >
          ArchiveRoutes
        </button> */}{" "}
        <p className="text-gray-400 text-sm mx-3 font-bold">
          {`Returned ${qcs.length} Questions`}
        </p>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-2">
        {qcs && qcs.length > 0 && qcs}
      </div>
    </>
  );
};

export default ArchivePage;
