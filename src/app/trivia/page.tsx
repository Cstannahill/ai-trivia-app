"use client";
import QuestionCard from "@/components/QuestionCard";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { Question } from "@/types/base";

export type Topics = {
  topic: string;
  difficulty: string;
};

const TriviaPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topics[]>([
    { topic: "Current Events", difficulty: "random" },
    { topic: "TypeScript", difficulty: "random" },
    { topic: "League of Legends", difficulty: "random" },
    { topic: "Final Fantasy XI", difficulty: "random" },
    { topic: "Logic", difficulty: "random" },
  ]);
  const [questionComponents, setQuestionComponents] = useState<
    React.ReactNode[]
  >([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const saveQuestions = async () => {
  //     if (!questions.length) return;

  //     console.log("USE EFFECT FIRING - questions - ", questions);
  //     try {
  //       const response = await fetch("/api/questions", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ questions }),
  //       });

  //       const result = await response.json();
  //       console.log("Saved result:", result);
  //     } catch (error) {
  //       console.error("Error saving questions:", error);
  //     }
  //   };

  //   saveQuestions();
  // }, [questions]);

  const mapQuestions = (question: Question) => {
    return (
      <QuestionCard
        key={question?.id ? question.id : Math.random()}
        category={question.category}
        question={question.question}
        options={question.options || []}
        answer={question.answer}
        explanation={question.explanation || ""}
        difficulty={question.difficulty || ""}
        createdAt={question.createdAt}
      />
    );
  };
  const handleGenerateQuestions = async () => {
    setLoading(true);
    console.log(topics, "topics line 65");
    try {
      const response = await fetch("/api/trivia", {
        method: "POST",
        body: JSON.stringify({ topics }), // Send an empty body if not needed
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      const newQs: Question[] = [...questions, ...data.questions];
      await setQuestions(newQs);
      const qComponents = newQs.map(mapQuestions);
      setQuestionComponents([...qComponents, ...questionComponents]);
      console.log(data); // Handle the generated questions as needed
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const val = e.target.value;
    setTopics((prevTopics) => {
      const newTopics = [...prevTopics];
      if (name.includes("dif")) {
        const index = parseInt(name.replace("dif", "")) - 1; // Adjust index based on name
        newTopics[index].difficulty = val;
      } else if (name.includes("topic")) {
        const index = parseInt(name.replace("topic", "")) - 1; // Adjust index based on name
        newTopics[index].topic = val;
      }
      return newTopics;
    });
  };
  return (
    <>
      <div className="flex justify-center mt-2">
        <div>
          <div className="flex justify-around items-center mb-2">
            <label
              htmlFor="topic1"
              className="block text-gray-400 text-sm font-bold"
            >
              Topic 1
            </label>
            <label
              htmlFor="topic2"
              className="block text-gray-400 text-sm font-bold"
            >
              Topic 2
            </label>
            <label className="block text-gray-400 text-sm font-bold ">
              Topic 3
            </label>
            <label className="block text-gray-400 text-sm font-bold ">
              Topic 4
            </label>
            <label className="block text-gray-400 text-sm font-bold ">
              Topic 5
            </label>
          </div>

          <form>
            <div className="mb-4 flex">
              <input
                type="text"
                value={topics[0].topic}
                onChange={handleChange}
                name="topic1"
                placeholder="Pick a topic."
                className="mx-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              />
              <select
                name="dif1"
                id="dif1"
                className="text-xs"
                onChange={handleChange}
              >
                <option className="text-sm text-slate-900" value="">
                  Random
                </option>
                <option className="text-sm text-slate-900" value="easy">
                  Easy
                </option>
                <option className="text-sm text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-sm text-slate-900" value="hard">
                  Hard
                </option>
                <option className="text-sm text-slate-900" value="random">
                  Random
                </option>
              </select>
              <input
                type="text"
                value={topics[1].topic}
                name="topic2"
                onChange={handleChange}
                placeholder="Pick a topic."
                className="mx-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              />
              <select
                name="dif2"
                id="dif2"
                className="text-xs"
                onChange={handleChange}
              >
                <option className="text-sm text-slate-900" value="">
                  Random
                </option>
                <option className="text-sm text-slate-900" value="easy">
                  Easy
                </option>
                <option className="text-sm text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-sm text-slate-900" value="hard">
                  Hard
                </option>
                <option className="text-sm text-slate-900" value="random">
                  Random
                </option>
              </select>
              <input
                type="text"
                value={topics[2].topic}
                onChange={handleChange}
                name="topic3"
                placeholder="Pick a topic."
                className="mx-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              />
              <select
                name="dif3"
                id="dif3"
                className="text-xs"
                onChange={handleChange}
              >
                <option className="text-sm text-slate-900" value="">
                  Random
                </option>
                <option className="text-sm text-slate-900" value="easy">
                  Easy
                </option>
                <option className="text-sm text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-sm text-slate-900" value="hard">
                  Hard
                </option>
                <option className="text-sm text-slate-900" value="random">
                  Random
                </option>
              </select>
              <input
                type="text"
                value={topics[3].topic}
                onChange={handleChange}
                name="topic4"
                placeholder="Pick a topic."
                className="mx-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              />
              <select
                name="dif4"
                id="dif4"
                className="text-xs"
                onChange={handleChange}
              >
                <option className="text-sm text-slate-900" value="">
                  Random
                </option>
                <option className="text-sm text-slate-900" value="easy">
                  Easy
                </option>
                <option className="text-sm text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-sm text-slate-900" value="hard">
                  Hard
                </option>
                <option className="text-sm text-slate-900" value="random">
                  Random
                </option>
              </select>
              <input
                type="text"
                value={topics[4].topic}
                onChange={handleChange}
                name="topic5"
                id="topic5"
                placeholder="Pick a topic."
                className="mx-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              />
              <select
                name="dif5"
                id="dif5"
                className="text-xs"
                onChange={handleChange}
              >
                <option className="text-sm text-slate-900" value="">
                  Random
                </option>
                <option className="text-sm text-slate-900" value="easy">
                  Easy
                </option>
                <option className="text-sm text-slate-900" value="medium">
                  Medium
                </option>
                <option className="text-sm text-slate-900" value="hard">
                  Hard
                </option>
                <option className="text-sm text-slate-900" value="random">
                  Random
                </option>
              </select>
            </div>
          </form>
        </div>
        {/* <h1 className="text-amber-300 text-2xl font-bold  mt-3">Login</h1> */}
        <div className="flex items-center justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded ml-4"
            onClick={handleGenerateQuestions}
          >
            Generate Questions
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center mt-2">
        {!loading && questionComponents?.length <= 0 ? (
          <p className="text-gray-500 text-center justify-center items-center mt-4 mx-auto w-full">
            No questions generated yet.
          </p>
        ) : loading ? (
          <>
            <p className="text-gray-500">Loading questions... </p>
            <p> </p>
            <Spinner />
          </>
        ) : null}{" "}
      </div>
      <div className="grid grid-cols-4 gap-10 mt-4 items-center justify-items-center">
        {questionComponents &&
          questionComponents.length > 0 &&
          questionComponents}
      </div>
    </>
  );
};

export default TriviaPage;
